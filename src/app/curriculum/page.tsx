"use client";

import { useState, useMemo } from "react";
import { curricula, type Curriculum } from "@/data/curricula";
import { Star, Search, ChevronDown, X } from "lucide-react";

type SortOption = "rating" | "name" | "price" | "reviews";

export default function CurriculumPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedApproaches, setSelectedApproaches] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedAffiliations, setSelectedAffiliations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Get unique filter options
  const allSubjects = Array.from(
    new Set(curricula.flatMap((c) => c.subjects))
  ).sort();
  const allGrades = Array.from(
    new Set(
      curricula.map((c) => c.gradeRange).flatMap((g) => {
        // Parse grade ranges like "K-12", "1-6", etc.
        return g;
      })
    )
  ).sort((a, b) => {
    const gradeOrder = [
      "PreK",
      "K",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ];
    const aNum = parseInt(a.replace("PreK", "-1"));
    const bNum = parseInt(b.replace("PreK", "-1"));
    return aNum - bNum;
  });
  const allApproaches = Array.from(
    new Set(curricula.map((c) => c.approach))
  ).sort();
  const allFormats = Array.from(new Set(curricula.map((c) => c.format))).sort();
  const allPrices = ["Free", "$", "$$", "$$$"];
  const allAffiliations = Array.from(
    new Set(curricula.map((c) => c.religiousAffiliation))
  ).sort();

  // Filter and sort results
  const filteredResults = useMemo(() => {
    let results = curricula.filter((curriculum) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          curriculum.name.toLowerCase().includes(query) ||
          curriculum.publisher.toLowerCase().includes(query) ||
          curriculum.description.toLowerCase().includes(query) ||
          curriculum.subjects.some((s) => s.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Subject filter
      if (selectedSubjects.length > 0) {
        const hasSubject = curriculum.subjects.some((s) =>
          selectedSubjects.includes(s)
        );
        if (!hasSubject) return false;
      }

      // Grade filter
      if (selectedGrades.length > 0) {
        const matchesGrade = selectedGrades.some(
          (grade) =>
            curriculum.gradeRange.includes(grade) ||
            curriculum.gradeRange.includes("-")
        );
        if (!matchesGrade) return false;
      }

      // Approach filter
      if (selectedApproaches.length > 0) {
        if (!selectedApproaches.includes(curriculum.approach)) return false;
      }

      // Format filter
      if (selectedFormats.length > 0) {
        if (!selectedFormats.includes(curriculum.format)) return false;
      }

      // Price filter
      if (selectedPrices.length > 0) {
        if (!selectedPrices.includes(curriculum.priceRange)) return false;
      }

      // Affiliation filter
      if (selectedAffiliations.length > 0) {
        if (!selectedAffiliations.includes(curriculum.religiousAffiliation))
          return false;
      }

      return true;
    });

    // Sort results
    results.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          const priceOrder: Record<string, number> = {
            Free: 0,
            $: 1,
            $$: 2,
            $$$: 3,
          };
          return priceOrder[a.priceRange] - priceOrder[b.priceRange];
        case "reviews":
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

    return results;
  }, [
    searchQuery,
    selectedSubjects,
    selectedGrades,
    selectedApproaches,
    selectedFormats,
    selectedPrices,
    selectedAffiliations,
    sortBy,
  ]);

  const toggleFilter = (
    value: string,
    filters: string[],
    setFilters: (filters: string[]) => void
  ) => {
    if (filters.includes(value)) {
      setFilters(filters.filter((f) => f !== value));
    } else {
      setFilters([...filters, value]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedSubjects([]);
    setSelectedGrades([]);
    setSelectedApproaches([]);
    setSelectedFormats([]);
    setSelectedPrices([]);
    setSelectedAffiliations([]);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedSubjects.length > 0 ||
    selectedGrades.length > 0 ||
    selectedApproaches.length > 0 ||
    selectedFormats.length > 0 ||
    selectedPrices.length > 0 ||
    selectedAffiliations.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary-light border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Curriculum Directory
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            Compare 20+ homeschool curricula by subject, grade level, teaching
            approach, and price. Find real parent reviews and ratings to help you
            find the right fit for your family.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Search curricula by name, publisher, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Mobile Filters Toggle - Stacked above results on small screens */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center justify-between px-4 py-3 bg-white border border-border rounded-lg text-foreground hover:bg-primary-light transition-colors w-full"
          >
            <span className="font-semibold">Filters</span>
            <ChevronDown
              className={`w-5 h-5 transform transition-transform ${
                mobileFiltersOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {mobileFiltersOpen && (
            <div className="mt-4 space-y-4 p-4 bg-white border border-border rounded-lg">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-light border border-border rounded-lg text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
              <FilterSection
                title="Subject"
                options={allSubjects}
                selectedOptions={selectedSubjects}
                onToggle={(value) =>
                  toggleFilter(value, selectedSubjects, setSelectedSubjects)
                }
              />
              <FilterSection
                title="Grade Level"
                options={["K", "1-3", "4-6", "7-8", "9-10", "11-12"]}
                selectedOptions={selectedGrades}
                onToggle={(value) =>
                  toggleFilter(value, selectedGrades, setSelectedGrades)
                }
              />
              <FilterSection
                title="Teaching Approach"
                options={allApproaches}
                selectedOptions={selectedApproaches}
                onToggle={(value) =>
                  toggleFilter(
                    value,
                    selectedApproaches,
                    setSelectedApproaches
                  )
                }
              />
              <FilterSection
                title="Format"
                options={allFormats}
                selectedOptions={selectedFormats}
                onToggle={(value) =>
                  toggleFilter(value, selectedFormats, setSelectedFormats)
                }
              />
              <FilterSection
                title="Price Range"
                options={allPrices}
                selectedOptions={selectedPrices}
                onToggle={(value) =>
                  toggleFilter(value, selectedPrices, setSelectedPrices)
                }
              />
              <FilterSection
                title="Religious Affiliation"
                options={allAffiliations}
                selectedOptions={selectedAffiliations}
                onToggle={(value) =>
                  toggleFilter(
                    value,
                    selectedAffiliations,
                    setSelectedAffiliations
                  )
                }
              />
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-6 space-y-6">
              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-primary hover:bg-primary-light transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}

              {/* Subjects Filter */}
              <FilterSection
                title="Subject"
                options={allSubjects}
                selectedOptions={selectedSubjects}
                onToggle={(value) =>
                  toggleFilter(value, selectedSubjects, setSelectedSubjects)
                }
              />

              {/* Grade Level Filter */}
              <FilterSection
                title="Grade Level"
                options={["K", "1-3", "4-6", "7-8", "9-10", "11-12"]}
                selectedOptions={selectedGrades}
                onToggle={(value) =>
                  toggleFilter(value, selectedGrades, setSelectedGrades)
                }
              />

              {/* Approach Filter */}
              <FilterSection
                title="Teaching Approach"
                options={allApproaches}
                selectedOptions={selectedApproaches}
                onToggle={(value) =>
                  toggleFilter(
                    value,
                    selectedApproaches,
                    setSelectedApproaches
                  )
                }
              />

              {/* Format Filter */}
              <FilterSection
                title="Format"
                options={allFormats}
                selectedOptions={selectedFormats}
                onToggle={(value) =>
                  toggleFilter(value, selectedFormats, setSelectedFormats)
                }
              />

              {/* Price Range Filter */}
              <FilterSection
                title="Price Range"
                options={allPrices}
                selectedOptions={selectedPrices}
                onToggle={(value) =>
                  toggleFilter(value, selectedPrices, setSelectedPrices)
                }
              />

              {/* Religious Affiliation Filter */}
              <FilterSection
                title="Religious Affiliation"
                options={allAffiliations}
                selectedOptions={selectedAffiliations}
                onToggle={(value) =>
                  toggleFilter(
                    value,
                    selectedAffiliations,
                    setSelectedAffiliations
                  )
                }
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header with Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-muted">
                  {filteredResults.length} curriculum
                  {filteredResults.length !== 1 ? "s" : ""} found
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-4 py-2 bg-white border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-10"
                  >
                    <option value="rating">Sort by Rating (High to Low)</option>
                    <option value="name">Sort by Name (A-Z)</option>
                    <option value="price">Sort by Price (Low to High)</option>
                    <option value="reviews">
                      Sort by Most Reviewed
                    </option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredResults.map((curriculum) => (
                  <CurriculumCard
                    key={curriculum.id}
                    curriculum={curriculum}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-border rounded-lg p-12 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Results Found
                </h3>
                <p className="text-muted mb-6">
                  We didn't find any curricula matching your filters. Try
                  adjusting your search criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  options: string[];
  selectedOptions: string[];
  onToggle: (value: string) => void;
}

function FilterSection({
  title,
  options,
  selectedOptions,
  onToggle,
}: FilterSectionProps) {
  return (
    <div className="bg-white border border-border rounded-lg p-4">
      <h3 className="font-semibold text-foreground mb-3">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => onToggle(option)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
            />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

interface CurriculumCardProps {
  curriculum: Curriculum;
}

function CurriculumCard({ curriculum }: CurriculumCardProps) {
  return (
    <a
      href={curriculum.website}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all group"
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {curriculum.name}
          </h3>
          <span className="text-xs font-semibold px-2 py-1 bg-primary-light text-primary rounded whitespace-nowrap">
            {curriculum.approach}
          </span>
        </div>
        <p className="text-sm text-muted">{curriculum.publisher}</p>
      </div>

      {/* Info Row */}
      <div className="flex flex-wrap gap-3 mb-4 text-sm text-muted">
        <span>{curriculum.gradeRange}</span>
        <span>•</span>
        <span>{curriculum.priceRange}</span>
        {curriculum.religiousAffiliation !== "None" && (
          <>
            <span>•</span>
            <span className="text-xs">{curriculum.religiousAffiliation}</span>
          </>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(curriculum.rating)
                  ? "fill-accent text-accent"
                  : "text-border"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-muted">
          {curriculum.rating} ({curriculum.reviewCount} reviews)
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-foreground mb-4 line-clamp-2">
        {curriculum.description}
      </p>

      {/* Subjects */}
      <div className="flex flex-wrap gap-2 mb-4">
        {curriculum.subjects.slice(0, 3).map((subject) => (
          <span
            key={subject}
            className="text-xs px-2 py-1 bg-primary-light text-primary rounded"
          >
            {subject}
          </span>
        ))}
        {curriculum.subjects.length > 3 && (
          <span className="text-xs px-2 py-1 bg-border text-muted rounded">
            +{curriculum.subjects.length - 3}
          </span>
        )}
      </div>

      {/* Features */}
      <div className="pt-4 border-t border-border">
        <ul className="text-xs text-muted space-y-1">
          {curriculum.features.slice(0, 2).map((feature, idx) => (
            <li key={idx} className="flex gap-2">
              <span>•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-4">
        <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
          Visit Website →
        </span>
      </div>
    </a>
  );
}
