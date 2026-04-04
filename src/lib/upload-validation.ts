/**
 * Shared file upload validation for deal room uploads.
 * Used by both seller and broker server actions to avoid code duplication.
 *
 * Security: validates actual file magic bytes, NOT just the client-reported MIME type.
 * A .php file renamed to .pdf must be rejected.
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILENAME_LENGTH = 200;

const VALID_DOC_TYPES = ["financial", "legal", "asset"] as const;
export type DocType = (typeof VALID_DOC_TYPES)[number];

type ValidateSuccess = { ok: true; file: File; docType: DocType };
type ValidateFailure = { ok: false; error: string };
export type ValidateUploadResult = ValidateSuccess | ValidateFailure;

/**
 * Known file signatures (magic bytes) mapped to their MIME prefix.
 * We read the first 8 bytes of the file and check against this list.
 */
const MAGIC_BYTES: Array<{ bytes: number[]; mime: string }> = [
  // PDF
  { bytes: [0x25, 0x50, 0x44, 0x46], mime: "application/pdf" }, // %PDF
  // PNG
  { bytes: [0x89, 0x50, 0x4e, 0x47], mime: "image/png" },
  // JPEG
  { bytes: [0xff, 0xd8, 0xff], mime: "image/jpeg" },
  // GIF
  { bytes: [0x47, 0x49, 0x46, 0x38], mime: "image/gif" },
  // WebP (RIFF....WEBP)
  { bytes: [0x52, 0x49, 0x46, 0x46], mime: "image/webp" },
  // XLSX / DOCX (both are ZIP-based Office Open XML): PK magic
  { bytes: [0x50, 0x4b, 0x03, 0x04], mime: "application/zip" },
  // XLS (legacy BIFF): Compound Document
  { bytes: [0xd0, 0xcf, 0x11, 0xe0], mime: "application/vnd.ms" },
  // CSV (plain text UTF-8)
  { bytes: [0xef, 0xbb, 0xbf], mime: "text/" }, // UTF-8 BOM
];

/** Check that the file's actual binary content matches an expected file type. */
async function validateMagicBytes(file: File): Promise<boolean> {
  try {
    const slice = file.slice(0, 8);
    const buffer = await slice.arrayBuffer();
    const bytes = Array.from(new Uint8Array(buffer));

    const matchesMagic = MAGIC_BYTES.some(({ bytes: magic }) =>
      magic.every((b, i) => bytes[i] === b),
    );

    // For CSV/text files without a BOM, allow if MIME is text/csv and content is printable ASCII
    if (!matchesMagic && file.type === "text/csv") {
      return bytes.every((b) => (b >= 0x20 && b <= 0x7e) || b === 0x09 || b === 0x0a || b === 0x0d);
    }

    return matchesMagic;
  } catch {
    // If we can't read the file, reject it
    return false;
  }
}

/**
 * Validates the file and doc_type from a FormData payload for deal room uploads.
 * Returns a typed union result — check `result.ok` before consuming the payload.
 */
export async function validateDealRoomUpload(formData: FormData): Promise<ValidateUploadResult> {
  const docType = formData.get("doc_type");
  const file = formData.get("file");

  if (
    typeof docType !== "string" ||
    !(VALID_DOC_TYPES as readonly string[]).includes(docType) ||
    !(file instanceof File) ||
    file.size === 0
  ) {
    return { ok: false, error: "Odaberite valjanu vrstu dokumenta i datoteku." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, error: "Datoteka ne smije biti veća od 10 MB." };
  }

  if (file.name.length > MAX_FILENAME_LENGTH) {
    return { ok: false, error: "Naziv datoteke je predugačak (max 200 znakova)." };
  }

  // Magic-byte validation: reject files whose binary content doesn't match a known safe format
  const isValidFile = await validateMagicBytes(file);
  if (!isValidFile) {
    return {
      ok: false,
      error: "Dozvoljeni formati: PDF, slike (PNG/JPEG/WebP), Excel, Word i CSV datoteke.",
    };
  }

  return { ok: true, file, docType: docType as DocType };
}

/** Sanitize a filename for use in storage paths. Max 100 chars after sanitization. */
export function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(0, 100);
}
