export function formatDate(date: Date): string {
  if (!date) return 'Unknown';

  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  } catch {
    return 'Unknown';
  }
}