"""
Phase 4: Image Enrichment Script

Discovers and validates images for homeschool resource listings.
Extracts images from websites and validates them for appropriateness.

Can be run standalone or as part of the full pipeline.
"""

import asyncio
import csv
import json
import logging
import os
import sys
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from urllib.parse import urljoin, urlparse

from tqdm.asyncio import tqdm as async_tqdm

from config import PIPELINE_CONFIG
from prompts import format_image_validation_prompt, format_image_discovery_prompt

logger = logging.getLogger(__name__)

# Logging setup
if PIPELINE_CONFIG["enable_logging"]:
    logging.basicConfig(
        level=PIPELINE_CONFIG["log_level"],
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.FileHandler(f"{PIPELINE_CONFIG['batch_output_dir']}/phase4_images.log"),
            logging.StreamHandler(),
        ],
    )

OUTPUT_DIR = PIPELINE_CONFIG["batch_output_dir"]
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================================
# IMAGE DISCOVERY AND VALIDATION
# ============================================================================


class ImageExtractor:
    """Extracts and validates images from business websites."""

    def __init__(self, use_llm: bool = False):
        """
        Initialize image extractor.

        Args:
            use_llm: If True, use real LLM for validation
        """
        self.use_llm = use_llm
        self.stats = {
            "total_records": 0,
            "websites_with_images": 0,
            "images_discovered": 0,
            "images_validated": 0,
            "images_added": 0,
            "validation_errors": 0,
        }

    def _is_valid_image_url(self, url: str) -> bool:
        """
        Check if URL points to a valid image.

        Args:
            url: Image URL

        Returns:
            True if valid image URL
        """
        if not url:
            return False

        valid_extensions = PIPELINE_CONFIG["phase4"]["valid_extensions"]
        url_lower = url.lower()

        return any(url_lower.endswith(ext) for ext in valid_extensions)

    def _extract_images_from_html(self, html_content: str, base_url: str) -> List[str]:
        """
        Extract image URLs from HTML content (heuristic approach).

        Args:
            html_content: HTML content from website
            base_url: Base URL for resolving relative URLs

        Returns:
            List of image URLs
        """
        images = []

        try:
            # Simple regex-based extraction (in production, use BeautifulSoup or similar)
            import re

            # Find img src attributes
            pattern = r'<img[^>]+src=["\']([^"\']+)["\']'
            matches = re.findall(pattern, html_content)

            for match in matches:
                # Convert relative URLs to absolute
                if match.startswith(("http://", "https://")):
                    url = match
                elif match.startswith("/"):
                    url = urljoin(base_url, match)
                else:
                    url = urljoin(base_url, match)

                if self._is_valid_image_url(url):
                    images.append(url)

            # Limit to max images
            max_images = PIPELINE_CONFIG["phase4"]["max_image_count"]
            return images[:max_images]

        except Exception as e:
            logger.debug(f"Error extracting images from HTML: {e}")
            return []

    async def validate_image(
        self, image_url: str, business_name: str, category: str
    ) -> Tuple[bool, Dict]:
        """
        Validate an image for appropriateness.

        Args:
            image_url: Image URL
            business_name: Business name (for context)
            category: Business category (for context)

        Returns:
            Tuple of (is_valid, validation_result)
        """
        try:
            if self.use_llm:
                result = await self._validate_with_llm(image_url, business_name, category)
            else:
                result = self._validate_with_heuristics(image_url)

            self.stats["images_validated"] += 1

            return result.get("is_valid", False), result

        except Exception as e:
            logger.error(f"Image validation error for {image_url}: {e}")
            self.stats["validation_errors"] += 1
            return False, {"error": str(e)}

    def _validate_with_heuristics(self, image_url: str) -> Dict:
        """
        Validate image using heuristics (no LLM).

        Args:
            image_url: Image URL

        Returns:
            Validation result dict
        """
        result = {
            "url": image_url,
            "is_valid": True,
            "suitability": "Good",
            "confidence": 0.65,
            "reasoning": "URL structure appears valid",
        }

        # Check for obvious red flags
        url_lower = image_url.lower()

        # Flag generic/stock images
        if any(
            domain in url_lower
            for domain in ["unsplash", "pexels", "pixabay", "shutterstock"]
        ):
            result["suitability"] = "Acceptable"
            result["confidence"] = 0.5
            result["reasoning"] = "Generic stock image, may not be business-specific"

        # Flag very small images (likely icons)
        if "icon" in url_lower or "logo" in url_lower:
            result["suitability"] = "Acceptable"
            result["confidence"] = 0.4

        return result

    async def _validate_with_llm(
        self, image_url: str, business_name: str, category: str
    ) -> Dict:
        """
        Validate image using LLM (placeholder).

        Args:
            image_url: Image URL
            business_name: Business name
            category: Business category

        Returns:
            Validation result dict
        """
        # TODO: Implement actual LLM image validation
        # This would typically:
        # 1. Download image
        # 2. Send to vision model
        # 3. Get suitability assessment

        logger.debug(f"Mock LLM validation for {image_url}")

        result = {
            "url": image_url,
            "is_valid": True,
            "suitability": "Good",
            "confidence": 0.85,
            "reasoning": "LLM validation passed",
        }

        return result

    async def discover_images(self, record: Dict, website_content: str) -> List[str]:
        """
        Discover images for a business.

        Args:
            record: Business record
            website_content: Website HTML content

        Returns:
            List of valid image URLs
        """
        images = []

        # Extract images from website content
        website = record.get("website")
        if website and website_content:
            extracted = self._extract_images_from_html(website_content, website)
            images.extend(extracted)

        self.stats["images_discovered"] += len(images)

        # Optionally generate image suggestions via LLM
        if self.use_llm and not images:
            suggested = await self._suggest_images(record)
            images.extend(suggested)

        return images

    async def _suggest_images(self, record: Dict) -> List[str]:
        """
        Suggest types of images to search for (LLM-based).

        Args:
            record: Business record

        Returns:
            List of suggested image search terms
        """
        # TODO: Implement LLM-based image suggestions
        # prompt = format_image_discovery_prompt(...)
        # response = await call_llm_api(prompt)
        # return extract_suggestions(response)

        logger.debug(f"Mock image suggestions for {record.get('name')}")
        return []

    async def enrich_record(
        self, record: Dict, website_content: Optional[str] = None
    ) -> Dict:
        """
        Enrich a record with images.

        Args:
            record: Business record
            website_content: Website HTML content (optional)

        Returns:
            Enriched record with image data
        """
        enriched = record.copy()
        self.stats["total_records"] += 1

        # Discover images
        images = await self.discover_images(record, website_content or "")

        if images:
            self.stats["websites_with_images"] += 1

            # Validate images
            validated_images = []
            for image_url in images:
                is_valid, validation = await self.validate_image(
                    image_url,
                    record.get("name", ""),
                    record.get("primary_category", ""),
                )

                if is_valid:
                    validated_images.append({
                        "url": image_url,
                        "suitability": validation.get("suitability"),
                        "confidence": validation.get("confidence"),
                    })

            if validated_images:
                self.stats["images_added"] += 1
                enriched["images"] = json.dumps(validated_images)
                enriched["image_count"] = len(validated_images)
                enriched["image_status"] = "images_found"
            else:
                enriched["image_status"] = "no_valid_images"
        else:
            enriched["image_status"] = "no_images_discovered"

        return enriched

    async def enrich_batch(
        self, records: List[Dict], website_contents: Optional[List[str]] = None
    ) -> Tuple[List[Dict], Dict]:
        """
        Enrich a batch of records with images.

        Args:
            records: List of business records
            website_contents: List of website content (optional)

        Returns:
            Tuple of (enriched_records, stats)
        """
        tasks = []
        for i, record in enumerate(records):
            content = website_contents[i] if website_contents and i < len(website_contents) else None
            tasks.append(self.enrich_record(record, content))

        enriched = await async_tqdm.gather(*tasks, desc="Processing images")

        return enriched, self.stats


