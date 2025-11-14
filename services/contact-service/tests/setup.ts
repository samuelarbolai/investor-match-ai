/**
 * Jest test setup file
 * Runs before all tests to configure the testing environment
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.FIREBASE_PROJECT_ID = 'test-project';

// Mock console methods to reduce noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  // Suppress console.log in tests unless explicitly needed
  console.log = jest.fn();
  // Keep console.error for debugging test failures
  console.error = originalConsoleError;
});

afterAll(() => {
  // Restore original console methods
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

// Global test timeout (30 seconds for integration tests)
jest.setTimeout(30000);
