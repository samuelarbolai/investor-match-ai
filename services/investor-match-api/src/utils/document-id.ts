/**
 * Document ID normalization utilities
 * Ensures all document IDs are URL-safe strings (canonical slugs)
 */

/**
 * Normalize a string to a URL-safe document ID
 * Converts to lowercase, replaces spaces/special chars with underscores
 * 
 * @param input - Raw string to normalize
 * @returns URL-safe document ID
 * 
 * @example
 * normalizeDocumentId('Software Engineering') // 'software_engineering'
 * normalizeDocumentId('Series A') // 'series_a'
 * normalizeDocumentId('Healthcare IT') // 'healthcare_it'
 */
export function normalizeDocumentId(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')  // Replace non-alphanumeric with underscore
    .replace(/^_+|_+$/g, '')      // Remove leading/trailing underscores
    .replace(/_+/g, '_');         // Collapse multiple underscores
}

/**
 * Validate that a document ID is URL-safe
 * 
 * @param id - Document ID to validate
 * @returns true if valid, false otherwise
 */
export function isValidDocumentId(id: string): boolean {
  // Must be non-empty, lowercase, alphanumeric + underscores only
  return /^[a-z0-9_]+$/.test(id) && id.length > 0;
}

/**
 * Ensure a document ID is normalized and valid
 * Throws error if normalization results in invalid ID
 * 
 * @param input - Raw string to normalize
 * @returns Validated document ID
 * @throws Error if input cannot be normalized to valid ID
 */
export function ensureValidDocumentId(input: string): string {
  const normalized = normalizeDocumentId(input);
  
  if (!isValidDocumentId(normalized)) {
    throw new Error(`Cannot create valid document ID from input: "${input}"`);
  }
  
  return normalized;
}
