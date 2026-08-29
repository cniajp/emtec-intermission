const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.env.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // 今回テストが張ってあるスコープに絞る (PageContext は Provider + startTimeSync 副作用、
  // logic/data 配下は RTK Query 依存で unit test 対象外)
  collectCoverageFrom: [
    'src/logic/models/**/*.{ts,tsx}',
    'src/logic/page-view-models/**/*.{ts,tsx}',
    'src/logic/page-flow/usePageTelemetry.ts',
    'src/logic/page-flow/usePageTransition.ts',
    'src/staticConfig/shared.ts',
    '!src/logic/**/__tests__/**',
    '!src/logic/**/__fixtures__/**',
    '!src/logic/**/__mocks__/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
