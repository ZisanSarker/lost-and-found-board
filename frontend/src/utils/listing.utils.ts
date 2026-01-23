import { Listing, ListingFilter } from '@/types/listing';

export function filterListings(
  listings: Listing[],
  filter: ListingFilter,
  searchQuery: string
): Listing[] {
  let filtered = [...listings];

  if (filter === 'resolved') {
    filtered = filtered.filter(l => l.status === 'resolved');
  } else {
    filtered = filtered.filter(l => l.type === filter && l.status !== 'resolved');
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(l =>
      l.title.toLowerCase().includes(query) ||
      l.description.toLowerCase().includes(query) ||
      l.location.toLowerCase().includes(query) ||
      l.category.toLowerCase().includes(query)
    );
  }

  return filtered;
}

export function sortListingsByDate(listings: Listing[], ascending = false): Listing[] {
  return [...listings].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

export function getListingTypeLabel(type: string): string {
  return type === 'lost' ? 'Lost' : 'Found';
}
