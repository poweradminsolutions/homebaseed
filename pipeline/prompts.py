"""
AI Prompts module for HomebaseED homeschooling data pipeline.

Contains all prompts for classification, extraction, and content generation,
optimized for homeschooling resources.
"""

from typing import Dict, List

# ============================================================================
# PHASE 2: RELEVANCE CLASSIFICATION PROMPTS
# ============================================================================

RELEVANCE_CLASSIFICATION_PROMPT = """You are an expert classifier for a homeschooling resource directory.

Analyze the following business information and determine if it represents a legitimate homeschool resource.

BUSINESS INFORMATION:
Name: {name}
Website: {website}
Phone: {phone}
Address: {address}
Description/Reviews Summary: {description}

HOMESCHOOL RESOURCE TYPES TO IDENTIFY:
- Co-ops and learning groups (cooperatives, group learning communities)
- Tutoring and academic support services
- Enrichment programs (arts, music, sciences, languages)
- Sports leagues and PE programs for homeschoolers
- Testing and assessment centers serving homeschools
- Field trip organizers and educational outings
- Online curriculum providers and digital resources
- Parent support groups and homeschool advocacy organizations

BUSINESSES TO EXCLUDE:
- Traditional public/private schools
- Daycare, preschool, or childcare centers
- Summer camps (unless specifically homeschool-focused)
- Unrelated services (plumbing, medical, dental, restaurants, etc.)
- Adult-only educational programs
- After-school programs for traditional school students

TASK:
1. Identify if this is a homeschool resource (YES/MAYBE/NO)
2. If YES or MAYBE, what category best fits? (e.g., "Co-ops & Groups", "Tutoring & Academic Support", etc.)
3. Provide a confidence score (0.0 to 1.0)
4. Explain your reasoning in 1-2 sentences

RESPOND IN THIS EXACT JSON FORMAT:
{{
    "classification": "YES|MAYBE|NO",
    "category": "Category Name or null",
    "confidence": 0.XX,
    "reasoning": "Brief explanation"
}}"""

# ============================================================================
# PHASE 2: CATEGORY AND TAG ASSIGNMENT PROMPTS
# ============================================================================

CATEGORY_ASSIGNMENT_PROMPT = """You are a taxonomy expert for homeschool resources.

Based on the business information below, assign the most appropriate primary category and relevant tags.

BUSINESS INFORMATION:
Name: {name}
Website: {website}
Description: {description}
Category (from initial assessment): {initial_category}

PRIMARY CATEGORIES:
1. Co-ops & Groups - Homeschool cooperatives, groups, and learning communities
2. Tutoring & Academic Support - Individual and group tutoring, academic coaching
3. Enrichment & Extracurricular - Classes and programs beyond core academics (arts, music, etc.)
4. Sports & Physical Education - Sports leagues, PE programs, athletic instruction
5. Testing & Assessment - Standardized testing centers, academic assessment services
6. Field Trips & Educational Outings - Organized field trips and educational outings
7. Online Resources - Online courses, platforms, and curriculum providers
8. Support & Advocacy - Parent organizations, support groups, and advocacy organizations

SECONDARY TAGS TO ASSIGN (select all that apply):

Setting/Format:
- In-person
- Online
- Hybrid
- Outdoor

Age Range (select all that apply):
- PreK (3-5)
- Elementary (6-10)
- Middle School (11-13)
- High School (14-18)
- All Ages

Religious Affiliation (if applicable):
- Secular
- Christian
- Catholic
- Jewish
- Islamic
- Non-denominational
- Multi-faith
- Unspecified

Cost:
- Free
- Low ($1-50/month)
- Moderate ($51-150/month)
- Premium ($151+/month)
- Varies

TASK:
1. Confirm or correct the primary category
2. Assign relevant secondary tags
3. Explain your tag selections

RESPOND IN THIS EXACT JSON FORMAT:
{{
    "primary_category": "Category Name",
    "setting_tags": ["tag1", "tag2"],
    "age_range_tags": ["tag1", "tag2"],
    "religious_affiliation": "Unspecified|Specific if known",
    "cost_tag": "tag",
    "reasoning": "Explanation of tag selections"
}}"""

# ============================================================================
# PHASE 3: WEBSITE DATA EXTRACTION PROMPTS
# ============================================================================

