# HomebaseED Data Pipeline

A production-ready, four-phase data pipeline for discovering, classifying, and enriching homeschooling resources across the United States.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.template .env
# Edit .env with your Outscraper API key

# Test setup
python test_pipeline.py

# Run pipeline (test with 2 cities first)
python run_full_pipeline.py --limit-cities 2

# Full production run
python run_full_pipeline.py
```

## What It Does

The pipeline discovers homeschooling resources (co-ops, tutors, enrichment programs, etc.) across 95 US metro areas and enriches them with detailed information.

### Four Phases

1. **Collect** - Outscraper API gathers raw business data
2. **Hygiene** - Data validation and homeschool relevance classification
3. **Enrich** - Website crawling and information extraction
4. **Images** - Image discovery and validation

## Files

- `config.py` - Configuration and taxonomy
- `prompts.py` - AI prompts for classification/extraction
- `phase1_collect.py` - Collection script
- `phase2_hygiene.py` - Hygiene and classification script
- `phase3_enrich.py` - Website enrichment script
- `phase4_images.py` - Image enrichment script
- `run_full_pipeline.py` - Master orchestrator
- `test_pipeline.py` - Setup validation
- `requirements.txt` - Dependencies
- `.env.template` - Configuration template

## Documentation

- **QUICK_START.md** - Quick reference (start here)
- **../PIPELINE_GUIDE.md** - Complete guide
- **../PIPELINE_SUMMARY.md** - Project overview
- **../MANIFEST.md** - File inventory

## Usage

### Run Full Pipeline
```bash
python run_full_pipeline.py
```

### Run Individual Phases
```bash
python phase1_collect.py --limit 5
python phase2_hygiene.py outputs/phase1_collected_combined_all_cities.csv
python phase3_enrich.py outputs/phase2_approved_*.csv
python phase4_images.py outputs/phase3_enriched_*.csv
```

### With LLM Features
```bash
export ANTHROPIC_API_KEY="your-key"
python run_full_pipeline.py --use-llm --limit-cities 5
```

## Configuration

Edit `config.py` to customize:
- Search queries
- Metro areas
- Resource categories
- Tag taxonomies
- Extraction fields

Edit `.env` for:
- API keys
- Output directory
- Worker concurrency
- Logging settings

## Output

Each phase generates CSV files with progressively enriched data:
- Phase 1: Raw business data
- Phase 2: Classified records with tags
- Phase 3: Website-enriched data
- Phase 4: Final data with images

## Performance

- **Testing (2 cities):** ~5 minutes
- **Full pipeline (95 metros):** 9-18 hours

## Features

- 95 US metro areas
- 28 search query templates
- 8 resource categories
- 12 extraction fields
- 6 AI prompts
- Async/concurrent processing
- Comprehensive error handling
- Progress tracking
- Production-ready logging

## Help

Run `test_pipeline.py` to validate setup:
```bash
python test_pipeline.py
```

See `QUICK_START.md` for common issues.

See `../PIPELINE_GUIDE.md` for complete documentation.

---

**Status:** Production-ready | **Version:** 1.0.0
