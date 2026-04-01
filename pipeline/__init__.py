"""
HomebaseED Data Pipeline Package

A complete data pipeline for discovering, classifying, and enriching
homeschooling resources across the United States.

Four-phase pipeline:
1. Phase 1 (Collect): Outscraper collection from Google Maps
2. Phase 2 (Hygiene): Data cleaning and relevance classification
3. Phase 3 (Enrich): Website crawling and data extraction
4. Phase 4 (Images): Image discovery and validation

Usage:
    # Run full pipeline
    python run_full_pipeline.py --output-dir ./results --limit-cities 5

    # Run individual phases
    python phase1_collect.py --limit 5
    python phase2_hygiene.py phase1_collected_combined_all_cities.csv
    python phase3_enrich.py phase2_approved_*.csv
    python phase4_images.py phase3_enriched_*.csv

Author: HomebaseED Team
Version: 1.0.0
"""

from config import (
    EXCLUSION_KEYWORDS,
    OUTSCRAPER_QUERIES,
    PIPELINE_CONFIG,
    RELEVANCE_THRESHOLDS,
    RESOURCE_CATEGORIES,
    TOP_100_US_METROS,
    get_queries_for_city,
    validate_resource_category,
)
from prompts import (
    BUSINESS_DESCRIPTION_GENERATION_PROMPT,
    CATEGORY_ASSIGNMENT_PROMPT,
    IMAGE_DISCOVERY_PROMPT,
    IMAGE_VALIDATION_PROMPT,
    RELEVANCE_CLASSIFICATION_PROMPT,
    WEBSITE_DATA_EXTRACTION_PROMPT,
    format_business_description_prompt,
    format_category_assignment_prompt,
    format_image_discovery_prompt,
    format_image_validation_prompt,
    format_relevance_classification_prompt,
    format_website_extraction_prompt,
)

__version__ = "1.0.0"
__author__ = "HomebaseED Team"

__all__ = [
    # Config exports
    "OUTSCRAPER_QUERIES",
    "TOP_100_US_METROS",
    "RESOURCE_CATEGORIES",
    "PIPELINE_CONFIG",
    "EXCLUSION_KEYWORDS",
    "RELEVANCE_THRESHOLDS",
    "get_queries_for_city",
    "validate_resource_category",
    # Prompts exports
    "RELEVANCE_CLASSIFICATION_PROMPT",
    "CATEGORY_ASSIGNMENT_PROMPT",
    "WEBSITE_DATA_EXTRACTION_PROMPT",
    "BUSINESS_DESCRIPTION_GENERATION_PROMPT",
    "IMAGE_VALIDATION_PROMPT",
    "IMAGE_DISCOVERY_PROMPT",
    "format_relevance_classification_prompt",
    "format_category_assignment_prompt",
    "format_website_extraction_prompt",
    "format_business_description_prompt",
    "format_image_validation_prompt",
    "format_image_discovery_prompt",
]
