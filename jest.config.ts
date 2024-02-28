import type { Config } from 'jest'

import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  clearMocks: true,
  testEnvironment: 'jsdom'
};

export default createJestConfig(config);
