"""
Configuration module for HomebaseED homeschooling data pipeline.

Defines search queries, metro areas, taxonomy, and other pipeline settings.
"""

import logging
from typing import Dict, List, Set, Tuple

logger = logging.getLogger(__name__)

# ============================================================================
# OUTSCRAPER SEARCH QUERIES
# ============================================================================
# Query templates for finding homeschooling resources across different categories
# The {city} placeholder will be replaced with actual city names

OUTSCRAPER_QUERIES = {
    "co_ops_groups": [
        "homeschool co-op {city}",
        "homeschool group {city}",
        "homeschool cooperative {city}",
        "homeschool community {city}",
    ],
    "tutoring_academic": [
        "homeschool tutor {city}",
        "homeschool tutoring {city}",
        "homeschool teacher {city}",
        "academic tutoring {city}",
    ],
    "enrichment_classes": [
        "homeschool enrichment classes {city}",
        "homeschool enrichment programs {city}",
        "homeschool art classes {city}",
        "homeschool science classes {city}",
        "homeschool music lessons {city}",
    ],
    "testing_assessment": [
        "homeschool testing center {city}",
        "homeschool assessment {city}",
        "standardized testing {city}",
        "homeschool evaluation {city}",
    ],
    "sports_extracurricular": [
        "homeschool sports league {city}",
        "homeschool physical education {city}",
        "homeschool athletics {city}",
        "homeschool extracurricular {city}",
    ],
    "field_trips_outings": [
        "homeschool field trips {city}",
        "homeschool educational outings {city}",
        "homeschool field trip organizer {city}",
    ],
    "support_resources": [
        "homeschool support group {city}",
        "homeschool parent organization {city}",
        "homeschool curriculum provider {city}",
        "homeschool umbrella school {city}",
    ],
}

# ============================================================================
# TOP 100 US METRO AREAS
# ============================================================================
# Sorted by population (approximate 2024 estimates)

TOP_100_US_METROS = [
    "New York City",
    "Los Angeles",
    "Chicago",
    "Dallas-Fort Worth",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "San Jose",
    "Austin",
    "Jacksonville",
    "Fort Worth",
    "Columbus",
    "Charlotte",
    "San Francisco",
    "Indianapolis",
    "Seattle",
    "Denver",
    "Washington DC",
    "Boston",
    "El Paso",
    "Nashville",
    "Detroit",
    "Oklahoma City",
    "Portland",
    "Las Vegas",
    "Louisville",
    "Milwaukee",
    "Albuquerque",
    "Tucson",
    "Fresno",
    "Sacramento",
    "Long Beach",
    "Kansas City",
    "Mesa",
    "Virginia Beach",
    "Atlanta",
    "Miami",
    "Raleigh",
    "New Orleans",
    "Bakersfield",
    "Tampa",
    "Aurora",
    "Santa Ana",
    "Anaheim",
    "St. Louis",
    "Riverside",
    "Corpus Christi",
    "Lexington",
    "Pittsburgh",
    "Stockton",
    "Cincinnati",
    "Saint Paul",
    "Toledo",
    "Greensboro",
    "Plano",
    "Newark",
    "Henderson",
    "Chula Vista",
    "Chandler",
    "Irvine",
    "Irving",
    "Laredo",
    "Durham",
    "Madison",
    "North Las Vegas",
    "Lubbock",
    "Winston-Salem",
    "Garland",
    "Glendale",
    "Hialeah",
    "Baton Rouge",
    "Spokane",
    "Gilbert",
    "Montgomery",
    "Fontana",
    "Moreno Valley",
    "Huntsville",
    "Amarillo",
    "Des Moines",
    "Shreveport",
    "Little Rock",
    "Huntington Beach",
    "Providence",
    "Jackson",
    "Worcester",
    "Knoxville",
    "Modesto",
    "Brownsville",
    "Tallahassee",
    "New Haven",
    "Akron",
    "Multnomah County",
    "Honolulu",
]

