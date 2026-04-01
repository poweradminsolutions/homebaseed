"use client";

import { useState, useMemo } from "react";
import {
  coops,
  getUniqueStates,
  getUniqueCounties,
  type CoOp,
} from "@/data/coops";
import { Search, MapPin, Users, BookOpen, ChevronDown, X, Mail, Phone, ExternalLink } from "lucide-react";

const typeLabels: Record<CoOp["type"], string> = {
  "co-op": "Co-op",
  "support-group": "Support Group",
  enrichment: "Enrichment",
  evaluation: "Evaluation Service",
  resource: "Resource",
  "hybrid-school": "Hybrid School",
  tutoring: "Tutoring",
};

const typeColors: Record<CoOp["type"], string> = {
  "co-op": "bg-primary-light text-primary",
  "support-group": "bg-blue-50 text-blue-700",
  enrichment: "bg-amber-50 text-amber-700",
  evaluation: "bg-purple-50 text-purple-700",
  resource: "bg-gray-100 text-gray-700",
  "hybrid-school": "bg-emerald-50 text-emerald-700",
  tutoring: "bg-rose-50 text-rose-700",
};

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("Florida");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const states = getUniqueStates();
  const counties = getUniqueCounties(selectedState);

  const allTypes = Array.from(new Set(coops.map((c) => c.type))).sort();

  const filteredResults = useMemo(() => {
    return coops.filter((coop) => {
      if (selectedState && coop.state !== selectedState) return false;
      if (selectedCounty && coop.county !== selectedCounty) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(coop.type))
        return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          coop.name.toLowerCase().includes(query) ||
          coop.county.toLowerCase().includes(query) ||
          (coop.city && coop.city.toLowerCase().includes(query)) ||
          (coop.description && coop.description.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [searchQuery, selectedState, selectedCounty, selectedTypes]);

  const groupedByCounty = useMemo(() => {
    const groups: Record<string, CoOp[]> = {};
    filteredResults.forEach((coop) => {
      if (!groups[coop.county]) groups[coop.county] = [];
      groups[coop.county].push(coop);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredResults]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCounty("");
    setSelectedTypes([]);
  };

  const hasActiveFilters =
    searchQuery || selectedCounty || selectedTypes.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-primary-light border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Homeschool Community Directory
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            Find local co-ops, support groups, enrichment programs, and
            homeschooling communities near you. Connect with families who share
            your approach and values.
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>{coops.length} groups listed</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{counties.length} counties covered</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>{allTypes.length} group types</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, city, county, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Mobile Filters */}
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
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-light border border-border rounded-lg text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCounty("");
                  }}
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  County
                </label>
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Counties</option>
                  {counties.map((county) => (
                    <option key={county} value={county}>
                      {county}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Group Type
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        selectedTypes.includes(type)
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-foreground border-border hover:border-primary"
                      }`}
                    >
                      {typeLabels[type as CoOp["type"]]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-6 space-y-6">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-primary hover:bg-primary-light transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}

              <div className="bg-white border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">State</h3>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCounty("");
                  }}
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">County</h3>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => setSelectedCounty("")}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                      !selectedCounty
                        ? "bg-primary-light text-primary font-medium"
                        : "text-foreground hover:bg-gray-50"
                    }`}
                  >
                    All Counties ({filteredResults.length})
                  </button>
                  {counties.map((county) => {
                    const count = coops.filter(
                      (c) => c.state === selectedState && c.county === county
                    ).length;
                    return (
                      <button
                        key={county}
                        onClick={() => setSelectedCounty(county)}
                        className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                          selectedCounty === county
                            ? "bg-primary-light text-primary font-medium"
                            : "text-foreground hover:bg-gray-50"
                        }`}
                      >
                        {county} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">
                  Group Type
                </h3>
                <div className="space-y-2">
                  {allTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                        {typeLabels[type as CoOp["type"]]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted">
                {filteredResults.length} group
                {filteredResults.length !== 1 ? "s" : ""} found
                {selectedCounty ? ` in ${selectedCounty} County` : ""}
              </p>
            </div>

            {groupedByCounty.length > 0 ? (
              <div className="space-y-8">
                {groupedByCounty.map(([county, groups]) => (
                  <div key={county}>
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-bold text-foreground">
                        {county} County
                      </h2>
                      <span className="text-sm text-muted">
                        ({groups.length})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groups.map((coop) => (
                        <CoOpCard key={coop.id} coop={coop} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-border rounded-lg p-12 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Groups Found
                </h3>
                <p className="text-muted mb-6">
                  We didn't find any groups matching your filters. Try adjusting
                  your search or browse all counties.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            )}

            {/* CTA Section */}
            <div className="mt-12 bg-primary-light border border-border rounded-lg p-8 text-center">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Know a group that should be listed here?
              </h3>
              <p className="text-muted mb-6 max-w-lg mx-auto">
                We're building the most complete homeschool community directory
                in the country. If you run or participate in a co-op, support
                group, or enrichment program, let us know.
              </p>
              <a
                href="/submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
              >
                Submit a Listing
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoOpCard({ coop }: { coop: CoOp }) {
  return (
    <div className="bg-white border border-border rounded-lg p-5 hover:shadow-md hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-bold text-foreground text-base leading-tight">
          {coop.name}
        </h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
            typeColors[coop.type]
          }`}
        >
          {typeLabels[coop.type]}
        </span>
      </div>

      {coop.description && (
        <p className="text-sm text-muted mb-3 line-clamp-2">
          {coop.description}
        </p>
      )}

      <div className="space-y-1.5 text-sm">
        {coop.city && (
          <div className="flex items-center gap-2 text-muted">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              {coop.address || `${coop.city}, ${coop.state}`}
            </span>
          </div>
        )}
        {coop.phone && (
          <div className="flex items-center gap-2 text-muted">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <a
              href={`tel:${coop.phone.replace(/[^\d+]/g, "")}`}
              className="hover:text-primary transition-colors"
            >
              {coop.phone}
            </a>
          </div>
        )}
        {coop.email && (
          <div className="flex items-center gap-2 text-muted">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <a
              href={`mailto:${coop.email}`}
              className="hover:text-primary transition-colors truncate"
            >
              {coop.email}
            </a>
          </div>
        )}
        {coop.website && (
          <div className="flex items-center gap-2 text-muted">
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            <a
              href={coop.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors truncate"
            >
              Visit Website
            </a>
          </div>
        )}
      </div>

      {coop.religiousAffiliation && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted">
            {coop.religiousAffiliation}
          </span>
        </div>
      )}
    </div>
  );
}
