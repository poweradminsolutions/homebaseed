'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { resources } from '@/data/resources';
import type { Resource } from '@/data/resources';
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
  Search,
  X,
  Plus,
} from 'lucide-react';

type SortOption = 'name' | 'state' | 'type';
type CostFilter = 'free' | 'low-cost' | 'moderate' | 'varies';

const STATES = Array.from(
  new Set(resources.map((r) => ({ name: r.state, slug: r.stateSlug })))
).sort((a, b) => a.name.localeCompare(b.name));

const RESOURCE_TYPES = [
  { value: 'co-op', label: 'Co-ops' },
  { value: 'tutor', label: 'Tutors' },
  { value: 'support-group', label: 'Support Groups' },
  { value: 'enrichment', label: 'Enrichment' },
  { value: 'sports', label: 'Sports' },
  { value: 'field-trip', label: 'Field Trips' },
  { value: 'online-community', label: 'Online Community' },
  { value: 'testing-center', label: 'Testing Centers' },
];

const AGE_RANGES = ['K-5', '6-8', '8-12', '9-12', '10-18', '11-18', '13-18', 'K-12', 'All ages', '4-18'];

const RELIGIOUS_AFFILIATIONS = [
  'Secular',
  'Non-denominational',
  'Christian',
  'Catholic',
];

const COST_OPTIONS = [
  { value: 'free', label: 'Free' },
  { value: 'low-cost', label: 'Low Cost' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'varies', label: 'Varies' },
];

const getTypeBadgeColor = (type: Resource['type']) => {
  const colors: Record<Resource['type'], string> = {
    'co-op': 'bg-blue-100 text-blue-800',
    tutor: 'bg-purple-100 text-purple-800',
    'support-group': 'bg-green-100 text-green-800',
    enrichment: 'bg-orange-100 text-orange-800',
    sports: 'bg-red-100 text-red-800',
    'field-trip': 'bg-yellow-100 text-yellow-800',
    'online-community': 'bg-indigo-100 text-indigo-800',
    'testing-center': 'bg-pink-100 text-pink-800',
  };
  return colors[type];
};

const getTypeLabel = (type: Resource['type']) => {
  return RESOURCE_TYPES.find((t) => t.value === type)?.label || type;
};

const costToValue = (cost: string): number => {
  const costMap: Record<string, number> = {
    'Free': 0,
    'Low Cost': 1,
    'Moderate': 2,
    'Varies': 3,
  };
  return costMap[cost] ?? 3;
};