# ============================================================================
# RESOURCE TYPE TAXONOMY - HOMESCHOOL SPECIFIC
# ============================================================================
# Hierarchical classification of homeschooling resources

RESOURCE_CATEGORIES = {
    "Co-ops & Groups": {
        "description": "Homeschool cooperatives, groups, and learning communities",
        "tags": ["co-op", "group", "cooperative", "learning-community"],
    },
    "Tutoring & Academic Support": {
        "description": "Individual and group tutoring, academic coaching",
        "tags": ["tutor", "academic-support", "coaching", "academic-coaching"],
    },
    "Enrichment & Extracurricular": {
        "description": "Classes and programs beyond core academics (arts, music, etc.)",
        "tags": ["enrichment", "arts", "music", "clubs", "electives"],
    },
    "Sports & Physical Education": {
        "description": "Sports leagues, PE programs, athletic instruction",
        "tags": ["sports", "pe", "athletics", "physical-education", "league"],
    },
    "Testing & Assessment": {
        "description": "Standardized testing centers, academic assessment services",
        "tags": ["testing", "assessment", "standardized-testing", "evaluation"],
    },
    "Field Trips & Educational Outings": {
        "description": "Organized field trips and educational outings",
        "tags": ["field-trips", "outings", "educational-trips", "excursions"],
    },
    "Online Resources": {
        "description": "Online courses, platforms, and curriculum providers",
        "tags": ["online-curriculum", "platform", "online-courses", "digital-resources"],
    },
    "Support & Advocacy": {
        "description": "Parent organizations, support groups, and advocacy organizations",
        "tags": ["support-group", "parent-org", "advocacy", "community-support"],
    },
}

# ============================================================================
# TAG TAXONOMY - MULTI-DIMENSIONAL
# ============================================================================

# Setting/Format Tags
SETTING_TAGS = ["In-person", "Online", "Hybrid", "Outdoor"]

# Age Range Tags
AGE_RANGE_TAGS = ["PreK (3-5)", "Elementary (6-10)", "Middle School (11-13)", "High School (14-18)", "All Ages"]

# Religious Affiliation Tags
RELIGIOUS_TAGS = [
    "Secular",
    "Christian",
    "Catholic",
    "Jewish",
    "Islamic",
    "Non-denominational",
    "Multi-faith",
    "Unspecified",
]

# Cost/Price Tags
COST_TAGS = [
    "Free",
    "Low ($1-50/month)",
    "Moderate ($51-150/month)",
    "Premium ($151+/month)",
    "Varies",
]

# ============================================================================
# HOMESCHOOL-SPECIFIC DATA EXTRACTION FIELDS
# ============================================================================
# Fields to extract from websites using Crawl4AI and AI prompts

EXTRACTION_FIELDS = [
    "meeting_schedule",  # When does the group meet?
    "curriculum_approach",  # What curriculum or teaching philosophy?
    "enrollment_requirements",  # What are the requirements to join?
    "class_size",  # Typical class/group size
    "parent_involvement_level",  # How much parent involvement is expected?
    "accreditation_status",  # Is it accredited? Which organizations?
    "grade_levels_served",  # What grades does it serve?
    "program_focus",  # Academic vs. enrichment focused?
    "certification_requirements",  # Teacher qualifications?
    "cost_structure",  # How much does it cost? Payment terms?
    "application_process",  # How to apply/enroll?
    "contact_person_info",  # Who to contact?
]

# ============================================================================
# PIPELINE SETTINGS
# ============================================================================

