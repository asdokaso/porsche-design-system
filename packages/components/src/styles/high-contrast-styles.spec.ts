import type { TagName } from '@porsche-design-system/shared';
import { TAG_NAMES } from '@porsche-design-system/shared';
import { getComponentMeta } from '@porsche-design-system/component-meta';
import {
  addParentAndSetRequiredProps,
  componentFactory,
  getComponentCssObject,
  getComponentCssSpy,
} from '../test-utils';
import * as a11yUtils from '../utils/a11y/a11y';
import { getHighContrastColors } from './colors';

const tagNamesWithJss = TAG_NAMES.filter((tagName) => {
  const meta = getComponentMeta(tagName);
  return !meta.isInternal && meta.styling === 'jss';
});

it.each<TagName>(tagNamesWithJss)('should have only high contrast styles for %s', (tagName) => {
  // mock to get the result from getComponentCss() directly
  const spy = getComponentCssSpy();

  const component = componentFactory(tagName);

  Object.defineProperty(a11yUtils, 'isHighContrastMode', { value: true });

  // some components like grid-item and text-list-item require a parent to apply styles
  // some components require a parent and certain props in order to work
  addParentAndSetRequiredProps(tagName, component);

  component.render();
  expect(spy).toBeCalledTimes(1);

  const highContrastColors = getHighContrastColors();
  const cssObject = getComponentCssObject(spy);
  const filteredCSS = [];

  const findKey = (obj, val) => {
    if (typeof obj === 'object') {
      for (const key in obj) {
        if (obj[key] === val) {
          return { [key]: val };
        } else {
          const result = findKey(obj[key], val);
          if (result !== null) return result;
        }
      }
    }
    return null;
  };

  Object.values(highContrastColors).forEach((value) => {
    const res = findKey(cssObject, value);
    if (res !== null) {
      filteredCSS.push(res);
    }
    return null;
  });

  filteredCSS.length && expect(filteredCSS).toMatchSnapshot();
});
