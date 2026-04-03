/**
 * Shared file upload validation for deal room uploads.
 * Used by both seller and broker server actions to avoid code duplication.
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_PREFIXES = [
    "application/pdf",
    "image/",
    "application/vnd.openxmlformats-officedocument.",
    "application/vnd.ms-excel",
    "application/vnd.ms-word",
    "text/csv",
];

const VALID_DOC_TYPES = ["financial", "legal", "asset"] as const;
export type DocType = (typeof VALID_DOC_TYPES)[number];

type ValidateSuccess = { ok: true; file: File; docType: DocType };
type ValidateFailure = { ok: false; error: string };
export type ValidateUploadResult = ValidateSuccess | ValidateFailure;

/**
 * Validates the file and doc_type from a FormData payload for deal room uploads.
 * Returns a typed union result — check `result.ok` before consuming the payload.
 */
export function validateDealRoomUpload(formData: FormData): ValidateUploadResult {
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

    const mimeOk = ALLOWED_MIME_PREFIXES.some((prefix) =>
        file.type.startsWith(prefix),
    );
    if (!mimeOk) {
        return {
            ok: false,
            error: "Dozvoljeni formati: PDF, slike, Excel, Word i CSV datoteke.",
        };
    }

    return { ok: true, file, docType: docType as DocType };
}

/** Sanitize a filename for use in storage paths. */
export function sanitizeFileName(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}