WEBSITE_DATA_EXTRACTION_PROMPT = """You are an expert at extracting structured information from homeschool websites.

Based on the website content provided below, extract the following information about this homeschool resource.

WEBSITE CONTENT:
{website_content}

EXTRACTION FIELDS TO FILL:

1. meeting_schedule - When does this organization meet? (e.g., "Tuesday/Thursday 9am-12pm", "Monthly meetings on first Sunday")
2. curriculum_approach - What teaching philosophy or curriculum method? (e.g., "Classical", "Charlotte Mason", "Unschooling", "Eclectic")
3. enrollment_requirements - What are the requirements to join? (e.g., "Open to all ages", "Membership fee required", "Application needed")
4. class_size - What is the typical class or group size? (e.g., "Small groups (5-10)", "Large co-op (100+)")
5. parent_involvement_level - How much parent involvement is expected? (e.g., "High (parents teach classes)", "Moderate (parent volunteers)", "Low (minimal)")
6. accreditation_status - Any accreditation? (e.g., "NACOP member", "SENG member", "None")
7. grade_levels_served - What grades/ages? (e.g., "K-12", "Elementary and middle school")
8. program_focus - Is it academic-focused or enrichment? (e.g., "Academic co-op", "Enrichment only")
9. certification_requirements - Teacher qualifications if applicable (e.g., "Certified teachers", "None required")
10. cost_structure - Pricing and payment terms (e.g., "$50/month", "Free", "Sliding scale")
11. application_process - How to apply or enroll? (e.g., "Contact director via email", "Online form on website")
12. contact_person_info - Primary contact details (e.g., "Jane Doe, Director: jane@email.com")

For each field, provide:
- value: The extracted information (null if not found)
- confidence: 0.0-1.0 (how confident in this extraction)
- source: The specific part of the website where this was found

RESPOND IN THIS EXACT JSON FORMAT:
{{
    "meeting_schedule": {{"value": "...", "confidence": 0.X, "source": "..."}},
    "curriculum_approach": {{"value": "...", "confidence": 0.X, "source": "..."}},
    "enrollment_requirements": {{"value": "...", "confidence": 0.X, "source": "..."}},
    "class_size": {{"value": "...", "confidence": 0.X, "source": "..."}},
    "parent_involvement_level": {{"value": "...", "confidence": 0.X, "source": "..."}},
    "accreditation_status": {{"value": "...", "confidence": 0.X, "source": "..."}},
    "grade_levels_served": {{"value": "...", "confidence": 0.X, "source": "..."}},
    "program_focus": {{"value": "...", "confidence": 0.X, "source": "..."}},
    "certification_requirements": {{"value": "...", "confidence": 0.X, "source": "..."}},
    "cost_structure": {{"value": "...", "confidence": 0.X, "source": "..."}},
    "application_process": {{"value": "...", "confidence": 0.X, "source": "..."}},
    "contact_person_info": {{"value": "...", "confidence": 0.X, "source": "..."}}
}}"""

# ============================================================================
# PHASE 3: BUSINESS DESCRIPTION GENERATION PROMPT
# ============================================================================

BUSINESS_DESCRIPTION_GENERATION_PROMPT = """You are a skilled content writer for a homeschooling directory.

Based on the business information and extracted data below, write a compelling, informative description for the listing.

BUSINESS INFORMATION:
Name: {name}
Category: {category}
Tags: {tags}
Extracted Data:
{extracted_data}

TASK:
Write a 2-3 sentence description that:
1. Clearly explains what this resource offers to homeschoolers
2. Highlights key differentiators or unique features
3. Mentions who would benefit (age groups, types of learners, etc.)
4. Is written in accessible, friendly language
5. Includes a call-to-action (contact, visit website, etc.)

EXAMPLE FORMATS:
- "This dynamic co-op brings together elementary homeschoolers for twice-weekly classes in math, science, and literature. Led by experienced educators, the program emphasizes hands-on learning and parent involvement. Perfect for families seeking academic rigor with a community feel."
- "ABC Tutoring specializes in personalized test preparation for homeschooled students. Offering both SAT/ACT prep and one-on-one subject tutoring, they work with students from grade 3 through college. Contact them for a free consultation."

RESPOND WITH ONLY THE DESCRIPTION TEXT (no JSON, no additional explanation):"""

# ============================================================================
# PHASE 4: IMAGE VALIDATION PROMPT
# ============================================================================

