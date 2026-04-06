import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML output from AI models before rendering with dangerouslySetInnerHTML.
 * Allows only safe formatting tags with NO attributes.
 * AI-generated formatting HTML has no legitimate need for class, style, or data attributes.
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
    // Strip ALL attributes — no class, style, data-*, href, or src on AI output
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
    // Extra defense: forbid any attribute that contains javascript:
    FORBID_ATTR: ["style", "class", "id", "onclick", "onerror", "onload"],
  });
}

