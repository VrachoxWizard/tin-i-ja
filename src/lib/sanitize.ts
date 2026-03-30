import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML output from AI models before rendering with dangerouslySetInnerHTML.
 * Allows only safe formatting tags.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "ul", "ol", "li",
      "strong", "em", "b", "i", "u",
      "span", "div",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    ALLOWED_ATTR: ["class"],
  });
}
