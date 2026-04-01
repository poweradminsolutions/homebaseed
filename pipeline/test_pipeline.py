"""
Quick test script for validating pipeline setup.

Tests each phase with minimal data to verify configuration and dependencies.
Run this before full pipeline execution to catch issues early.
"""

import asyncio
import csv
import json
import logging
import os
import sys
from pathlib import Path

from config import (
    OUTSCRAPER_QUERIES,
    PIPELINE_CONFIG,
    RESOURCE_CATEGORIES,
    TOP_100_US_METROS,
    get_queries_for_city,
)

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

# ============================================================================
# CONFIGURATION TESTS
# ============================================================================


def test_config():
    """Test that configuration loads correctly."""
    print("\n[TEST] Configuration")
    print("-" * 50)

    try:
        # Check metro areas
        assert len(TOP_100_US_METROS) >= 90, f"Expected 90+ metros, got {len(TOP_100_US_METROS)}"
        print(f"✓ Loaded {len(TOP_100_US_METROS)} metro areas")

        # Check query categories
        expected_categories = {
            "co_ops_groups",
            "tutoring_academic",
            "enrichment_classes",
            "testing_assessment",
            "sports_extracurricular",
            "field_trips_outings",
            "support_resources",
        }
        assert set(OUTSCRAPER_QUERIES.keys()) == expected_categories
        print(f"✓ Loaded {len(OUTSCRAPER_QUERIES)} query categories")

        # Check queries per city
        test_queries = get_queries_for_city("Austin")
        assert len(test_queries) > 0, "No queries for test city"
        print(f"✓ Generated {len(test_queries)} queries for test city")

        # Check resource categories
        assert len(RESOURCE_CATEGORIES) == 8, f"Expected 8 categories, got {len(RESOURCE_CATEGORIES)}"
        print(f"✓ Loaded {len(RESOURCE_CATEGORIES)} resource categories")

        # Check pipeline config
        assert "phase1" in PIPELINE_CONFIG, "Missing phase1 config"
        assert "phase2" in PIPELINE_CONFIG, "Missing phase2 config"
        assert "phase3" in PIPELINE_CONFIG, "Missing phase3 config"
        assert "phase4" in PIPELINE_CONFIG, "Missing phase4 config"
        print("✓ All pipeline phases configured")

        print("\n✓ CONFIGURATION TEST PASSED")
        return True

    except Exception as e:
        print(f"\n✗ CONFIGURATION TEST FAILED: {e}")
        return False


# ============================================================================
# DEPENDENCY TESTS
# ============================================================================


def test_dependencies():
    """Test that required dependencies are installed."""
    print("\n[TEST] Dependencies")
    print("-" * 50)

    dependencies = [
        ("aiohttp", "async HTTP client"),
        ("tqdm", "progress bars"),
        ("csv", "CSV processing"),
        ("json", "JSON processing"),
        ("asyncio", "async support"),
    ]

    all_ok = True
    for module_name, description in dependencies:
        try:
            __import__(module_name)
            print(f"✓ {module_name:<20} - {description}")
        except ImportError:
            print(f"✗ {module_name:<20} - {description} (NOT INSTALLED)")
            all_ok = False

    if all_ok:
        print("\n✓ DEPENDENCIES TEST PASSED")
    else:
        print("\n✗ DEPENDENCIES TEST FAILED")
        print("Run: pip install -r requirements.txt")

    return all_ok


# ============================================================================
# API KEY TESTS
# ============================================================================


def test_api_keys():
    """Test that API keys are configured."""
    print("\n[TEST] API Keys")
    print("-" * 50)

    keys_to_check = [
        ("OUTSCRAPER_API_KEY", "Outscraper (Phase 1)", True),
        ("ANTHROPIC_API_KEY", "Anthropic Claude (LLM)", False),
        ("OPENAI_API_KEY", "OpenAI GPT (LLM)", False),
    ]

    missing = []
    for key_name, description, required in keys_to_check:
        value = os.getenv(key_name)
        if value:
            masked = value[:10] + "..." if len(value) > 10 else value
            print(f"✓ {key_name:<25} - Configured ({masked})")
        else:
            status = "REQUIRED" if required else "OPTIONAL"
            print(f"✗ {key_name:<25} - Not configured ({status})")
            if required:
                missing.append(key_name)

    if missing:
        print(f"\n✗ MISSING REQUIRED KEYS: {', '.join(missing)}")
        print("Set environment variables or update .env file")
        return False
    else:
        print("\n✓ API KEYS TEST PASSED")
        return True


# ============================================================================
# FILE STRUCTURE TESTS
# ============================================================================


def test_file_structure():
    """Test that required files exist."""
    print("\n[TEST] File Structure")
    print("-" * 50)

    required_files = [
        "config.py",
        "prompts.py",
        "phase1_collect.py",
        "phase2_hygiene.py",
        "phase3_enrich.py",
        "phase4_images.py",
        "run_full_pipeline.py",
        "requirements.txt",
        ".env.template",
        "__init__.py",
    ]

    current_dir = Path(__file__).parent
    all_ok = True

    for filename in required_files:
        filepath = current_dir / filename
        if filepath.exists():
            size = filepath.stat().st_size
            print(f"✓ {filename:<30} ({size:,} bytes)")
        else:
            print(f"✗ {filename:<30} - MISSING")
            all_ok = False

    if all_ok:
        print("\n✓ FILE STRUCTURE TEST PASSED")
    else:
        print("\n✗ FILE STRUCTURE TEST FAILED")

    return all_ok


# ============================================================================
# DATA FILE TESTS
# ============================================================================


