const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomChunk(length: number) {
  const array = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(array, (value) => ALPHABET[value % ALPHABET.length]).join(
    "",
  );
}

export function createPublicCode(prefix = "DF") {
  return `${prefix}-${randomChunk(3)}${randomChunk(3)}`;
}

export function isPublicCode(value: string) {
  return /^DF-[A-Z2-9]{6}$/.test(value);
}
