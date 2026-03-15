export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@api': '<rootDir>/src/utils/burger-api.ts',
    '^@utils-types': '<rootDir>/src/utils/types.ts',
    '^@ui': '<rootDir>/src/components/ui/index.ts',
    '^@ui-pages': '<rootDir>/src/components/ui/pages/index.ts',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy'
  }
};