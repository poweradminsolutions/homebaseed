# HomebaseED Data Pipeline Guide

## Overview

This is a production-ready data pipeline for discovering, classifying, and enriching homeschooling resources across the United States. The pipeline follows a four-phase methodology:

1. **Phase 1: Collect** - Outscraper API collects business data from Google Maps
2. **Phase 2: Hygiene** - Data cleaning, validation, and homeschool relevance classification
3. **Phase 3: Enrich** - Website crawling and extraction of homeschool-specific information
4. **Phase 4: Images** - Image discovery and validation for listings

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Collection (Outscraper)                            │
│ → Searches: co-ops, tutoring, enrichment, testing, sports   │
│ → 100 US metros × 7 query types = ~700 API calls           │
│ → Output: Raw business data CSV                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Hygiene & Classification                           │
│ → Validate phone, email, website URLs                       │
│ → Check exclusion keywords (daycares, schools, etc.)        │
│ → Classify: YES/MAYBE/NO for homeschool relevance          │
│ → Assign categories and tags                                │
│ → Output: Approved & rejected records                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 3: Website Enrichment (Crawl4AI)                      │
│ → Crawl approved websites                                   │
│ → Extract: schedules, curriculum, costs, enrollment         │
│ → Generate SEO-friendly descriptions                        │
│ → Output: Enriched records with website data                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 4: Image Enrichment                                   │
│ → Extract images from websites                              │
│ → Validate images for appropriateness                       │
│ → Suggest relevant image types                              │
│ → Output: Final enriched records with images                │
└─────────────────────────────────────────────────────────────┘
```

## Installation

### 1. Clone and Setup

```bash
cd /sessions/zealous-eloquent-sagan/homebaseed/pipeline
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.template .env
# Edit .env and add your API keys
```

## Configuration

### Environment Variables

**Required:**
- `OUTSCRAPER_API_KEY` - Get from https://outscraper.com/

**Optional (for LLM features):**
- `ANTHROPIC_API_KEY` - For Claude-based classification
- `OPENAI_API_KEY` - For GPT-based classification

**Optional (for website crawling):**
- `CRAWL4AI_BASE_URL` - Self-hosted Crawl4AI instance

### Configuration Files

**config.py** - Main pipeline configuration:
- Search queries for each resource type
- Top 100 US metro areas
- Resource taxonomy and tags
- Pipeline settings and thresholds

**prompts.py** - AI prompts for each phase:
- Relevance classification
- Category and tag assignment
- Website data extraction
- Business description generation
- Image validation

## Usage

### Option 1: Run Full Pipeline

```bash
# Run pipeline for all cities (takes several hours)
python run_full_pipeline.py

# Run pipeline limited to first 5 cities (for testing)
python run_full_pipeline.py --limit-cities 5

# Run pipeline for specific cities
python run_full_pipeline.py --cities "Austin,Denver,New York City"

# Use LLM for classification (requires API keys)
python run_full_pipeline.py --use-llm --limit-cities 5

# Specify custom output directory
python run_full_pipeline.py --output-dir /path/to/output --limit-cities 5
```

### Option 2: Run Individual Phases

```bash
# Phase 1: Collect from Outscraper
python phase1_collect.py --limit 5
python phase1_collect.py --city "Austin"

# Phase 2: Hygiene & Classification
python phase2_hygiene.py outputs/phase1_collected_combined_all_cities.csv
python phase2_hygiene.py outputs/phase1_collected_combined_all_cities.csv --use-llm

# Phase 3: Website Enrichment
python phase3_enrich.py outputs/phase2_approved_*.csv
python phase3_enrich.py outputs/phase2_approved_*.csv --use-llm

