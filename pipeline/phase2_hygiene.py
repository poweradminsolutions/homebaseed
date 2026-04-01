"""
Phase 2: Data Hygiene & Classification Script

Cleans business data and classifies resources using tiered approach:
1. Basic data hygiene (validation, standardization)
2. Relevance classification (YES/MAYBE/NO for homeschool resources)
3. Category and tag assignment

Can be run standalone or as part of the full pipeline.
"""

import asyncio
import csv
import json
import logging
import os
import re
import sys
from datetime import datetime
from typing import Dict, List, Optional, Tuple

from tqdm import tqdm

from config import EXCLUSION_KEYWORDS, PIPELINE_CONFIG, RELEVANCE_THRESHOLDS
from prompts import format_relevance_classification_prompt, format_category_assignment_prompt

logger = logging.getLogger(__name__)

# Logging setup
if PIPELINE_CONFIG["enable_logging"]:
    logging.basicConfig(
        level=PIPELINE_CONFIG["log_level"],
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.FileHandler(f"{PIPELINE_CONFIG['batch_output_dir']}/phase2_hygiene.log"),
            logging.StreamHandler(),
        ],
    )

OUTPUT_DIR = PIPELINE_CONFIG["batch_output_dir"]
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================================
# DATA HYGIENE FUNCTIONS
# ============================================================================


def validate_phone(phone: Optional[str]) -> Optional[str]:
    """
    Validate and normalize phone number.

    Args:
        phone: Raw phone number

    Returns:
        Normalized phone or None if invalid
    """
    if not phone:
        return None

    # Remove common non-numeric characters
    cleaned = re.sub(r"[^\d+\-() ]", "", phone).strip()

    # Check if it contains at least 10 digits (US standard)
    digits = re.sub(r"\D", "", cleaned)
    if len(digits) >= 10:
        return cleaned

    return None


def validate_email(email: Optional[str]) -> Optional[str]:
    """
    Validate email address.

    Args:
        email: Raw email address

    Returns:
        Validated email or None if invalid
    """
    if not email:
        return None

    # Basic email validation
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if re.match(pattern, email.strip()):
        return email.strip()

    return None


def validate_website(website: Optional[str]) -> Optional[str]:
    """
    Validate and normalize website URL.

    Args:
        website: Raw website URL

    Returns:
        Normalized URL or None if invalid
    """
    if not website:
        return None

    url = website.strip()

    # Add https:// if no protocol
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    # Basic URL validation
    pattern = r"^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    if re.match(pattern, url):
        return url

    return None


def validate_address(address: Optional[str]) -> bool:
    """Check if address is valid (not empty, reasonable length)."""
    if not address:
        return False

    addr = address.strip()
    return len(addr) > 5 and addr.count(",") > 0


def check_exclusion_keywords(text: Optional[str]) -> bool:
    """
    Check if text contains exclusion keywords.

    Args:
        text: Text to check (name, type, etc.)

    Returns:
        True if exclusion keyword found (should be excluded)
    """
    if not text:
        return False

    text_lower = text.lower()
    for keyword in EXCLUSION_KEYWORDS:
        if keyword.lower() in text_lower:
            return True

    return False


def is_likely_homeschool_resource(
    name: Optional[str], type_str: Optional[str], address: Optional[str]
) -> Tuple[bool, str]:
    """
    Quick heuristic to identify likely homeschool resources.

    Args:
        name: Business name
        type_str: Business type from Google Maps
        address: Business address

    Returns:
        Tuple of (is_homeschool_resource, reason)
    """
    homeschool_keywords = [
        "homeschool",
        "home school",
        "co-op",
        "coop",
        "tutoring",
        "tutor",
        "enrichment",
        "educational",
        "curriculum",
        "academy",
        "school",
    ]

    name_lower = (name or "").lower()
    type_lower = (type_str or "").lower()

    # Strong indicators
    for keyword in ["homeschool", "home school", "co-op", "coop"]:
        if keyword in name_lower or keyword in type_lower:
            return True, f"Contains '{keyword}'"

    # Medium indicators
    score = 0
    if any(kw in name_lower for kw in homeschool_keywords):
        score += 1
    if any(kw in type_lower for kw in homeschool_keywords):
        score += 1

    if score >= 2:
        return True, "Multiple educational keywords"

    # Check exclusions
    if check_exclusion_keywords(name) or check_exclusion_keywords(type_str):
        return False, "Contains exclusion keyword"

    return False, "Insufficient homeschool indicators"


# ============================================================================
# CLASSIFICATION MOCK (Replace with actual LLM in production)
# ============================================================================


