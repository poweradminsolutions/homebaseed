import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Homeschool Co-ops, Tutors & Groups Near You',
  description: 'Search our directory of homeschool co-ops, tutors, support groups, enrichment programs, and sports leagues across all 50 states.',
};

export default function FindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
