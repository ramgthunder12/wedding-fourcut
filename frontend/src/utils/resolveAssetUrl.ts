export function resolveAssetUrl(rawUrl: string): string {
  if (!rawUrl) return rawUrl;

  try {
    const parsed = new URL(rawUrl, window.location.origin);

    // Uploaded assets should be loaded via same-origin proxy to avoid mixed-content and CORS issues.
    if (parsed.pathname.startsWith("/uploads/")) {
      return `${parsed.pathname}${parsed.search}`;
    }

    return parsed.toString();
  } catch {
    return rawUrl;
  }
}
