import { test } from '@playwright/test';
import { executeVisualRegressionTest } from '../helpers/playwright-helper';

test.skip('should have no visual regression', async () => {
  await executeVisualRegressionTest('overview-notifications');
});
