/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    "^@/config/(.*)$": "<rootDir>/src/config/$1",
    "^@/decorators/(.*)$": "<rootDir>/src/decorators/$1",
    "^@/entities/(.*)$": "<rootDir>/src/entities/$1",
    "^@/helpers/(.*)$": "<rootDir>/src/helpers/$1",
    "^@/middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
    "^@/resolvers/(.*)$": "<rootDir>/src/resolvers/$1",
    "^@/tests/(.*)$": "<rootDir>/tests/$1",
    "^@/types/(.*)$": "<rootDir>/src/types/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
