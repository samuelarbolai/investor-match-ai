import { normalizeDocumentId, isValidDocumentId, ensureValidDocumentId } from './document-id';

describe('Document ID Normalization', () => {
  describe('normalizeDocumentId', () => {
    test('converts to lowercase', () => {
      expect(normalizeDocumentId('Software Engineering')).toBe('software_engineering');
    });

    test('replaces spaces with underscores', () => {
      expect(normalizeDocumentId('Series A')).toBe('series_a');
    });

    test('handles special characters', () => {
      expect(normalizeDocumentId('Healthcare & IT')).toBe('healthcare_it');
    });

    test('removes leading/trailing underscores', () => {
      expect(normalizeDocumentId('  test  ')).toBe('test');
    });

    test('collapses multiple underscores', () => {
      expect(normalizeDocumentId('test___value')).toBe('test_value');
    });

    test('handles numbers', () => {
      expect(normalizeDocumentId('Series A 2024')).toBe('series_a_2024');
    });
  });

  describe('isValidDocumentId', () => {
    test('accepts valid IDs', () => {
      expect(isValidDocumentId('software_engineering')).toBe(true);
      expect(isValidDocumentId('series_a')).toBe(true);
      expect(isValidDocumentId('test123')).toBe(true);
    });

    test('rejects invalid IDs', () => {
      expect(isValidDocumentId('')).toBe(false);
      expect(isValidDocumentId('Test')).toBe(false); // uppercase
      expect(isValidDocumentId('test-value')).toBe(false); // hyphen
      expect(isValidDocumentId('test value')).toBe(false); // space
    });
  });

  describe('ensureValidDocumentId', () => {
    test('returns normalized valid ID', () => {
      expect(ensureValidDocumentId('Software Engineering')).toBe('software_engineering');
    });

    test('throws error for invalid input', () => {
      expect(() => ensureValidDocumentId('   ')).toThrow();
      expect(() => ensureValidDocumentId('')).toThrow();
    });
  });
});