def test_create_dummy_phase1():
    """Create a dummy Phase 1 output for testing."""
    print("\n[TEST] Dummy Data Creation")
    print("-" * 50)

    output_dir = PIPELINE_CONFIG["batch_output_dir"]
    os.makedirs(output_dir, exist_ok=True)

    dummy_file = f"{output_dir}/test_phase1_dummy.csv"

    dummy_records = [
        {
            "name": "Austin Homeschool Co-op",
            "website": "https://example.com/austin-coop",
            "phone": "512-555-1234",
            "address": "Austin, TX 78701",
            "type": "Homeschool Co-op",
            "review_rating": 4.8,
            "collection_query": "homeschool co-op austin",
            "collection_category": "co_ops_groups",
            "collection_city": "Austin",
            "collection_timestamp": "2024-01-01T00:00:00",
        },
        {
            "name": "Advanced Math Tutoring",
            "website": "https://example.com/tutoring",
            "phone": "512-555-5678",
            "address": "Austin, TX 78702",
            "type": "Tutoring Service",
            "review_rating": 4.9,
            "collection_query": "homeschool tutor austin",
            "collection_category": "tutoring_academic",
            "collection_city": "Austin",
            "collection_timestamp": "2024-01-01T00:00:00",
        },
        {
            "name": "Music Lessons Studio",
            "website": "https://example.com/music",
            "phone": "512-555-9999",
            "address": "Austin, TX 78703",
            "type": "Music Lessons",
            "review_rating": 4.7,
            "collection_query": "homeschool music lessons austin",
            "collection_category": "enrichment_classes",
            "collection_city": "Austin",
            "collection_timestamp": "2024-01-01T00:00:00",
        },
        {
            "name": "Austin Soccer Academy",
            "website": "https://example.com/soccer",
            "phone": "512-555-7777",
            "address": "Austin, TX 78704",
            "type": "Sports Academy",
            "review_rating": 4.6,
            "collection_query": "homeschool sports league austin",
            "collection_category": "sports_extracurricular",
            "collection_city": "Austin",
            "collection_timestamp": "2024-01-01T00:00:00",
        },
        {
            "name": "Plumbing Services Inc",
            "website": "https://example.com/plumbing",
            "phone": "512-555-0000",
            "address": "Austin, TX 78705",
            "type": "Plumbing Service",
            "review_rating": 4.5,
            "collection_query": "random query",
            "collection_category": "other",
            "collection_city": "Austin",
            "collection_timestamp": "2024-01-01T00:00:00",
        },
    ]

    try:
        with open(dummy_file, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=dummy_records[0].keys())
            writer.writeheader()
            writer.writerows(dummy_records)

        file_size = os.path.getsize(dummy_file)
        print(f"✓ Created dummy Phase 1 file: {dummy_file}")
        print(f"✓ File size: {file_size:,} bytes")
        print(f"✓ Records: {len(dummy_records)}")

        print("\n✓ DUMMY DATA TEST PASSED")
        return True

    except Exception as e:
        print(f"\n✗ DUMMY DATA TEST FAILED: {e}")
        return False


# ============================================================================
# PHASE IMPORT TESTS
# ============================================================================


def test_phase_imports():
    """Test that all phase modules can be imported."""
    print("\n[TEST] Phase Imports")
    print("-" * 50)

    phases_to_test = [
        ("phase1_collect", ["OutscraperClient", "collect_from_cities"]),
        ("phase2_hygiene", ["Phase2Processor", "process_phase2"]),
        ("phase3_enrich", ["WebsiteEnricher", "process_phase3"]),
        ("phase4_images", ["ImageExtractor", "process_phase4"]),
        ("run_full_pipeline", ["PipelineOrchestrator"]),
    ]

    all_ok = True
    for module_name, expected_items in phases_to_test:
        try:
            module = __import__(module_name)
            found_items = []
            for item in expected_items:
                if hasattr(module, item):
                    found_items.append(item)

            if len(found_items) == len(expected_items):
                print(f"✓ {module_name:<25} - All imports OK")
            else:
                missing = set(expected_items) - set(found_items)
                print(f"⚠ {module_name:<25} - Missing: {missing}")

        except ImportError as e:
            print(f"✗ {module_name:<25} - Import failed: {e}")
            all_ok = False

    if all_ok:
        print("\n✓ PHASE IMPORTS TEST PASSED")
    else:
        print("\n✗ PHASE IMPORTS TEST FAILED")

    return all_ok


# ============================================================================
# MAIN TEST RUNNER
# ============================================================================


def run_all_tests():
    """Run all tests and summarize results."""
    print("\n" + "=" * 50)
    print("HOMEBASEED PIPELINE SETUP TESTS")
    print("=" * 50)

    tests = [
        ("Configuration", test_config),
        ("Dependencies", test_dependencies),
        ("API Keys", test_api_keys),
        ("File Structure", test_file_structure),
        ("Dummy Data", test_create_dummy_phase1),
        ("Phase Imports", test_phase_imports),
    ]

    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            logger.error(f"Test {test_name} crashed: {e}", exc_info=True)
            results.append((test_name, False))

    # Summary
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "✓ PASSED" if result else "✗ FAILED"
        print(f"{test_name:<30} {status}")

    print("-" * 50)
    print(f"Total: {passed}/{total} passed")
    print("=" * 50)

    if passed == total:
        print("\n✓ ALL TESTS PASSED - Pipeline is ready!")
        print("\nNext steps:")
        print("1. Configure API keys in .env")
        print("2. Run: python run_full_pipeline.py --limit-cities 2")
        return True
    else:
        print("\n✗ SOME TESTS FAILED - Fix issues above")
        return False


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
