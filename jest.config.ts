import type {Config} from 'jest'

const config: Config = {
  verbose: true,
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["<rootDir>/src/**/*.test.ts"]
}

export default config
