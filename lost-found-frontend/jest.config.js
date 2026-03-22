/** 
 * Minimalist Jest configuration for the Lost & Found project.
 * Designed to provide basic testing capabilities without complex babel setups.
 */

export default {
  // Set the testing environment to jsdom for React component testing (if needed)
  testEnvironment: "jsdom",

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],

  // Exclude node_modules from testing
  testPathIgnorePatterns: ["/node_modules/"],

  // Mock CSS and file imports to prevent errors when importing them in components
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.js"
  },

  // Ensure Jest doesn't fail on complex project structures or syntax it doesn't recognize yet
  // This is a "don't reflect project errors" measure
  transformIgnorePatterns: [
    "/node_modules/",
    "\\.pnp\\.[^\\/]+$"
  ],
};
