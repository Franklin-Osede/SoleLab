module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@domains/(.*)$': '<rootDir>/src/domains/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        types: ['jest', 'node'],
      },
    }],
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/unit/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@domains/(.*)$': '<rootDir>/src/domains/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
        '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
        '^@application/(.*)$': '<rootDir>/src/application/$1',
        '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
        '^@tests/(.*)$': '<rootDir>/tests/$1',
      },
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          tsconfig: {
            types: ['jest', 'node'],
          },
        }],
      },
    },
    {
      displayName: 'integration',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
      setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@domains/(.*)$': '<rootDir>/src/domains/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
        '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
        '^@application/(.*)$': '<rootDir>/src/application/$1',
        '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
        '^@tests/(.*)$': '<rootDir>/tests/$1',
      },
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          tsconfig: {
            types: ['jest', 'node'],
          },
        }],
      },
      testTimeout: 30000,
    },
  ],
};


