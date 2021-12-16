import {
  addImportantToEachRule,
  BreakpointCustomizable,
  buildGlobalStyles,
  buildHostStyles,
  buildSlottedStyles,
  getBaseSlottedStyles,
  getCss,
  getRequiredStyles,
  getStateMessageStyles,
  mergeDeep,
  pxToRemWithUnit,
} from '../../../utils';
import type { Styles } from '../../../utils';
import type { FormState, Theme } from '../../../types';
import { getBaseChildStyles, getLabelStyles, isVisibleState } from '../form-styles';

export const getComponentCss = (hideLabel: BreakpointCustomizable<boolean>, state: FormState): string => {
  const theme: Theme = 'light';
  const hasVisibleState = isVisibleState(state);

  return getCss({
    ...buildHostStyles({
      display: 'block',
    }),
    ...buildGlobalStyles(
      mergeDeep(
        addImportantToEachRule(
          mergeDeep(getBaseChildStyles('textarea', state, theme), {
            '::slotted(textarea)': {
              padding: pxToRemWithUnit(hasVisibleState ? 10 : 11),
              resize: 'vertical',
            },
          })
        ),
        {
          '::slotted(textarea)': {
            minHeight: pxToRemWithUnit(192), // min-height should be overridable
          },
        } as Styles
      )
    ),
    ...getLabelStyles('textarea', hideLabel, state, theme),
    ...getRequiredStyles(theme),
    ...getStateMessageStyles(theme, state),
  });
};

export const getSlottedCss = (host: HTMLElement): string => {
  return getCss(buildSlottedStyles(host, getBaseSlottedStyles()));
};
