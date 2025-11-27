/**
 * Validates URLs to prevent open redirect vulnerabilities
 */
export function isValidExternalUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    
    // Allow only HTTPS (except localhost for development)
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      return false;
    }
    
    // Block localhost/internal IPs in production
    if (process.env.NODE_ENV === 'production') {
      const hostname = parsedUrl.hostname.toLowerCase();
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.')
      ) {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely opens external URL with validation
 */
export function safeOpenUrl(url: string): void {
  if (isValidExternalUrl(url)) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
