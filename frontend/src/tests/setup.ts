import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

expect.extend(matchers);
