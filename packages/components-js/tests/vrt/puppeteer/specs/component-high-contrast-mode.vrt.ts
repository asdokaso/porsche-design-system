import type { Page } from 'puppeteer';
import {
  getVisualRegressionStatesTester,
  openPopoversAndHighlightSpacer,
  vrtTest,
} from '@porsche-design-system/shared/testing';
import type { Component } from '../helpers';
import { Theme } from '@porsche-design-system/utilities';

const components: Component[] = [
  'accordion',
  'banner',
  'button',
  'button-group',
  'button-pure',
  'button-tile',
  'carousel',
  'checkbox-wrapper',
  'content-wrapper',
  'crest',
  'display',
  'divider',
  'fieldset',
  'fieldset-wrapper',
  'flex',
  'grid',
  'heading',
  'headline',
  'icon',
  'inline-notification',
  'link',
  'link-pure',
  'link-social',
  'link-tile',
  'link-tile-model-signature',
  'marque',
  'modal',
  'model-signature',
  'pagination',
  'popover',
  'radio-button-wrapper',
  'scroller',
  'segmented-control',
  'select-wrapper',
  'spinner',
  'stepper-horizontal',
  'switch',
  'table',
  'tabs',
  'tabs-bar',
  'tag',
  'tag-dismissible',
  'text',
  'text-field-wrapper',
  'text-list',
  'textarea-wrapper',
  'toast-basic',
  'wordmark',
];

const scenarioPopover = async (page: Page) => {
  await openPopoversAndHighlightSpacer(page);
};

const scenarioModalOrBanner = async (page: Page) => {
  await page.mouse.click(0, 0); // click top left corner of the page to remove focus on modal
};

const scenarioSelectWrapper = async (page: Page) => {
  await page.click('#open-options');
};

const highContrastTest = async (component: Component, theme: Theme) => {
  await vrtTest(
    getVisualRegressionStatesTester(),
    `${component === 'fieldset-wrapper' ? 'fieldset' : `${component}`}-high-contrast-${theme}`,
    `/#${component}`,
    {
      ...(component === 'popover' && { scenario: scenarioPopover }),
      ...(component === 'select-wrapper' && { scenario: scenarioSelectWrapper }),
      ...(['modal', 'banner'].includes(component) && { scenario: scenarioModalOrBanner }),
      forcedColorsEnabled: true,
      prefersColorScheme: theme,
    }
  );
};

it.each(components)('should have no visual regression for component in high-contrast light: %s', async (component) => {
  expect(await highContrastTest(component, 'light')).toBeFalsy();
});

it.each(components)('should have no visual regression for component in high-contrast dark: %s', async (component) => {
  expect(await highContrastTest(component, 'dark')).toBeFalsy();
});
