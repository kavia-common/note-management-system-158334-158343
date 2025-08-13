 // PUBLIC_INTERFACE
export function formatRelativeDate(isoString) {
  /** Format an ISO date string into a human-friendly relative string (e.g., "2 hours ago"). */
  if (!isoString) return 'just now';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diff = Math.max(0, now.getTime() - date.getTime());

    const seconds = Math.floor(diff / 1000);
    if (seconds < 45) return 'just now';
    if (seconds < 90) return 'a minute ago';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 45) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    if (minutes < 90) return 'an hour ago';

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    if (hours < 36) return 'a day ago';

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;

    const months = Math.floor(days / 30);
    if (months < 18) return `${months} month${months === 1 ? '' : 's'} ago`;

    const years = Math.floor(months / 12);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  } catch {
    return 'just now';
  }
}
