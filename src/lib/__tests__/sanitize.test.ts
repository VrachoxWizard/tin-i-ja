import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "@/lib/sanitize";

describe("sanitizeHtml", () => {
  it("passes through allowed tags unchanged", () => {
    const clean = "<h3>Naslov</h3><p>Opis <strong>tvrtke</strong>.</p>";
    const result = sanitizeHtml(clean);
    expect(result).toContain("<h3>Naslov</h3>");
    expect(result).toContain("<strong>tvrtke</strong>");
  });

  it("strips script tags", () => {
    const dirty = "<p>OK</p><script>alert('xss')</script>";
    const result = sanitizeHtml(dirty);
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("alert");
    expect(result).toContain("<p>OK</p>");
  });

  it("strips iframe tags", () => {
    const dirty = "<p>OK</p><iframe src='https://evil.com'></iframe>";
    const result = sanitizeHtml(dirty);
    expect(result).not.toContain("<iframe>");
  });

  it("strips event handler attributes", () => {
    const dirty = "<p onclick=\"alert('xss')\">Click me</p>";
    const result = sanitizeHtml(dirty);
    expect(result).not.toContain("onclick");
    expect(result).toContain("Click me");
  });

  it("strips all attributes from allowed tags", () => {
    const dirty = "<p class='text-sm' data-id='123'>Text</p>";
    const result = sanitizeHtml(dirty);
    expect(result).not.toContain("class=");
    expect(result).not.toContain("data-id=");
    expect(result).toContain("Text");
  });

  it("strips img tags (not in allowed list)", () => {
    const dirty = "<p>Text</p><img src='https://evil.com/track.png' />";
    const result = sanitizeHtml(dirty);
    expect(result).not.toContain("<img");
  });

  it("allows list structures", () => {
    const html = "<ul><li>Item 1</li><li>Item 2</li></ul>";
    const result = sanitizeHtml(html);
    expect(result).toBe("<ul><li>Item 1</li><li>Item 2</li></ul>");
  });

  it("handles empty string without throwing", () => {
    expect(() => sanitizeHtml("")).not.toThrow();
    expect(sanitizeHtml("")).toBe("");
  });
});