# Phase 4: Image Enrichment
python phase4_images.py outputs/phase3_enriched_*.csv
python phase4_images.py outputs/phase3_enriched_*.csv --use-llm
```

## Data Structure

### Phase 1 Output (Raw Collection)

```csv
name,website,phone,address,type,review_count,review_rating,google_maps_url,...
```

### Phase 2 Output (Classified)

```csv
name,website,phone,address,classification,primary_category,setting_tags,age_range_tags,cost_tag,...
```

**Classification Values:**
- `YES` - Confirmed homeschool resource
- `MAYBE` - Likely homeschool resource, needs review
- `NO` - Not a homeschool resource

**Categories:**
- Co-ops & Groups
- Tutoring & Academic Support
- Enrichment & Extracurricular
- Sports & Physical Education
- Testing & Assessment
- Field Trips & Educational Outings
- Online Resources
- Support & Advocacy

**Tag Dimensions:**
- **Setting:** In-person, Online, Hybrid, Outdoor
- **Age Range:** PreK (3-5), Elementary (6-10), Middle School (11-13), High School (14-18), All Ages
- **Religious:** Secular, Christian, Catholic, Jewish, Islamic, Non-denominational, Multi-faith, Unspecified
- **Cost:** Free, Low ($1-50/month), Moderate ($51-150/month), Premium ($151+/month), Varies

### Phase 3 Output (Enriched)

```csv
name,website,...,meeting_schedule,curriculum_approach,enrollment_requirements,
class_size,parent_involvement_level,accreditation_status,cost_structure,generated_description,...
```

### Phase 4 Output (Final)

```csv
name,website,...,image_count,images,image_status,...
```

## Homeschool-Specific Taxonomy

### Resource Types

The pipeline classifies resources into 8 categories optimized for homeschoolers:

1. **Co-ops & Groups** - Learning cooperatives, study groups, homeschool communities
2. **Tutoring & Academic Support** - One-on-one tutoring, academic coaching, test prep
3. **Enrichment & Extracurricular** - Arts, music, sciences, languages beyond core curriculum
4. **Sports & Physical Education** - PE programs, leagues, athletic instruction
5. **Testing & Assessment** - Standardized testing, academic evaluation services
6. **Field Trips & Educational Outings** - Organized educational trips and excursions
7. **Online Resources** - Digital curriculum, online courses, learning platforms
8. **Support & Advocacy** - Parent organizations, support groups, advocacy networks

### Extracted Fields (Phase 3)

For each approved resource, Phase 3 attempts to extract:

- **meeting_schedule** - When does it meet? (e.g., "Tuesday/Thursday 9am-12pm")
- **curriculum_approach** - Teaching philosophy (e.g., "Classical", "Charlotte Mason", "Unschooling")
- **enrollment_requirements** - How to join (e.g., "Application required", "Open enrollment")
- **class_size** - Typical group size (e.g., "Small groups (5-10)", "Large co-op (100+)")
- **parent_involvement_level** - Expected parent participation (High/Moderate/Low)
- **accreditation_status** - Relevant accreditations
- **grade_levels_served** - Which grades? (K-12, Elementary, etc.)
- **program_focus** - Academic vs. enrichment
- **certification_requirements** - Teacher qualifications
- **cost_structure** - Pricing and payment terms
- **application_process** - How to enroll
- **contact_person_info** - Primary contact details

## Using LLM Features

To enable AI-powered classification and extraction, set `--use-llm` flag and configure API keys:

```bash
# Using Anthropic Claude
export ANTHROPIC_API_KEY="your-key-here"
python run_full_pipeline.py --use-llm --limit-cities 5