def classify_relevance_mock(
    name: str, website: str, phone: str, address: str, description: str
) -> Dict:
    """
    Mock classification function (use real LLM in production).

    This is a placeholder that uses heuristics. In production, this should
    call an LLM (Claude, GPT-4, etc.) with the RELEVANCE_CLASSIFICATION_PROMPT.

    Args:
        name: Business name
        website: Website URL
        phone: Phone number
        address: Address
        description: Business description

    Returns:
        Classification result dict
    """
    is_resource, reason = is_likely_homeschool_resource(name, "", address)

    if is_resource:
        confidence = 0.85
        classification = "YES"
    elif "tutor" in name.lower() or "lesson" in name.lower():
        confidence = 0.70
        classification = "MAYBE"
    else:
        confidence = 0.30
        classification = "NO"

    return {
        "classification": classification,
        "category": "Tutoring & Academic Support" if "tutor" in name.lower() else None,
        "confidence": confidence,
        "reasoning": reason,
    }


def classify_category_and_tags_mock(
    name: str, website: str, description: str, initial_category: str
) -> Dict:
    """
    Mock category and tag assignment (use real LLM in production).

    Args:
        name: Business name
        website: Website URL
        description: Business description
        initial_category: Initial category from relevance classification

    Returns:
        Category and tag assignment dict
    """
    # Simple heuristics for tags
    setting_tags = []
    if website:
        setting_tags.append("Online")
    else:
        setting_tags.append("In-person")

    age_range_tags = ["All Ages"]  # Default

    cost_tag = "Varies"  # Default

    return {
        "primary_category": initial_category or "Support & Advocacy",
        "setting_tags": setting_tags,
        "age_range_tags": age_range_tags,
        "religious_affiliation": "Unspecified",
        "cost_tag": cost_tag,
        "reasoning": "Based on available information",
    }


# ============================================================================
# PHASE 2 PROCESSING
# ============================================================================


class Phase2Processor:
    """Processes records through hygiene and classification."""

    def __init__(self, use_llm: bool = False):
        """
        Initialize processor.

        Args:
            use_llm: If True, use real LLM calls (requires API setup)
        """
        self.use_llm = use_llm
        self.stats = {
            "total_input": 0,
            "passed_hygiene": 0,
            "failed_validation": 0,
            "classified_yes": 0,
            "classified_maybe": 0,
            "classified_no": 0,
            "errors": 0,
        }

    def hygiene_check(self, record: Dict) -> Tuple[bool, Dict, str]:
        """
        Perform data hygiene checks on a record.

        Args:
            record: Business record

        Returns:
            Tuple of (passed, cleaned_record, error_message)
        """
        try:
            cleaned = record.copy()

            # Validate required fields
            if not cleaned.get("name"):
                return False, cleaned, "Missing business name"

            # Validate optional contact fields
            if cleaned.get("phone"):
                cleaned["phone"] = validate_phone(cleaned["phone"])

            if cleaned.get("website"):
                cleaned["website"] = validate_website(cleaned["website"])

            # Validate address
            if not cleaned.get("address"):
                # Not required, but log
                logger.debug(f"No address for {cleaned.get('name')}")

            # Check for exclusion keywords
            if check_exclusion_keywords(cleaned.get("name")) or check_exclusion_keywords(
                cleaned.get("type")
            ):
                return False, cleaned, "Contains exclusion keyword"

            return True, cleaned, ""

        except Exception as e:
            logger.error(f"Hygiene check error for {record.get('name')}: {e}")
            return False, record, str(e)

    def classify_record(self, record: Dict) -> Dict:
        """
        Classify a record for homeschool relevance.

        Args:
            record: Cleaned business record

        Returns:
            Record with classification added
        """
        try:
            result = record.copy()

            # Get classification
            if self.use_llm:
                # In production, call real LLM here
                classification = self._classify_with_llm(record)
            else:
                classification = classify_relevance_mock(
                    record.get("name", ""),
                    record.get("website", ""),
                    record.get("phone", ""),
                    record.get("address", ""),
                    record.get("type", ""),
                )

            result["classification"] = classification["classification"]
            result["classification_confidence"] = classification["confidence"]
            result["classification_reasoning"] = classification["reasoning"]

            # Determine if we should classify further
            if classification["classification"] in ["YES", "MAYBE"]:
                # Get category and tags
                if self.use_llm:
                    category_assignment = self._classify_category_with_llm(
                        record, classification["category"]
                    )
                else:
                    category_assignment = classify_category_and_tags_mock(
                        record.get("name", ""),
                        record.get("website", ""),
                        record.get("type", ""),
                        classification["category"] or "",
                    )

                result["primary_category"] = category_assignment["primary_category"]
                result["setting_tags"] = ",".join(
                    category_assignment.get("setting_tags", [])
                )
                result["age_range_tags"] = ",".join(
                    category_assignment.get("age_range_tags", [])
                )
                result["religious_affiliation"] = category_assignment.get(
                    "religious_affiliation", "Unspecified"
                )
                result["cost_tag"] = category_assignment.get("cost_tag", "Varies")

            # Update stats
            if classification["classification"] == "YES":
                self.stats["classified_yes"] += 1
            elif classification["classification"] == "MAYBE":
                self.stats["classified_maybe"] += 1
            else:
                self.stats["classified_no"] += 1

            return result

        except Exception as e:
            logger.error(f"Classification error for {record.get('name')}: {e}")
            self.stats["errors"] += 1
            record["classification"] = "ERROR"
            record["classification_error"] = str(e)
            return record

    def _classify_with_llm(self, record: Dict) -> Dict:
        """Call LLM for classification (placeholder)."""
        # TODO: Implement actual LLM call
        return classify_relevance_mock(
            record.get("name", ""),
            record.get("website", ""),
            record.get("phone", ""),
            record.get("address", ""),
            record.get("type", ""),
        )

    def _classify_category_with_llm(self, record: Dict, initial_category: str) -> Dict:
        """Call LLM for category assignment (placeholder)."""
        # TODO: Implement actual LLM call
        return classify_category_and_tags_mock(
            record.get("name", ""),
            record.get("website", ""),
            record.get("type", ""),
            initial_category or "",
        )

    def process_records(
        self, records: List[Dict]
    ) -> Tuple[List[Dict], List[Dict], Dict]:
        """
        Process all records through hygiene and classification.

        Args:
            records: List of raw business records

        Returns:
            Tuple of (approved_records, rejected_records, stats)
        """
        self.stats["total_input"] = len(records)
        approved = []
        rejected = []

        for record in tqdm(records, desc="Processing records"):
            # Hygiene check
            passed, cleaned, error = self.hygiene_check(record)

            if not passed:
                cleaned["hygiene_error"] = error
                rejected.append(cleaned)
                self.stats["failed_validation"] += 1
                continue

            self.stats["passed_hygiene"] += 1

            # Classify
            classified = self.classify_record(cleaned)
            approved.append(classified)

        return approved, rejected, self.stats


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


