"""
Phase 1: Outscraper Collection Script

Collects raw business data from Google Maps via Outscraper API
for homeschooling resources across US metro areas.

Can be run standalone or as part of the full pipeline.
"""

import asyncio
import csv
import json
import logging
import os
import time
from datetime import datetime
from typing import List, Optional, Tuple

import aiohttp
from tqdm import tqdm

from config import (
    OUTSCRAPER_QUERIES,
    PIPELINE_CONFIG,
    TOP_100_US_METROS,
    get_queries_for_city,
)

logger = logging.getLogger(__name__)

# ============================================================================
# CONFIGURATION
# ============================================================================

OUTSCRAPER_API_KEY = os.getenv("OUTSCRAPER_API_KEY")
OUTSCRAPER_BASE_URL = "https://api.outscraper.com/maps"

OUTPUT_DIR = PIPELINE_CONFIG["batch_output_dir"]
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Logging setup
if PIPELINE_CONFIG["enable_logging"]:
    logging.basicConfig(
        level=PIPELINE_CONFIG["log_level"],
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.FileHandler(f"{OUTPUT_DIR}/phase1_collect.log"),
            logging.StreamHandler(),
        ],
    )

# ============================================================================
# OUTSCRAPER API CLIENT
# ============================================================================


class OutscraperClient:
    """Async client for Outscraper API."""

    def __init__(self, api_key: str, timeout: int = 120):
        self.api_key = api_key
        self.timeout = timeout
        self.session: Optional[aiohttp.ClientSession] = None
        self.rate_limit_delay = 1.0  # Seconds between requests

    async def __aenter__(self):
        """Context manager entry."""
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        if self.session:
            await self.session.close()

    async def search_maps(
        self, query: str, max_retries: int = 3
    ) -> Tuple[bool, Optional[List[dict]], str]:
        """
        Search Google Maps for a given query.

        Args:
            query: Search query
            max_retries: Number of retry attempts

        Returns:
            Tuple of (success, results, message)
        """
        if not self.session:
            return False, None, "Session not initialized"

        params = {
            "query": query,
            "api_key": self.api_key,
            "limit": PIPELINE_CONFIG["phase1"]["results_per_query"],
        }

        for attempt in range(max_retries):
            try:
                await asyncio.sleep(self.rate_limit_delay)  # Rate limiting

                async with self.session.get(
                    OUTSCRAPER_BASE_URL,
                    params=params,
                    timeout=aiohttp.ClientTimeout(total=self.timeout),
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        results = data.get("data", [])
                        return True, results, f"Found {len(results)} results"
                    elif response.status == 429:  # Rate limited
                        wait_time = 60 * (attempt + 1)
                        logger.warning(f"Rate limited, waiting {wait_time}s...")
                        await asyncio.sleep(wait_time)
                    elif response.status == 401:
                        return False, None, "Invalid API key"
                    else:
                        text = await response.text()
                        logger.warning(f"API error {response.status}: {text}")

            except asyncio.TimeoutError:
                logger.warning(f"Timeout on attempt {attempt + 1}/{max_retries}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(PIPELINE_CONFIG["phase1"]["retry_delay_seconds"])
            except Exception as e:
                logger.error(f"Error searching maps: {e}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(PIPELINE_CONFIG["phase1"]["retry_delay_seconds"])

        return False, None, "Failed after max retries"

    async def collect_for_city(self, city: str) -> List[dict]:
        """
        Collect all results for a given city.

        Args:
            city: City name

        Returns:
            List of business records
        """
        all_results = []
        queries = get_queries_for_city(city)

        for category, query in tqdm(
            queries, desc=f"Queries for {city}", leave=False
        ):
            success, results, message = await self.search_maps(query)

            if success and results:
                for result in results:
                    # Add metadata
                    result["collection_query"] = query
                    result["collection_category"] = category
                    result["collection_city"] = city
                    result["collection_timestamp"] = datetime.now().isoformat()
                    all_results.append(result)

                logger.info(f"[{city}] {category}: {message}")
            else:
                logger.warning(f"[{city}] {category}: {message}")

        return all_results


# ============================================================================
# DATA PROCESSING FUNCTIONS
# ============================================================================


def normalize_business_record(result: dict) -> dict:
    """
    Normalize a business record from Outscraper.

    Args:
        result: Raw result from Outscraper

    Returns:
        Normalized record
    """
    return {
        "business_id": result.get("review_url", "").split("/?")[-1] if result.get("review_url") else None,
        "name": result.get("name"),
        "website": result.get("website"),
        "phone": result.get("phone"),
        "address": result.get("address"),
        "type": result.get("type"),
        "review_count": result.get("review_count"),
        "review_rating": result.get("review_rating"),
        "google_maps_url": result.get("review_url"),
        "collection_query": result.get("collection_query"),
        "collection_category": result.get("collection_category"),
        "collection_city": result.get("collection_city"),
        "collection_timestamp": result.get("collection_timestamp"),
    }


def remove_duplicates(records: List[dict]) -> List[dict]:
    """Remove duplicate records based on name and address."""
    seen = set()
    unique = []

    for record in records:
        # Create a key from name + address
        key = (
            record.get("name", "").lower().strip(),
            record.get("address", "").lower().strip(),
        )
        if key not in seen and key[0]:  # Ensure we have a name
            seen.add(key)
            unique.append(record)

    return unique


def save_batch_to_csv(records: List[dict], batch_name: str) -> str:
    """
    Save a batch of records to CSV.

    Args:
        records: List of business records
        batch_name: Name for this batch

    Returns:
        Path to saved CSV file
    """
    if not records:
        logger.warning(f"No records to save for batch {batch_name}")
        return ""

    filename = f"{OUTPUT_DIR}/phase1_collected_{batch_name}.csv"

    fieldnames = [
        "business_id",
        "name",
        "website",
        "phone",
        "address",
        "type",
        "review_count",
        "review_rating",
        "google_maps_url",
        "collection_query",
        "collection_category",
        "collection_city",
        "collection_timestamp",
    ]

    try:
        with open(filename, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(records)

        logger.info(f"Saved {len(records)} records to {filename}")
        return filename
    except Exception as e:
        logger.error(f"Error saving CSV: {e}")
        return ""


# ============================================================================
# MAIN COLLECTION FUNCTIONS
# ============================================================================


async def collect_from_cities(
    cities: Optional[List[str]] = None, limit: Optional[int] = None
) -> Tuple[int, List[str]]:
    """
    Collect data from specified cities.

    Args:
        cities: List of cities to collect from (uses TOP_100_US_METROS if None)
        limit: Limit to first N cities (useful for testing)

    Returns:
        Tuple of (total_records, csv_files_created)
    """
    if cities is None:
        cities = TOP_100_US_METROS

    if limit:
        cities = cities[:limit]

    all_records = []
    csv_files = []

    try:
        async with OutscraperClient(OUTSCRAPER_API_KEY) as client:
            for city in tqdm(cities, desc="Cities", position=0):
                logger.info(f"\nCollecting data for {city}...")

                city_records = await client.collect_for_city(city)
                all_records.extend(city_records)

                # Save batch for this city
                if city_records:
                    city_normalized = city.replace(" ", "_").lower()
                    csv_file = save_batch_to_csv(city_records, city_normalized)
                    if csv_file:
                        csv_files.append(csv_file)

                # Brief pause between cities
                await asyncio.sleep(2)

    except Exception as e:
        logger.error(f"Collection error: {e}")

    # Normalize and deduplicate all records
    logger.info("Normalizing and deduplicating records...")
    normalized = [normalize_business_record(r) for r in all_records]
    unique_records = remove_duplicates(normalized)

    # Save master file
    master_file = save_batch_to_csv(unique_records, "combined_all_cities")
    if master_file:
        csv_files.append(master_file)

    # Save collection metadata
    metadata = {
        "collection_timestamp": datetime.now().isoformat(),
        "cities_collected": len(cities),
        "total_raw_records": len(all_records),
        "unique_records": len(unique_records),
        "csv_files": csv_files,
        "query_categories": list(OUTSCRAPER_QUERIES.keys()),
    }

    metadata_file = f"{OUTPUT_DIR}/phase1_metadata.json"
    with open(metadata_file, "w") as f:
        json.dump(metadata, f, indent=2)

    logger.info(f"Collection metadata saved to {metadata_file}")

    return len(unique_records), csv_files


def collect_from_single_city(city: str) -> Tuple[int, str]:
    """
    Collect data from a single city (synchronous wrapper).

    Args:
        city: City name

    Returns:
        Tuple of (record_count, csv_file)
    """
    records, files = asyncio.run(collect_from_cities([city]))
    return records, files[0] if files else ""


# ============================================================================
# CLI INTERFACE
# ============================================================================


def main():
    """Main entry point for phase 1 collection."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Phase 1: Collect homeschool resources from Google Maps"
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Limit to first N cities (useful for testing)",
    )
    parser.add_argument(
        "--city",
        type=str,
        default=None,
        help="Collect from a single city instead of all metros",
    )
    parser.add_argument(
        "--api-key",
        type=str,
        default=OUTSCRAPER_API_KEY,
        help="Outscraper API key (can also set OUTSCRAPER_API_KEY env var)",
    )

    args = parser.parse_args()

    if not args.api_key:
        logger.error("OUTSCRAPER_API_KEY not set. Set via --api-key or environment variable.")
        return

    # Set API key if provided via CLI
    if args.api_key:
        globals()["OUTSCRAPER_API_KEY"] = args.api_key

    if args.city:
        logger.info(f"Collecting from single city: {args.city}")
        count, csv_file = collect_from_single_city(args.city)
        logger.info(f"Collected {count} records from {args.city}")
        logger.info(f"Output: {csv_file}")
    else:
        logger.info("Starting Phase 1 collection...")
        total_records, csv_files = asyncio.run(
            collect_from_cities(limit=args.limit)
        )
        logger.info(f"Phase 1 complete! Collected {total_records} unique records.")
        logger.info(f"Output files: {csv_files}")


if __name__ == "__main__":
    main()