# Using OpenAI GPT
export OPENAI_API_KEY="your-key-here"
python run_full_pipeline.py --use-llm --limit-cities 5
```

**Note:** LLM features require implementing actual API calls in:
- `phase2_hygiene.py::Phase2Processor._classify_with_llm()`
- `phase3_enrich.py::WebsiteEnricher._extract_with_llm()`
- `phase4_images.py::ImageExtractor._validate_with_llm()`

The current implementation uses heuristic-based classification for demonstration.

## Output Files

Each phase generates:

1. **CSV files** - Processed records
2. **Statistics JSON** - Phase metrics and counts
3. **Log files** - Detailed execution logs
4. **Metadata JSON** - Collection/processing metadata

Example output structure:
```
outputs/
├── phase1_collected_austin.csv
├── phase1_collected_denver.csv
├── phase1_collected_combined_all_cities.csv
├── phase1_metadata.json
├── phase2_approved_20240315_143022.csv
├── phase2_rejected_20240315_143022.csv
├── phase2_stats_20240315_143022.json
├── phase3_enriched_20240315_144530.csv
├── phase3_stats_20240315_144530.json
├── phase4_images_20240315_150045.csv
├── phase4_stats_20240315_150045.json
├── pipeline_results_20240315_150100.json
└── pipeline_20240315_143000.log
```

## Error Handling

Each phase includes comprehensive error handling:

- **Validation errors** → Records logged to rejected/error files
- **API errors** → Logged with retry logic
- **Data quality issues** → Excluded based on heuristics or LLM assessment
- **Network issues** → Async retries with exponential backoff

Check the log files for detailed error messages:
```bash
tail -f outputs/pipeline_*.log
```

## Performance & Optimization

### Typical Execution Times

For 100 US metros with 7 query types each (700 queries):

| Phase | Time | Notes |
|-------|------|-------|
| Phase 1 | 6-12 hours | API rate limiting, 1-2 sec/query |
| Phase 2 | 10-20 min | ~5-10K records processed |
| Phase 3 | 2-4 hours | Website crawling, concurrent workers |
| Phase 4 | 1-2 hours | Image extraction and validation |

### Optimization Tips

1. **Limit cities for testing:** `--limit-cities 5` for quick iterations
2. **Increase workers:** Modify `PIPELINE_CONFIG["phase3"]["concurrent_workers"]`
3. **Cache results:** Phase outputs are saved - can rerun later phases independently
4. **Use LLM carefully:** LLM calls are slower but more accurate

## Extending the Pipeline

### Adding Custom Queries

Edit `config.py::OUTSCRAPER_QUERIES`:
```python
OUTSCRAPER_QUERIES = {
    "custom_category": [
        "your custom query {city}",
        "another query {city}",
    ],
    ...
}
```

### Adding Custom Tags

Edit `config.py` to add new tag dimensions:
```python
CUSTOM_TAGS = ["tag1", "tag2", "tag3"]
```

### Custom Classification Logic

Modify the classification functions in `phase2_hygiene.py` or implement real LLM calls.

### Custom Extraction Fields

Edit `config.py::EXTRACTION_FIELDS` and `prompts.py::WEBSITE_DATA_EXTRACTION_PROMPT`.

## Production Deployment

### Recommended Setup

1. **Database:** Store results in PostgreSQL instead of CSV
2. **Orchestration:** Use Apache Airflow or Prefect for scheduling
3. **Monitoring:** Set up error alerts via email/Slack
4. **Scaling:** Run phases in parallel across multiple workers
5. **Caching:** Implement result caching to avoid re-processing

### Database Integration

```python
from sqlalchemy import create_engine
engine = create_engine("postgresql://user:password@localhost/homebaseed")
df.to_sql("resources", engine, if_exists="append", index=False)
```

### Scheduling

```bash
# Run daily collection
0 2 * * * cd /path/to/pipeline && python run_full_pipeline.py

# Run weekly enrichment on Sundays
0 3 * * 0 cd /path/to/pipeline && python run_full_pipeline.py --limit-cities 20
```

## Troubleshooting

### Issue: "OUTSCRAPER_API_KEY not set"

**Solution:** Set environment variable or pass `--api-key`:
```bash
export OUTSCRAPER_API_KEY="your-key"
python phase1_collect.py --api-key "your-key"
```

### Issue: Low approval rate in Phase 2

**Solution:** Review rejected records and adjust exclusion keywords in `config.py`:
```python
EXCLUSION_KEYWORDS = [...]  # Remove overly aggressive terms
```

### Issue: Phase 3 timeouts

**Solution:** Increase timeout and reduce concurrent workers:
```python
PIPELINE_CONFIG["phase3"]["timeout_seconds"] = 60
PIPELINE_CONFIG["phase3"]["concurrent_workers"] = 3
```

### Issue: No images found in Phase 4

**Solution:** Ensure websites are being crawled successfully in Phase 3. Check logs for crawl failures.

## Support & Contribution

For issues, questions, or improvements:
1. Check the log files first
2. Review the configuration in `config.py`
3. Test with `--limit-cities 2` for quick iteration
4. Implement LLM features for better accuracy

## License

This pipeline is part of HomebaseED, a free homeschooling directory for the US.
