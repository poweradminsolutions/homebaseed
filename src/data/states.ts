export interface StateInfo {
  name: string;
  abbreviation: string;
  slug: string;
  regulationLevel: "none" | "low" | "moderate" | "high";
}

export const states: StateInfo[] = [
  { name: "Alabama", abbreviation: "AL", slug: "alabama", regulationLevel: "low" },
  { name: "Alaska", abbreviation: "AK", slug: "alaska", regulationLevel: "none" },
  { name: "Arizona", abbreviation: "AZ", slug: "arizona", regulationLevel: "low" },
  { name: "Arkansas", abbreviation: "AR", slug: "arkansas", regulationLevel: "moderate" },
  { name: "California", abbreviation: "CA", slug: "california", regulationLevel: "low" },
  { name: "Colorado", abbreviation: "CO", slug: "colorado", regulationLevel: "moderate" },
  { name: "Connecticut", abbreviation: "CT", slug: "connecticut", regulationLevel: "moderate" },
  { name: "Delaware", abbreviation: "DE", slug: "delaware", regulationLevel: "moderate" },
  { name: "Florida", abbreviation: "FL", slug: "florida", regulationLevel: "moderate" },
  { name: "Georgia", abbreviation: "GA", slug: "georgia", regulationLevel: "moderate" },
  { name: "Hawaii", abbreviation: "HI", slug: "hawaii", regulationLevel: "moderate" },
  { name: "Idaho", abbreviation: "ID", slug: "idaho", regulationLevel: "none" },
  { name: "Illinois", abbreviation: "IL", slug: "illinois", regulationLevel: "low" },
  { name: "Indiana", abbreviation: "IN", slug: "indiana", regulationLevel: "low" },
  { name: "Iowa", abbreviation: "IA", slug: "iowa", regulationLevel: "moderate" },
  { name: "Kansas", abbreviation: "KS", slug: "kansas", regulationLevel: "low" },
  { name: "Kentucky", abbreviation: "KY", slug: "kentucky", regulationLevel: "low" },
  { name: "Louisiana", abbreviation: "LA", slug: "louisiana", regulationLevel: "moderate" },
  { name: "Maine", abbreviation: "ME", slug: "maine", regulationLevel: "moderate" },
  { name: "Maryland", abbreviation: "MD", slug: "maryland", regulationLevel: "moderate" },
  { name: "Massachusetts", abbreviation: "MA", slug: "massachusetts", regulationLevel: "high" },
  { name: "Michigan", abbreviation: "MI", slug: "michigan", regulationLevel: "low" },
  { name: "Minnesota", abbreviation: "MN", slug: "minnesota", regulationLevel: "moderate" },
  { name: "Mississippi", abbreviation: "MS", slug: "mississippi", regulationLevel: "low" },
  { name: "Missouri", abbreviation: "MO", slug: "missouri", regulationLevel: "low" },
  { name: "Montana", abbreviation: "MT", slug: "montana", regulationLevel: "low" },
  { name: "Nebraska", abbreviation: "NE", slug: "nebraska", regulationLevel: "moderate" },
  { name: "Nevada", abbreviation: "NV", slug: "nevada", regulationLevel: "low" },
  { name: "New Hampshire", abbreviation: "NH", slug: "new-hampshire", regulationLevel: "moderate" },
  { name: "New Jersey", abbreviation: "NJ", slug: "new-jersey", regulationLevel: "low" },
  { name: "New Mexico", abbreviation: "NM", slug: "new-mexico", regulationLevel: "moderate" },
  { name: "New York", abbreviation: "NY", slug: "new-york", regulationLevel: "high" },
  { name: "North Carolina", abbreviation: "NC", slug: "north-carolina", regulationLevel: "moderate" },
  { name: "North Dakota", abbreviation: "ND", slug: "north-dakota", regulationLevel: "high" },
  { name: "Ohio", abbreviation: "OH", slug: "ohio", regulationLevel: "moderate" },
  { name: "Oklahoma", abbreviation: "OK", slug: "oklahoma", regulationLevel: "low" },
  { name: "Oregon", abbreviation: "OR", slug: "oregon", regulationLevel: "moderate" },
  { name: "Pennsylvania", abbreviation: "PA", slug: "pennsylvania", regulationLevel: "high" },
  { name: "Rhode Island", abbreviation: "RI", slug: "rhode-island", regulationLevel: "high" },
  { name: "South Carolina", abbreviation: "SC", slug: "south-carolina", regulationLevel: "moderate" },
  { name: "South Dakota", abbreviation: "SD", slug: "south-dakota", regulationLevel: "low" },
  { name: "Tennessee", abbreviation: "TN", slug: "tennessee", regulationLevel: "moderate" },
  { name: "Texas", abbreviation: "TX", slug: "texas", regulationLevel: "none" },
  { name: "Utah", abbreviation: "UT", slug: "utah", regulationLevel: "low" },
  { name: "Vermont", abbreviation: "VT", slug: "vermont", regulationLevel: "high" },
  { name: "Virginia", abbreviation: "VA", slug: "virginia", regulationLevel: "moderate" },
  { name: "Washington", abbreviation: "WA", slug: "washington", regulationLevel: "moderate" },
  { name: "West Virginia", abbreviation: "WV", slug: "west-virginia", regulationLevel: "moderate" },
  { name: "Wisconsin", abbreviation: "WI", slug: "wisconsin", regulationLevel: "low" },
  { name: "Wyoming", abbreviation: "WY", slug: "wyoming", regulationLevel: "low" },
];

export function getStateBySlug(slug: string): StateInfo | undefined {
  return states.find((s) => s.slug === slug);
}

export function getStateByAbbreviation(abbr: string): StateInfo | undefined {
  return states.find((s) => s.abbreviation === abbr.toUpperCase());
}

export const regulationColors = {
  none: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300", fill: "#86efac" },
  low: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", fill: "#bbf7d0" },
  moderate: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", fill: "#fef08a" },
  high: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", fill: "#fecaca" },
};

export const regulationLabels = {
  none: "No Regulation",
  low: "Low Regulation",
  moderate: "Moderate Regulation",
  high: "High Regulation",
};
