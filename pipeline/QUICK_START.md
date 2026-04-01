# Quick Start Guide - HomebaseED Data Pipeline

## 30-Second Setup

```bash
cd pipeline
pip install -r requirements.txt
cp .env.template .env
# Edit .env and add OUTSCRAPER_API_KEY
python test_pipeline.py
```

## Run Pipeline

```bash
# Test with 2 cities (5 minutes)
python run_full_pipeline.py --limit-cities 2

# Run all 95 metros (12-18 hours)
python run_full_pipeline.py

# Run specific cities
python run_full_pipeline.py --cities "Austin,Denver"

# With LLM features
python run_full_pipeline.py --use-llm --limit-cities 5
```

## Run Individual Phases

```bash
# Phase 1: Collect from Outscraper
python phase1_collect.py --limit 5

# Phase 2: Clean & Classify
python phase2_hygiene.py outputs/phase1_collected_combined_all_cities.csv

# Phase 3: Extract from Websites
python phase3_enrich.py outputs/phase2_approved_*.csv

# Phase 4: Find & Validate Images
python phase4_images.py outputs/phase3_enriched_*.csv
```

## Output Files

Each phase creates:
- `phase*_*.csv` - Processed records
- `phase*_stats_*.json` - Phase statistics
- `phase*_*.log` - Detailed logs

Final output in `outputs/phase4_images_*.csv` has all enriched data.

## Configuration

Edit `config.py` to:
- Change search queries
- Add/remove metros
- Adjust tag categories
- Modify extraction fields

Edit `.env` for:
- API keys (Outscraper, Anthropic, OpenAI)
- Output directory
- Worker concurrency
- Log levels

## Taxonomy Quick Reference

### 8 Resource Categories
1. Co-ops & Groups
2. Tutoring & Academic Support
3. Enrichment & Extracurricular
4. Sports & Physical Education
5. Testing & Assessment
6. Field Trips & Educational Outings
7. Online Resources
8. Support & Advocacy

### Tag Dimensions
- **Setting:** In-person, Online, Hybrid, Outdoor
- **Age:** PreK, Elementary, Middle School, High School, All Ages
- **Religion:** Secular, Christian, Catholic, Jewish, Islamic, Non-denom, Multi-faith, Unspecified
- **Cost:** Free, Low, Moderate, Premium, Varies

### 12 Extracted Fields
- Meeting schedule
- Curriculum approach
- Enrollment requirements
- Class size
- Parent involvement level
- Accreditation status
- Grade levels served
- Program focus
- Certification requirements
- Cost structure
- Application process
- Contact person info

## Troubleshooting

**"OUTSCRAPER_API_KEY not set"**
```bash
export OUTSCRAPER_API_KEY="your-key-here"
```

**"No module named 'aiohttp'"**
```bash
pip install -r requirements.txt
```

**Low approval rate**
- Check `outputs/phase2_rejected_*.csv` for patterns
- Review exclusion keywords in `config.py`

**Slow performance**
- Use `--limit-cities 2` for testing
- Increase `concurrent_workers` in `config.py`
- Run on larger machine for faster crawling

## File Locations

```
/sessions/zealous-eloquent-sagan/homebaseed/
├── pipeline/                    # Main pipeline code
│   ├── config.py
│   ├── prompts.py
│   ├── phase1_collect.py
│   ├── phase2_hygiene.py
│   ├── phase3_enrich.py
│   ├── phase4_images.py
│   ├── run_full_pipeline.py
│   ├── test_pipeline.py
│   ├── requirements.txt
│   ├── .env.template
│   └── outputs/                 # Generated here
│
├── PIPELINE_GUIDE.md            # Complete documentation
├── PIPELINE_SUMMARY.md          # Project summary
└── QUICK_START.md               # This file
```

## Common Commands

```bash
# View pipeline status
tail -f outputs/pipeline_*.log

# Check rejected records
head -20 outputs/phase2_rejected_*.csv

# Count approved records
wc -l outputs/phase2_approved_*.csv

# Extract specific data
cut -d, -f1,3,7 outputs/phase4_images_*.csv

# Convert to JSON (if needed)
python -c "import csv, json; print(json.dumps(list(csv.DictReader(open('output.csv')))))"
```

## Next Steps

1. **Setup**: `python test_pipeline.py`
2. **Test**: `python run_full_pipeline.py --limit-cities 2`
3. **Review**: Check `outputs/` directory
4. **Adjust**: Modify `config.py` as needed
5. **Deploy**: Run full pipeline or schedule with cron

## Help

See `PIPELINE_GUIDE.md` for:
- Complete architecture overview
- Detailed phase explanations
- Advanced configuration
- Performance optimization
- Production deployment
- Troubleshooting guide

---

**Ready to go!** Start with:
```bash
python test_pipeline.py
python run_full_pipeline.py --limit-cities 2
```