IMAGE_VALIDATION_PROMPT = """You are an image curator for a homeschooling resource directory.

Analyze the following image and determine if it is appropriate for a homeschool resource listing.

IMAGE INFORMATION:
URL: {image_url}
Context: This image is from {business_name}, a {category} resource

EVALUATION CRITERIA:
1. Is the image relevant to homeschooling, education, or the specific resource?
2. Is the image professional quality (good lighting, composition, focus)?
3. Does it avoid inappropriate content, violence, or offensive material?
4. Is it clearly related to the business/resource (not generic stock photo)?
5. Would it help homeschool families understand what this resource offers?

SUITABILITY CATEGORIES:
- Excellent: Directly relevant, professional, clearly shows the resource in action
- Good: Relevant, professional, helps understand the resource
- Acceptable: Somewhat relevant, professional quality, could work
- Poor: Unrelated, low quality, generic, or inappropriate

RESPOND IN THIS EXACT JSON FORMAT:
{{
    "suitability": "Excellent|Good|Acceptable|Poor",
    "is_valid": true|false,
    "confidence": 0.XX,
    "reasoning": "Brief explanation of the rating"
}}"""

# ============================================================================
# PHASE 4: IMAGE DISCOVERY PROMPT
# ============================================================================

IMAGE_DISCOVERY_PROMPT = """You are helping to find representative images for homeschool resource listings.

Based on the business information and extracted website content below, suggest what types of images would best represent this resource.

BUSINESS INFORMATION:
Name: {name}
Category: {category}
Program Focus: {program_focus}
Description: {description}

TASK:
Identify 3-5 types of images that would be most relevant for this listing:
1. What subject matter or setting should the images show?
2. What activities or interactions should be visible?
3. What mood or atmosphere should be conveyed?
4. What audience demographics should be represented (ages, etc.)?

RESPOND IN THIS EXACT JSON FORMAT:
{{
    "image_types": [
        {{"type": "image type description", "importance": "High|Medium|Low"}},
        {{"type": "image type description", "importance": "High|Medium|Low"}}
    ],
    "search_terms": ["term1", "term2", "term3"],
    "avoid": ["term1", "term2"],
    "explanation": "Why these images are important for this resource"
}}"""

# ============================================================================
# HELPER FUNCTIONS FOR PROMPT FORMATTING
# ============================================================================


def format_relevance_classification_prompt(
    name: str, website: str, phone: str, address: str, description: str
) -> str:
    """Format the relevance classification prompt with business data."""
    return RELEVANCE_CLASSIFICATION_PROMPT.format(
        name=name or "Unknown",
        website=website or "Not provided",
        phone=phone or "Not provided",
        address=address or "Not provided",
        description=description or "No description available",
    )


def format_category_assignment_prompt(
    name: str, website: str, description: str, initial_category: str
) -> str:
    """Format the category assignment prompt with business data."""
    return CATEGORY_ASSIGNMENT_PROMPT.format(
        name=name or "Unknown",
        website=website or "Not provided",
        description=description or "No description available",
        initial_category=initial_category or "Unknown",
    )


def format_website_extraction_prompt(website_content: str) -> str:
    """Format the website extraction prompt with page content."""
    # Truncate if too long
    if len(website_content) > 8000:
        website_content = website_content[:8000] + "...[content truncated]"

    return WEBSITE_DATA_EXTRACTION_PROMPT.format(website_content=website_content)


def format_business_description_prompt(
    name: str, category: str, tags: List[str], extracted_data: Dict
) -> str:
    """Format the business description generation prompt."""
    tags_str = ", ".join(tags) if tags else "None"
    extracted_str = "\n".join(
        [f"- {k}: {v}" for k, v in extracted_data.items() if v]
    )

    return BUSINESS_DESCRIPTION_GENERATION_PROMPT.format(
        name=name,
        category=category,
        tags=tags_str,
        extracted_data=extracted_str or "No extracted data available",
    )


def format_image_validation_prompt(image_url: str, business_name: str, category: str) -> str:
    """Format the image validation prompt."""
    return IMAGE_VALIDATION_PROMPT.format(
        image_url=image_url,
        business_name=business_name,
        category=category,
    )


def format_image_discovery_prompt(
    name: str, category: str, program_focus: str, description: str
) -> str:
    """Format the image discovery prompt."""
    return IMAGE_DISCOVERY_PROMPT.format(
        name=name,
        category=category,
        program_focus=program_focus or "General homeschool resource",
        description=description or "No description available",
    )


if __name__ == "__main__":
    # Example usage
    print("Sample prompt (truncated):")
    sample = format_relevance_classification_prompt(
        name="ABC Homeschool Co-op",
        website="https://example.com",
        phone="555-123-4567",
        address="123 Main St, Austin, TX",
        description="A co-op for elementary homeschoolers",
    )
    print(sample[:500] + "...")