PIPELINE_CONFIG = {
    # Phase 1: Outscraper Collection
    "phase1": {
        "queries_per_city": 7,  # Number of different query types per city
        "results_per_query": 20,  # Results to collect per query (Outscraper limit consideration)
        "timeout_seconds": 120,
        "retry_attempts": 3,
        "retry_delay_seconds": 5,
    },
    # Phase 2: Hygiene & Classification
    "phase2": {
        "batch_size": 10,  # Process records in batches for efficiency
        "remove_duplicates": True,
        "validate_phone": True,
        "validate_email": True,
        "validate_website": True,
    },
    # Phase 3: Crawl4AI Enrichment
    "phase3": {
        "timeout_seconds": 30,
        "max_content_length": 10000,
        "extract_fields": EXTRACTION_FIELDS,
        "concurrent_workers": 5,
    },
    # Phase 4: Image Enrichment
    "phase4": {
        "min_image_width": 200,
        "min_image_height": 200,
        "max_image_count": 5,
        "valid_extensions": [".jpg", ".jpeg", ".png", ".webp"],
    },
    # General
    "batch_output_dir": "outputs",
    "log_level": "INFO",
    "enable_logging": True,
}

# ============================================================================
# RELEVANCE SCORING THRESHOLDS
# ============================================================================
# Used in Phase 2 for tiered classification

RELEVANCE_THRESHOLDS = {
    "yes_minimum": 0.85,  # Score >= 0.85 = YES (homeschool relevant)
    "maybe_minimum": 0.50,  # Score >= 0.50 and < 0.85 = MAYBE (needs review)
    # Score < 0.50 = NO (not relevant)
}

# ============================================================================
# EXCLUDED BUSINESS TYPES
# ============================================================================
# These terms indicate a business is NOT a homeschool resource

EXCLUSION_KEYWORDS = [
    # General exclusions
    "daycare",
    "preschool",
    "childcare",
    "babysitting",
    "nanny",
    "after school care",
    "summer camp",
    "traditional school",
    "public school",
    "private school",
    "college",
    "university",
    # Unrelated services
    "plumber",
    "electrician",
    "hvac",
    "roofing",
    "landscaping",
    "car repair",
    "dental",
    "medical",
    "hair salon",
    "restaurant",
    "grocery",
    "retail",
    "furniture",
    "realtor",
    "contractor",
]

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================


def get_queries_for_city(city: str) -> List[Tuple[str, str]]:
    """
    Generate all search queries for a given city.

    Args:
        city: City name to generate queries for

    Returns:
        List of tuples (category, query)
    """
    queries = []
    for category, query_templates in OUTSCRAPER_QUERIES.items():
        for template in query_templates:
            query = template.format(city=city)
            queries.append((category, query))
    return queries


def validate_resource_category(category: str) -> bool:
    """Check if a category is valid."""
    return category in RESOURCE_CATEGORIES


def validate_setting_tag(tag: str) -> bool:
    """Check if a setting tag is valid."""
    return tag in SETTING_TAGS


def validate_age_range_tag(tag: str) -> bool:
    """Check if an age range tag is valid."""
    return tag in AGE_RANGE_TAGS


def validate_religious_tag(tag: str) -> bool:
    """Check if a religious affiliation tag is valid."""
    return tag in RELIGIOUS_TAGS


def validate_cost_tag(tag: str) -> bool:
    """Check if a cost tag is valid."""
    return tag in COST_TAGS


def get_all_valid_tags() -> Set[str]:
    """Get all valid tags across all dimensions."""
    tags = set()
    tags.update(SETTING_TAGS)
    tags.update(AGE_RANGE_TAGS)
    tags.update(RELIGIOUS_TAGS)
    tags.update(COST_TAGS)
    for category_info in RESOURCE_CATEGORIES.values():
        tags.update(category_info["tags"])
    return tags


if __name__ == "__main__":
    # Example: Print configuration summary
    print(f"Loaded {len(TOP_100_US_METROS)} US metro areas")
    print(f"Loaded {len(OUTSCRAPER_QUERIES)} query categories")
    print(f"Loaded {len(RESOURCE_CATEGORIES)} resource categories")
    print(f"Total queries per city: {sum(len(v) for v in OUTSCRAPER_QUERIES.values())}")

    example_queries = get_queries_for_city("Austin")
    print(f"\nExample queries for Austin:")
    for category, query in example_queries:
        print(f"  [{category}] {query}")
