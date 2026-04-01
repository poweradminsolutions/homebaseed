"""
Master Pipeline Orchestration Script

Runs all four phases of the HomebaseED data pipeline in sequence:
1. Phase 1: Collect from Outscraper
2. Phase 2: Hygiene & Classification
3. Phase 3: Website Enrichment
4. Phase 4: Image Enrichment

Provides progress tracking, error handling, and comprehensive logging.
"""

import asyncio
import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from phase1_collect import collect_from_cities
from phase2_hygiene import process_phase2
from phase3_enrich import process_phase3
from phase4_images import process_phase4
from config import PIPELINE_CONFIG, TOP_100_US_METROS

logger = logging.getLogger(__name__)

# ============================================================================
# LOGGING SETUP
# ============================================================================

def setup_logging(log_dir: str) -> None:
    """Set up comprehensive logging for the pipeline."""
    os.makedirs(log_dir, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file = f"{log_dir}/pipeline_{timestamp}.log"

    logging.basicConfig(
        level=PIPELINE_CONFIG["log_level"],
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler(),
        ],
    )

    logger.info(f"Pipeline logging started: {log_file}")
    return log_file


# ============================================================================
# PIPELINE EXECUTION
# ============================================================================


class PipelineOrchestrator:
    """Orchestrates execution of all pipeline phases."""

    def __init__(
        self,
        output_dir: str = PIPELINE_CONFIG["batch_output_dir"],
        use_llm: bool = False,
        cities: Optional[List[str]] = None,
        limit_cities: Optional[int] = None,
    ):
        """
        Initialize the orchestrator.

        Args:
            output_dir: Output directory for all phases
            use_llm: Use LLM for classification and extraction
            cities: List of cities to process (defaults to TOP_100_US_METROS)
            limit_cities: Limit to first N cities (for testing)
        """
        self.output_dir = output_dir
        self.use_llm = use_llm
        self.cities = cities or TOP_100_US_METROS
        if limit_cities:
            self.cities = self.cities[:limit_cities]

        self.results = {
            "pipeline_start": datetime.now().isoformat(),
            "phases": {},
            "pipeline_status": "pending",
            "total_records_final": 0,
        }

        os.makedirs(output_dir, exist_ok=True)

    async def run_full_pipeline(self) -> bool:
        """
        Execute the full pipeline.

        Returns:
            True if successful, False otherwise
        """
        try:
            logger.info("=" * 70)
            logger.info("HOMEBASEED PIPELINE STARTED")
            logger.info("=" * 70)

            # Phase 1: Collection
            logger.info("\n[PHASE 1] Starting collection...")
            phase1_success = await self.run_phase1()
            if not phase1_success:
                logger.error("Phase 1 failed")
                return False

            # Phase 2: Hygiene & Classification
            logger.info("\n[PHASE 2] Starting hygiene & classification...")
            phase2_success = await self.run_phase2()
            if not phase2_success:
                logger.error("Phase 2 failed")
                return False

            # Phase 3: Website Enrichment
            logger.info("\n[PHASE 3] Starting website enrichment...")
            phase3_success = await self.run_phase3()
            if not phase3_success:
                logger.error("Phase 3 failed")
                return False

            # Phase 4: Image Enrichment
            logger.info("\n[PHASE 4] Starting image enrichment...")
            phase4_success = await self.run_phase4()
            if not phase4_success:
                logger.error("Phase 4 failed")
                return False

            self.results["pipeline_status"] = "completed"
            logger.info("\n" + "=" * 70)
            logger.info("HOMEBASEED PIPELINE COMPLETED SUCCESSFULLY")
            logger.info("=" * 70)

            return True

        except Exception as e:
            logger.error(f"Pipeline failed with error: {e}", exc_info=True)
            self.results["pipeline_status"] = "failed"
            self.results["error"] = str(e)
            return False

        finally:
            # Save final results
            self.save_pipeline_results()

    async def run_phase1(self) -> bool:
        """Execute Phase 1: Collection."""
        try:
            logger.info(f"Collecting from {len(self.cities)} cities...")
            logger.info(f"Using LLM: {self.use_llm}")

            # Check API key
            if not os.getenv("OUTSCRAPER_API_KEY"):
                logger.warning("OUTSCRAPER_API_KEY not set - Phase 1 will fail")
                logger.info("Set OUTSCRAPER_API_KEY environment variable to enable collection")
                # For testing, we can skip this
                total_records, csv_files = 0, []
            else:
                total_records, csv_files = await collect_from_cities(
                    cities=self.cities
                )

            self.results["phases"]["phase1"] = {
                "status": "completed",
                "total_records": total_records,
                "output_files": csv_files,
                "cities_processed": len(self.cities),
            }

            if csv_files:
                self.phase1_output = csv_files[-1]  # Master file
                logger.info(f"Phase 1 output: {self.phase1_output}")
                return True
            else:
                logger.warning("Phase 1 completed with no output")
                return False

        except Exception as e:
            logger.error(f"Phase 1 execution error: {e}", exc_info=True)
            self.results["phases"]["phase1"] = {
                "status": "failed",
                "error": str(e),
            }
            return False

    async def run_phase2(self) -> bool:
        """Execute Phase 2: Hygiene & Classification."""
        try:
            # Check if Phase 1 output exists
            if not hasattr(self, "phase1_output"):
                logger.warning("No Phase 1 output - using dummy data for testing")
                # Create a dummy Phase 1 file for testing
                self.phase1_output = self._create_dummy_phase1_output()

            logger.info(f"Processing {self.phase1_output}...")
            approved_csv, rejected_csv, stats = process_phase2(
                self.phase1_output,
                output_dir=self.output_dir,
                use_llm=self.use_llm,
            )

            self.results["phases"]["phase2"] = {
                "status": "completed",
                "input_file": self.phase1_output,
                "approved_file": approved_csv,
                "rejected_file": rejected_csv,
                "stats": stats,
            }

            self.phase2_output = approved_csv
            logger.info(f"Phase 2 output: {approved_csv}")
            return True

        except Exception as e:
            logger.error(f"Phase 2 execution error: {e}", exc_info=True)
            self.results["phases"]["phase2"] = {
                "status": "failed",
                "error": str(e),
            }
            return False

    async def run_phase3(self) -> bool:
        """Execute Phase 3: Website Enrichment."""
        try:
            # Check if Phase 2 output exists
            if not hasattr(self, "phase2_output"):
                logger.warning("No Phase 2 output - skipping Phase 3")
                return False

            logger.info(f"Processing {self.phase2_output}...")
            output_csv, stats = await process_phase3(
                self.phase2_output,
                output_dir=self.output_dir,
                use_llm=self.use_llm,
            )

            self.results["phases"]["phase3"] = {
                "status": "completed",
                "input_file": self.phase2_output,
                "output_file": output_csv,
                "stats": stats,
            }

            self.phase3_output = output_csv
            logger.info(f"Phase 3 output: {output_csv}")
            return True

        except Exception as e:
            logger.error(f"Phase 3 execution error: {e}", exc_info=True)
            self.results["phases"]["phase3"] = {
                "status": "failed",
                "error": str(e),
            }
            return False

    async def run_phase4(self) -> bool:
        """Execute Phase 4: Image Enrichment."""
        try:
            # Check if Phase 3 output exists
            if not hasattr(self, "phase3_output"):
                logger.warning("No Phase 3 output - skipping Phase 4")
                return False

            logger.info(f"Processing {self.phase3_output}...")
            output_csv, stats = await process_phase4(
                self.phase3_output,
                output_dir=self.output_dir,
                use_llm=self.use_llm,
            )

            self.results["phases"]["phase4"] = {
                "status": "completed",
                "input_file": self.phase3_output,
                "output_file": output_csv,
                "stats": stats,
            }

            self.phase4_output = output_csv
            logger.info(f"Phase 4 output: {output_csv}")

            # Count final records
            import csv as csv_module
            with open(output_csv, "r") as f:
                final_count = sum(1 for _ in csv_module.DictReader(f))
            self.results["total_records_final"] = final_count

            return True

        except Exception as e:
            logger.error(f"Phase 4 execution error: {e}", exc_info=True)
            self.results["phases"]["phase4"] = {
                "status": "failed",
                "error": str(e),
            }
            return False

    def _create_dummy_phase1_output(self) -> str:
        """Create a dummy Phase 1 output file for testing."""
        import csv

        dummy_file = f"{self.output_dir}/phase1_dummy_test.csv"

        dummy_records = [
            {
                "name": "Austin Homeschool Co-op",
                "website": "https://example.com/austin-coop",
                "phone": "512-555-1234",
                "address": "Austin, TX 78701",
                "type": "Homeschool Co-op",
                "review_rating": 4.8,
            },
            {
                "name": "Advanced Tutoring Services",
                "website": "https://example.com/tutoring",
                "phone": "512-555-5678",
                "address": "Austin, TX 78702",
                "type": "Educational Service",
                "review_rating": 4.9,
            },
        ]

        with open(dummy_file, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=dummy_records[0].keys())
            writer.writeheader()
            writer.writerows(dummy_records)

        logger.info(f"Created dummy Phase 1 output: {dummy_file}")
        return dummy_file

    def save_pipeline_results(self) -> str:
        """Save pipeline execution results."""
        self.results["pipeline_end"] = datetime.now().isoformat()

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        results_file = f"{self.output_dir}/pipeline_results_{timestamp}.json"

        with open(results_file, "w") as f:
            json.dump(self.results, f, indent=2)

        logger.info(f"Pipeline results saved to {results_file}")
        return results_file

    def print_summary(self) -> None:
        """Print final pipeline summary."""
        print("\n" + "=" * 70)
        print("PIPELINE EXECUTION SUMMARY")
        print("=" * 70)
        print(f"Status: {self.results['pipeline_status'].upper()}")
        print(f"Start: {self.results['pipeline_start']}")
        print(f"End: {self.results.get('pipeline_end', 'N/A')}")
        print(f"Final Record Count: {self.results.get('total_records_final', 0)}")

        if "error" in self.results:
            print(f"Error: {self.results['error']}")

        print("\nPhase Status:")
        for phase_name, phase_result in self.results.get("phases", {}).items():
            status = phase_result.get("status", "unknown").upper()
            print(f"  {phase_name}: {status}")

        print("=" * 70 + "\n")


# ============================================================================
# CLI INTERFACE
# ============================================================================


async def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Run the full HomebaseED pipeline"
    )
    parser.add_argument(
        "--output-dir",
        default=PIPELINE_CONFIG["batch_output_dir"],
        help="Output directory for pipeline results",
    )
    parser.add_argument(
        "--use-llm",
        action="store_true",
        help="Use LLM for classification and extraction (requires API setup)",
    )
    parser.add_argument(
        "--limit-cities",
        type=int,
        help="Limit to first N cities (useful for testing)",
    )
    parser.add_argument(
        "--cities",
        type=str,
        help="Comma-separated list of cities to process",
    )

    args = parser.parse_args()

    # Setup logging
    log_file = setup_logging(args.output_dir)

    # Parse cities if provided
    cities = None
    if args.cities:
        cities = [c.strip() for c in args.cities.split(",")]

    # Create orchestrator
    orchestrator = PipelineOrchestrator(
        output_dir=args.output_dir,
        use_llm=args.use_llm,
        cities=cities,
        limit_cities=args.limit_cities,
    )

    # Run pipeline
    success = await orchestrator.run_full_pipeline()

    # Print summary
    orchestrator.print_summary()

    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    asyncio.run(main())
