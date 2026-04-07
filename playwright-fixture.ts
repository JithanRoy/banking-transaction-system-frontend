import { test as base } from '@playwright/test';

type TestFixtures = {
  // Add custom fixtures here if needed
};

export const test = base.extend<TestFixtures>({});
export const expect = test.expect;