# ============================================================================
# FILE I/O FUNCTIONS
# ============================================================================


def load_csv(filename: str) -> List[Dict]:
    """Load records from CSV file."""
    records = []
    try:
        with open(filename, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            records = list(reader)
        logger.info(f"Loaded {len(records)} records from {filename}")
        return records
    except Exception as e:
        logger.error(f"Error loading CSV {filename}: {e}")
        return []


def save_records_to_csv(records: List[Dict], filename: str) -> bool:
    """Save records to CSV file."""
    if not records:
        logger.warning(f"No records to save to {filename}")
        return False

    try:
        # Get all fieldnames from records
        fieldnames = set()
        for record in records:
            fieldnames.update(record.keys())
        fieldnames = sorted(list(fieldnames))

        with open(filename, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(records)

        logger.info(f"Saved {len(records)} records to {filename}")
        return True
    except Exception as e:
        logger.error(f"Error saving CSV {filename}: {e}")
        return False


# ============================================================================
# MAIN FUNCTION
# ============================================================================


async def process_phase4(
    input_csv: str, output_dir: Optional[str] = None, use_llm: bool = False
) -> Tuple[str, Dict]:
    """
    Process Phase 4: Image Enrichment.

    Args:
        input_csv: Path to Phase 3 output CSV (enriched records)
        output_dir: Output directory
        use_llm: Use LLM for image validation

    Returns:
        Tuple of (output_csv, stats)
    """
    if output_dir is None:
        output_dir = OUTPUT_DIR

    os.makedirs(output_dir, exist_ok=True)

    # Load Phase 3 data
    logger.info(f"Loading Phase 3 data from {input_csv}")
    records = load_csv(input_csv)

    if not records:
        logger.error(f"No records found in {input_csv}")
        return "", {}

    # Process through Phase 4
    logger.info("Starting Phase 4 image enrichment...")
    extractor = ImageExtractor(use_llm=use_llm)

    # Process in batches
    batch_size = PIPELINE_CONFIG["phase3"]["concurrent_workers"]
    enriched_records = []

    for i in range(0, len(records), batch_size):
        batch = records[i : i + batch_size]
        batch_enriched, _ = await extractor.enrich_batch(batch)
        enriched_records.extend(batch_enriched)

    # Save output
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"{output_dir}/phase4_images_{timestamp}.csv"

    save_records_to_csv(enriched_records, output_file)

    # Save stats
    stats_file = f"{output_dir}/phase4_stats_{timestamp}.json"
    with open(stats_file, "w") as f:
        json.dump(extractor.stats, f, indent=2)
    logger.info(f"Stats saved to {stats_file}")

    # Log summary
    logger.info("\n" + "=" * 50)
    logger.info("PHASE 4 SUMMARY")
    logger.info("=" * 50)
    logger.info(f"Total records processed: {extractor.stats['total_records']}")
    logger.info(f"Websites with images: {extractor.stats['websites_with_images']}")
    logger.info(f"Total images discovered: {extractor.stats['images_discovered']}")
    logger.info(f"Images validated: {extractor.stats['images_validated']}")
    logger.info(f"Records with images added: {extractor.stats['images_added']}")
    logger.info(f"Validation errors: {extractor.stats['validation_errors']}")
    logger.info("=" * 50)

    return output_file, extractor.stats


def main():
    """Main entry point for Phase 4."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Phase 4: Image Enrichment"
    )
    parser.add_argument("input_csv", help="Path to Phase 3 enriched CSV")
    parser.add_argument("--output-dir", help="Output directory")
    parser.add_argument("--use-llm", action="store_true", help="Use LLM for validation")

    args = parser.parse_args()

    if not os.path.exists(args.input_csv):
        logger.error(f"Input file not found: {args.input_csv}")
        sys.exit(1)

    output_file, stats = asyncio.run(
        process_phase4(args.input_csv, args.output_dir, args.use_llm)
    )

    logger.info(f"\nOutput: {output_file}")


if __name__ == "__main__":
    main()
