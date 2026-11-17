import { test as base, expect } from '@playwright/test';

export const test = base.extend<{ browserHealth: void }>({
  browserHealth: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on('pageerror', (error) => problems.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') problems.push(message.text());
      });
      page.on('requestfailed', (request) => {
        if (request.failure()?.errorText !== 'net::ERR_ABORTED')
          problems.push(`${request.url()}: ${request.failure()?.errorText}`);
      });
      page.on('response', (response) => {
        if (response.status() >= 400) problems.push(`${response.status()}: ${response.url()}`);
      });
      await use();
      expect(problems, 'Browser errors and failed resources').toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };
