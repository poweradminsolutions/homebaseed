"""
Phase 3: Crawl4AI Website Enrichment Script

Enriches business data by crawling websites to extract homeschool-specific
information like meeting schedules, curriculum approach, enrollment requirements, etc.

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

from tqdm.asyncio import tqdm as async_tqdm

from config import EXTRACTION_FIELDS, PIPELINE_CONFIG
from prompts import format_website_extraction_prompt, format_business_description_prompt

logger = logging.getLogger(__name__)

# Logging setup
if PIPELINE_CONFIG["enable_logging"]:
    logging.basicConfig(
        level=PIPELINE_CONFIG["log_level"],
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.FileHandler(f"{PIPELINE_CONFIG['batch_output_dir']}/phase3_enrich.log"),
            logging.StreamHandler(),
        ],
    )

OUTPUT_DIR = PIPELINE_CONFIG["batch_output_dir"]
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================================
# CRAWL4AI CLIENT
# ============================================================================


class Crawl4AIClient:
    """
    Client for Crawl4AI website enrichment.

    In production, this would use the actual Crawl4AI library.
    For now, this is a mock implementation.
    """

    def __init__(self, timeout: int = 30):
        self.timeout = timeout

    async def crawl(self, url: str) -> Tuple[bool, Optional[str], str]:
        """
        Crawl a website and extract content.

        Args:
            url: Website URL to crawl

        Returns:
            Tuple of (success, content, error_message)
        """
        if not url:
            return False, None, "No URL provided"

        try:
            # TODO: Replace with actual Crawl4AI implementation
            # Example:
            # async with AsyncWebCrawler() as crawler:
            #     result = await crawler.arun(url=url, timeout=self.timeout)
            #     return result.success, result.markdown, result.error_message

            # Mock implementation for testing
            logger.debug(f"Mock crawl of {url}")
            # In production, return actual crawled content
            return True, f"Mock content from {url}", ""

        except asyncio.TimeoutError:
            return False, None, f"Timeout after {self.timeout}s"
        except Exception as e:
            return False, None, str(e)


# ============================================================================
# EXTRACTION AND ENRICHMENT
# ============================================================================


class WebsiteEnricher:
    """Enriches business records with website data."""

    def __init__(self, use_llm: bool = False):
        """
        Initialize enricher.

        Args:
            use_llm: If True, use real LLM for extraction (requires API setup)
        """
        self.crawler = Crawl4AIClient(timeout=PIPELINE_CONFIG["phase3"]["timeout_seconds"])
        self.use_llm = use_llm
        self.stats = {
            "total_records": 0,
            "websites_crawled": 0,
            "crawl_failures": 0,
            "enrichments_added": 0,
            "llm_calls": 0,
            "extraction_errors": 0,
        }

    async def enrich_record(self, record: Dict) -> Dict:
        """
        Enrich a single record with website data.

        Args:
            record: Business record from Phase 2

        Returns:
            Enriched record with extracted data
        """
        enriched = record.copy()
        self.stats["total_records"] += 1

        # Check if we have a website
        website = record.get("website")
        if not website:
            enriched["enrichment_status"] = "no_website"
            return enriched

        # Crawl website
        success, content, error = await self.crawler.crawl(website)

        if not success:
            self.stats["crawl_failures"] += 1
            enriched["enrichment_status"] = "crawl_failed"
            enriched["enrichment_error"] = error
            return enriched

        self.stats["websites_crawled"] += 1

        # Extract homeschool-specific data
        extracted = await self._extract_data(record, content)

        if extracted:
            self.stats["enrichments_added"] += 1
            enriched.update(extracted)
            enriched["enrichment_status"] = "enriched"
        else:
            enriched["enrichment_status"] = "extraction_failed"

        # Generate business description
        description = await self._generate_description(record, extracted)
        if description:
            enriched["generated_description"] = description

        return enriched

    async def _extract_data(
        self, record: Dict, website_content: str
    ) -> Optional[Dict]:
        """
        Extract homeschool-specific data from website content.

        Args:
            record: Business record
            website_content: Crawled website content

        Returns:
            Dict of extracted fields or None
        """
        try:
            if self.use_llm:
                extracted = await self._extract_with_llm(website_content)
            else:
                extracted = self._extract_with_heuristics(
                    record, website_content
                )

            return extracted

        except Exception as e:
            logger.error(
                f"Extraction error for {record.get('name')}: {e}"
            )
            self.stats["extraction_errors"] += 1
            return None

    def _extract_with_heuristics(
        self, record: Dict, website_content: str
    ) -> Dict:
        """
        Extract data using heuristics (no LLM).

        Args:
            record: Business record
            website_content: Website content

        Returns:
            Dict of extracted fields
        """
        content_lower = website_content.lower()
        extracted = {}

        # Meeting schedule heuristics
        if "meet" in content_lower and ("tuesday" in content_lower or "thursday" in content_lower):
            extracted["meeting_schedule"] = "Multiple times per week"
        elif "once a week" in content_lower:
            extracted["meeting_schedule"] = "Once per week"
        elif "monthly" in content_lower:
            extracted["meeting_schedule"] = "Monthly"

        # Curriculum heuristics
        curriculum_keywords = {
            "classical": "Classical",
            "charlotte mason": "Charlotte Mason",
            "unschooling": "Unschooling",
            "montessori": "Montessori",
            "eclectic": "Eclectic",
        }
        for keyword, approach in curriculum_keywords.items():
            if keyword in content_lower:
                extracted["curriculum_approach"] = approach
                break

        # Cost heuristics
        if "free" in content_lower:
            extracted["cost_tag"] = "Free"
        elif "$" in website_content:
            if any(
                price in website_content
                for price in ["$1", "$5", "$10", "$25", "$50"]
            ):
                extracted["cost_tag"] = "Low ($1-50/month)"
            elif any(
                price in website_content
                for price in ["$75", "$100", "$150"]
            ):
                extracted["cost_tag"] = "Moderate ($51-150/month)"
            else:
                extracted["cost_tag"] = "Premium ($151+/month)"

        # Enrollment heuristics
        if "application" in content_lower or "apply" in content_lower:
            extracted["enrollment_requirements"] = "Application required"
        elif "open enrollment" in content_lower:
            extracted["enrollment_requirements"] = "Open enrollment"

        # Parent involvement heuristics
        if "parent" in content_lower and "teach" in content_lower:
            extracted["parent_involvement_level"] = "High"
        elif "volunteer" in content_lower:
            extracted["parent_involvement_level"] = "Moderate"

        # Grade levels heuristic
        if "k-12" in content_lower or "kindergarten" in content_lower:
            extracted["grade_levels_served"] = "K-12"
        elif "elementary" in content_lower:
            extracted["grade_levels_served"] = "Elementary"
        elif "middle" in content_lower:
            extracted["grade_levels_served"] = "Middle and High School"

        return extracted

    async def _extract_with_llm(self, website_content: str) -> Dict:
        """
        Extract data using LLM (placeholder).

        Args:
            website_content: Website content to extract from

        Returns:
            Dict of extracted fields
        """
        # TODO: Implement actual LLM extraction
        # prompt = format_website_extraction_prompt(website_content)
        # response = await call_llm_api(prompt)
        # return parse_extraction_response(response)

        logger.debug("Mock LLM extraction")
        self.stats["llm_calls"] += 1
        return {}

    async def _generate_description(
        self, record: Dict, extracted: Optional[Dict]
    ) -> Optional[str]:
        """
        Generate a business description for the listing.

        Args:
            record: Business record
            extracted: Extracted data from website

        Returns:
            Generated description or None
        """
        if not extracted:
            return None

        try:
            if self.use_llm:
                description = await self._generate_with_llm(record, extracted)
            else:
                description = self._generate_with_heuristics(record, extracted)

            return description

        except Exception as e:
            logger.error(f"Description generation error for {record.get('name')}: {e}")
            return None

    def _generate_with_heuristics(self, record: Dict, extracted: Dict) -> Optional[str]:
        """
        Generate description using heuristics.

        Args:
            record: Business record
            extracted: Extracted data

        Returns:
            Generated description or None
        """
        parts = []

        # Basic description
        name = record.get("name", "This organization")
        category = record.get("primary_category", "homeschool resource")

        parts.append(f"{name} is a {category.lower()}.")

        # Add key details
        if extracted.get("curriculum_approach"):
            parts.append(
                f"They specialize in {extracted['curriculum_approach']} approach."
            )

        if extracted.get("meeting_schedule"):
            parts.append(f"They meet {extracted['meeting_schedule']}.")

        if extracted.get("grade_levels_served"):
            parts.append(f"They serve {extracted['grade_levels_served']} students.")

        if extracted.get("cost_tag"):
            parts.append(f"Cost: {extracted['cost_tag']}.")

        description = " ".join(parts)

        # Ensure it's reasonable length
        if len(description) > 500:
            description = description[:497] + "..."

        return description

    async def _generate_with_llm(
        self, record: Dict, extracted: Dict
    ) -> Optional[str]:
        """
        Generate description using LLM (placeholder).

        Args:
            record: Business record
            extracted: Extracted data

        Returns:
            Generated description or None
        """
        # TODO: Implement actual LLM generation
        # prompt = format_business_description_prompt(
        #     record.get("name"),
        #     record.get("primary_category"),
        #     record.get("setting_tags", "").split(","),
        #     extracted
        # )
        # response = await call_llm_api(prompt)
        # return extract_description_from_response(response)

        logger.debug("Mock LLM description generation")
        return None

    async def enrich_batch(self, records: List[Dict]) -> Tuple[List[Dict], Dict]:
        """
        Enrich a batch of records.

        Args:
            records: List of business records

        Returns:
            Tuple of (enriched_records, stats)
        """
        tasks = [self.enrich_record(record) for record in records]
        enriched = await async_tqdm.gather(*tasks, desc="Enriching records")

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


async def process_phase3(
    input_csv: str, output_dir: Optional[str] = None, use_llm: bool = False
) -> Tuple[str, Dict]:
    """
    Process Phase 3: Website Enrichment.

    Args:
        input_csv: Path to Phase 2 output CSV (approved records)
        output_dir: Output directory
        use_llm: Use LLM for extraction and generation

    Returns:
        Tuple of (output_csv, stats)
    """
    if output_dir is None:
        output_dir = OUTPUT_DIR

    os.makedirs(output_dir, exist_ok=True)

    # Load Phase 2 data
    logger.info(f"Loading Phase 2 data from {input_csv}")
    records = load_csv(input_csv)

    if not records:
        logger.error(f"No records found in {input_csv}")
        return "", {}

    # Process through Phase 3
    logger.info("Starting Phase 3 enrichment...")
    enricher = WebsiteEnricher(use_llm=use_llm)

    # Process in batches to manage concurrency
    batch_size = PIPELINE_CONFIG["phase3"]["concurrent_workers"]
    enriched_records = []

    for i in range(0, len(records), batch_size):
        batch = records[i : i + batch_size]
        batch_enriched, _ = await enricher.enrich_batch(batch)
        enriched_records.extend(batch_enriched)

    # Save output
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"{output_dir}/phase3_enriched_{timestamp}.csv"

    save_records_to_csv(enriched_records, output_file)

    # Save stats
    stats_file = f"{output_dir}/phase3_stats_{timestamp}.json"
    with open(stats_file, "w") as f:
        json.dump(enricher.stats, f, indent=2)
    logger.info(f"Stats saved to {stats_file}")

    # Log summary
    logger.info("\n" + "=" * 50)
    logger.info("PHASE 3 SUMMARY")
    logger.info("=" * 50)
    logger.info(f"Total records processed: {enricher.stats['total_records']}")
    logger.info(f"Websites crawled: {enricher.stats['websites_crawled']}")
    logger.info(f"Crawl failures: {enricher.stats['crawl_failures']}")
    logger.info(f"Enrichments added: {enricher.stats['enrichments_added']}")
    logger.info(f"Extraction errors: {enricher.stats['extraction_errors']}")
    logger.info("=" * 50)

    return output_file, enricher.stats


def main():
    """Main entry point for Phase 3."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Phase 3: Website Enrichment with Crawl4AI"
    )
    parser.add_argument("input_csv", help="Path to Phase 2 approved CSV")
    parser.add_argument("--output-dir", help="Output directory")
    parser.add_argument("--use-llm", action="store_true", help="Use LLM for extraction")

    args = parser.parse_args()

    if not os.path.exists(args.input_csv):
        logger.error(f"Input file not found: {args.input_csv}")
        sys.exit(1)

    output_file, stats = asyncio.run(
        process_phase3(args.input_csv, args.output_dir, args.use_llm)
    )

    logger.info(f"\nOutput: {output_file}")


if __name__ == "__main__":
    main()