export default function FindResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([]);
  const [selectedReligion, setSelectedReligion] = useState('');
  const [selectedCosts, setSelectedCosts] = useState<CostFilter[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter and search logic
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      // Search term
      const searchLower = searchTerm.toLowerCase();
      if (
        searchLower &&
        !resource.name.toLowerCase().includes(searchLower) &&
        !resource.description.toLowerCase().includes(searchLower) &&
        !resource.city.toLowerCase().includes(searchLower)
      ) {
        return false;
      }

      // State filter
      if (selectedState && resource.stateSlug !== selectedState) {
        return false;
      }

      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(resource.type)) {
        return false;
      }

      // Age range filter
      if (selectedAgeRanges.length > 0 && !selectedAgeRanges.includes(resource.ageRange)) {
        return false;
      }

      // Religious affiliation filter
      if (selectedReligion && resource.religiousAffiliation !== selectedReligion) {
        return false;
      }

      // Cost filter
      if (selectedCosts.length > 0) {
        const resourceCostValue = costToValue(resource.cost);
        const selectedCostValues = selectedCosts.map((cost) => {
          const costMap: Record<CostFilter, number> = {
            'free': 0,
            'low-cost': 1,
            'moderate': 2,
            'varies': 3,
          };
          return costMap[cost];
        });
        if (!selectedCostValues.includes(resourceCostValue)) {
          return false;
        }
      }

      return true;
    });
  }, [
    searchTerm,
    selectedState,
    selectedTypes,
    selectedAgeRanges,
    selectedReligion,
    selectedCosts,
  ]);

  // Sort logic
  const sortedResources = useMemo(() => {
    const sorted = [...filteredResources];
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'state':
        return sorted.sort((a, b) => a.state.localeCompare(b.state));
      case 'type':
        return sorted.sort((a, b) => a.type.localeCompare(b.type));
      default:
        return sorted;
    }
  }, [filteredResources, sortBy]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleAgeRange = (range: string) => {
    setSelectedAgeRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const toggleCost = (cost: CostFilter) => {
    setSelectedCosts((prev) =>
      prev.includes(cost) ? prev.filter((c) => c !== cost) : [...prev, cost]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedState('');
    setSelectedTypes([]);
    setSelectedAgeRanges([]);
    setSelectedReligion('');
    setSelectedCosts([]);
    setSortBy('name');
  };

  const activeFilterCount =
    (selectedState ? 1 : 0) +
    selectedTypes.length +
    selectedAgeRanges.length +
    (selectedReligion ? 1 : 0) +
    selectedCosts.length;

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* Search Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E2E2E0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-[#6B6B6B] h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, city, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 rounded-lg border border-[#E2E2E0] focus:outline-none focus:ring-2 focus:ring-[#1B6B4A] focus:border-transparent text-[#1A1A1A] placeholder-[#6B6B6B]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1B6B4A] text-white rounded-lg font-medium"
            >
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  mobileFiltersOpen ? 'rotate-180' : ''
                }`}
              />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>

          {/* Filters Sidebar */}
          <aside
            className={`lg:block w-full lg:w-64 flex-shrink-0 ${
              mobileFiltersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="sticky top-20 space-y-6">
              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full text-sm text-[#1B6B4A] hover:text-[#155740] font-medium flex items-center justify-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear all filters
                </button>
              )}

              {/* State Filter */}
              <div>
                <label className="text-sm font-semibold text-[#1A1A1A] block mb-3">
                  State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2E2E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B4A] text-[#1A1A1A]"
                >
                  <option value="">All States</option>
                  {STATES.map((state) => (
                    <option key={state.slug} value={state.slug}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resource Type Filter */}
              <div>
                <label className="text-sm font-semibold text-[#1A1A1A] block mb-3">
                  Resource Type
                </label>
                <div className="space-y-2">
                  {RESOURCE_TYPES.map((type) => (
                    <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.value)}
                        onChange={() => toggleType(type.value)}
                        className="w-4 h-4 text-[#1B6B4A] rounded border-[#E2E2E0] cursor-pointer"
                      />
                      <span className="text-sm text-[#1A1A1A]">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Age Range Filter */}
              <div>
                <label className="text-sm font-semibold text-[#1A1A1A] block mb-3">
                  Age Range
                </label>
                <div className="space-y-2">
                  {AGE_RANGES.map((range) => (
                    <label key={range} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAgeRanges.includes(range)}
                        onChange={() => toggleAgeRange(range)}
                        className="w-4 h-4 text-[#1B6B4A] rounded border-[#E2E2E0] cursor-pointer"
                      />
                      <span className="text-sm text-[#1A1A1A]">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Religious Affiliation Filter */}
              <div>
                <label className="text-sm font-semibold text-[#1A1A1A] block mb-3">
                  Religious Affiliation
                </label>
                <select
                  value={selectedReligion}
                  onChange={(e) => setSelectedReligion(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2E2E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B4A] text-[#1A1A1A]"
                >
                  <option value="">Any affiliation</option>
                  {RELIGIOUS_AFFILIATIONS.map((affiliation) => (
                    <option key={affiliation} value={affiliation}>
                      {affiliation}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cost Filter */}
              <div>
                <label className="text-sm font-semibold text-[#1A1A1A] block mb-3">
                  Cost
                </label>
                <div className="space-y-2">
                  {COST_OPTIONS.map((cost) => (
                    <label key={cost.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCosts.includes(cost.value as CostFilter)}
                        onChange={() => toggleCost(cost.value as CostFilter)}
                        className="w-4 h-4 text-[#1B6B4A] rounded border-[#E2E2E0] cursor-pointer"
                      />
                      <span className="text-sm text-[#1A1A1A]">{cost.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A]">
                  {sortedResources.length}
                </h2>
                <p className="text-sm text-[#6B6B6B] mt-1">
                  {sortedResources.length === 1 ? 'resource found' : 'resources found'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[#1A1A1A]">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-[#E2E2E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B4A] text-sm text-[#1A1A1A]"
                >
                  <option value="name">Name</option>
                  <option value="state">State</option>
                  <option value="type">Type</option>
                </select>
              </div>
            </div>

            {/* Results List */}
            {sortedResources.length > 0 ? (
              <div className="space-y-4">
                {sortedResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white rounded-lg border border-[#E2E2E0] p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                          {resource.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(
                              resource.type
                            )}`}
                          >
                            {getTypeLabel(resource.type)}
                          </span>
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                            {resource.cost}
                          </span>
                          {resource.religiousAffiliation !== 'Secular' && (
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                              {resource.religiousAffiliation}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#6B6B6B] mb-3">{resource.description}</p>

                        {/* Location and Schedule */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B6B6B] mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#1B6B4A]" />
                            <span>
                              {resource.city}, {resource.state} {resource.zipCode}
                            </span>
                          </div>
                          {resource.meetingSchedule && (
                            <div className="text-sm text-[#6B6B6B]">
                              {resource.meetingSchedule}
                            </div>
                          )}
                        </div>

                        {/* Age Range */}
                        <div className="text-sm text-[#6B6B6B] mb-3">
                          Ages: <span className="font-medium text-[#1A1A1A]">{resource.ageRange}</span>
                        </div>

                        {/* Features */}
                        {resource.features.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-[#6B6B6B] mb-2">Features:</p>
                            <div className="flex flex-wrap gap-2">
                              {resource.features.map((feature) => (
                                <span
                                  key={feature}
                                  className="inline-block px-2 py-1 rounded text-xs bg-[#EFF6F1] text-[#1B6B4A]"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="pt-4 border-t border-[#E2E2E0] flex flex-wrap gap-3">
                      {resource.website && (
                        <a
                          href={resource.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-[#1B6B4A] hover:text-[#155740] transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Website
                        </a>
                      )}
                      {resource.email && (
                        <a
                          href={`mailto:${resource.email}`}
                          className="inline-flex items-center gap-2 text-sm font-medium text-[#1B6B4A] hover:text-[#155740] transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                          Email
                        </a>
                      )}
                      {resource.phone && (
                        <a
                          href={`tel:${resource.phone}`}
                          className="inline-flex items-center gap-2 text-sm font-medium text-[#1B6B4A] hover:text-[#155740] transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Search className="h-12 w-12 mx-auto text-[#E2E2E0]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                  No resources found
                </h3>
                <p className="text-[#6B6B6B] mb-6">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-block px-4 py-2 bg-[#1B6B4A] text-white rounded-lg font-medium hover:bg-[#155740] transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* CTA Section */}
            <div className="mt-12 bg-[#EFF6F1] rounded-lg p-8 border border-[#E2E2E0]">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">
                  Don't see your group?
                </h2>
                <p className="text-[#6B6B6B] mb-6">
                  If you know of a homeschool co-op, tutor, or support group that should be in our
                  directory, we'd love to hear about it. Help other families discover great
                  homeschool resources.
                </p>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B6B4A] text-white rounded-lg font-semibold hover:bg-[#155740] transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Add Your Group
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
