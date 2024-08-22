module.exports = {
  clearMocks: true,
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testEnvironment: "node",
  // preset: 'ts-jest',
  setupFiles: ["dotenv/config"],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "@/(.*)": ["<rootDir>/src/$1"],
  },
};
