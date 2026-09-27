/**
 * Utility to sanitize question explanation HTML.
 * Strips external iframes (azvocab.ai, canva.com, cth.edu.vn, etc.)
 * to guarantee 100% offline self-containment and eliminate external requests.
 */
export function sanitizeExplanationHtml(html: string | null | undefined): string {
  if (!html) return '';
  // 1. Strip wrapper div if it exclusively or primarily contains an external iframe (e.g. azvocab.ai flashcard iframe)
  let cleaned = html.replace(
    /<div[^>]*style=["'][^"']*(?:max-width:\s*\d+px)?[^"']*["'][^>]*>\s*<iframe\b[^>]*\bsrc=["'][^"']*(?:azvocab\.ai|canva\.com|cth\.edu\.vn)[^"']*["'][^>]*>[\s\S]*?<\/iframe>\s*<\/div>/gi,
    ''
  );
  // 2. Strip any standalone external iframe from azvocab.ai, canva.com, cth.edu.vn
  cleaned = cleaned.replace(
    /<iframe\b[^>]*\bsrc=["'][^"']*(?:azvocab\.ai|canva\.com|cth\.edu\.vn)[^"']*["'][^>]*>[\s\S]*?<\/iframe>/gi,
    ''
  );
  // 3. Strip any remaining external iframe with http/https src
  cleaned = cleaned.replace(
    /<iframe\b[^>]*\bsrc=["']https?:\/\/[^"']+["'][^>]*>[\s\S]*?<\/iframe>/gi,
    ''
  );
  return cleaned.trim();
}