def process_phase2(
    input_csv: str, output_dir: Optional[str] = None, use_llm: bool = False
) -> Tuple[str, str, Dict]:
    """
    Process Phase 2: Hygiene and Classification.

    Args:
        input_csv: Path to Phase 1 output CSV
        output_dir: Output directory (defaults to PIPELINE_CONFIG['batch_output_dir'])
        use_llm: Use real LLM for classification

    Returns:
        Tuple of (approved_csv, rejected_csv, stats)
    """
    if output_dir is None:
        output_dir = OUTPUT_DIR

    os.makedirs(output_dir, exist_ok=True)

    # Load Phase 1 data
    logger.info(f"Loading Phase 1 data from {input_csv}")
    records = load_csv(input_csv)

    if not records:
        logger.error(f"No records found in {input_csv}")
        return "", "", {}

    # Process through Phase 2
    logger.info("Starting Phase 2 processing...")
    processor = Phase2Processor(use_llm=use_llm)
    approved, rejected, stats = processor.process_records(records)

    # Save outputs
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    approved_file = f"{output_dir}/phase2_approved_{timestamp}.csv"
    rejected_file = f"{output_dir}/phase2_rejected_{timestamp}.csv"

    save_records_to_csv(approved, approved_file)
    save_records_to_csv(rejected, rejected_file)

    # Save stats
    stats_file = f"{output_dir}/phase2_stats_{timestamp}.json"
    with open(stats_file, "w") as f:
        json.dump(stats, f, indent=2)
    logger.info(f"Stats saved to {stats_file}")

    # Log summary
    logger.info("\n" + "=" * 50)
    logger.info("PHASE 2 SUMMARY")
    logger.info("=" * 50)
    logger.info(f"Total input records: {stats['total_input']}")
    logger.info(f"Passed hygiene checks: {stats['passed_hygiene']}")
    logger.info(f"Failed validation: {stats['failed_validation']}")
    logger.info(f"Classification YES: {stats['classified_yes']}")
    logger.info(f"Classification MAYBE: {stats['classified_maybe']}")
    logger.info(f"Classification NO: {stats['classified_no']}")
    logger.info(f"Errors: {stats['errors']}")
    logger.info(f"\nApproved records: {len(approved)}")
    logger.info(f"Rejected records: {len(rejected)}")
    logger.info(f"Approval rate: {len(approved) / stats['total_input'] * 100:.1f}%")
    logger.info("=" * 50)

    return approved_file, rejected_file, stats


def main():
    """Main entry point for Phase 2."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Phase 2: Data Hygiene and Classification"
    )
    parser.add_argument("input_csv", help="Path to Phase 1 output CSV")
    parser.add_argument("--output-dir", help="Output directory")
    parser.add_argument("--use-llm", action="store_true", help="Use LLM for classification")

    args = parser.parse_args()

    if not os.path.exists(args.input_csv):
        logger.error(f"Input file not found: {args.input_csv}")
        sys.exit(1)

    approved_file, rejected_file, stats = process_phase2(
        args.input_csv, args.output_dir, args.use_llm
    )

    logger.info(f"\nOutput files:")
    logger.info(f"  Approved: {approved_file}")
    logger.info(f"  Rejected: {rejected_file}")


if __name__ == "__main__":
    main()
