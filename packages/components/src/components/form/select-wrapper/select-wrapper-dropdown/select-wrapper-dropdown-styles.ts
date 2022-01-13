import type { DropdownDirectionInternal } from '../select-wrapper/select-wrapper-utils';
import {
  getCss,
  getInset,
  getTextHiddenJssStyle,
  getThemedColors,
  getThemedFormStateColors,
  getTransition,
  isDark,
  JssStyle,
  mergeDeep,
  pxToRemWithUnit,
  Styles,
} from '../../../../utils';
import type { FormState, Theme } from '../../../../types';
import { color, defaultFontFamilyAndWeight, fontFamily, fontSize, fontWeight } from '@porsche-design-system/utilities';
import { OPTION_HEIGHT } from '../select-wrapper/select-wrapper-styles';
import { INPUT_HEIGHT } from '../../../../styles/form-styles';

const dropdownPositionVar = '--p-dropdown-position';

export const getButtonStyles = (isOpen: boolean, state: FormState, theme: Theme): Styles => {
  const { contrastHighColor, contrastMediumColor } = getThemedColors(theme);
  const { stateColor } = getThemedFormStateColors(theme, state);

  return {
    '@global': {
      button: {
        position: 'absolute',
        top: 0,
        height: INPUT_HEIGHT,
        width: '100%',
        padding: 0,
        background: 'transparent',
        border: `${stateColor ? 2 : 1}px solid currentColor`,
        outline: '1px solid transparent',
        outlineOffset: 2,
        cursor: 'pointer',
        color: 'currentColor',
        transition: getTransition('color'),
        ...(isOpen && {
          outlineColor: stateColor || contrastMediumColor,
        }),
        '&:focus': {
          outlineColor: stateColor || contrastMediumColor,
        },
        '&:hover:not(:disabled) ~ ul': {
          borderColor: contrastHighColor,
        },
        '&:disabled': {
          cursor: 'not-allowed',
        },
      },
    },
  };
};

export const getFilterStyles = (isOpen: boolean, disabled: boolean, state: FormState, theme: Theme): Styles => {
  const { baseColor, backgroundColor, contrastHighColor, contrastMediumColor, disabledColor } = getThemedColors(theme);
  const { stateColor } = getThemedFormStateColors(theme, state);

  const placeHolderStyles: JssStyle = {
    opacity: 1,
    color: disabled ? disabledColor : baseColor,
  };

  return {
    '@global': {
      input: {
        display: 'block',
        position: 'absolute',
        zIndex: 1,
        bottom: pxToRemWithUnit(2), // input is inset to not overlap with 1px or 2px border of state
        left: pxToRemWithUnit(2),
        width: `calc(100% - ${pxToRemWithUnit(INPUT_HEIGHT - 4)})`,
        height: pxToRemWithUnit(INPUT_HEIGHT - 4),
        padding: pxToRemWithUnit(10),
        outline: 'none',
        appearance: 'none',
        boxSizing: 'border-box',
        border: 'none',
        opacity: 0,
        ...defaultFontFamilyAndWeight,
        ...fontSize.small,
        textIndent: 0,
        cursor: disabled ? 'not-allowed' : 'text',
        color: baseColor,
        background: backgroundColor,
        '&::placeholder': placeHolderStyles,
        '&::-webkit-input-placeholder': placeHolderStyles,
        '&::-moz-placeholder': placeHolderStyles,
        '&:focus': {
          opacity: disabled ? 0 : 1, // to display value while typing
          '&+span': {
            outlineColor: stateColor || contrastMediumColor,
          },
        },
        '&:hover:not(:disabled) ~ ul': {
          borderColor: contrastHighColor,
        },
        '&+span': {
          // for focus outline and click event on arrow
          position: 'absolute',
          ...getInset(),
          outline: '1px solid transparent',
          outlineOffset: 2,
          transition: getTransition('color'),
          pointerEvents: 'all',
          cursor: disabled ? 'not-allowed' : 'pointer',
          border: `${stateColor ? 2 : 1}px solid currentColor`,
          ...(isOpen && {
            outlineColor: stateColor || contrastMediumColor,
          }),
        },
      },
    },
  };
};

export const getListStyles = (direction: DropdownDirectionInternal, isOpen: boolean, theme: Theme): Styles => {
  const isDirectionDown = direction === 'down';
  const isDarkTheme = isDark(theme);
  const {
    baseColor,
    backgroundColor,
    contrastHighColor,
    contrastMediumColor,
    contrastLowColor,
    hoverColor,
    activeColor,
    disabledColor,
  } = getThemedColors(theme);

  const highlightedSelectedColor = isDarkTheme ? color.default : color.background.surface; // TODO: strange that surfaceColor isn't used for dark theme

  const baseDirectionPseudoStyle: JssStyle = {
    content: '""',
    display: 'block',
    position: 'sticky',
    width: '100%',
    height: '1px',
    background: contrastLowColor,
  };

  return {
    '@global': {
      ul: {
        display: 'block',
        position: `var(${dropdownPositionVar})`, // for vrt tests
        padding: 0,
        margin: 0,
        marginTop: pxToRemWithUnit(-1),
        color: baseColor,
        background: backgroundColor,
        fontFamily,
        ...fontSize.small,
        zIndex: 10,
        left: 0,
        right: 0,
        maxHeight: pxToRemWithUnit(308),
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        border: `1px solid ${contrastMediumColor}`,
        scrollbarWidth: 'thin', // firefox
        scrollbarColor: 'auto', // firefox
        transition: getTransition('border-color'),
        transform: 'translate3d(0,0,0)', // fix iOS bug if less than 5 items are displayed
        outline: 'none',
        '&:hover': {
          borderColor: contrastHighColor,
        },
        ...(isDirectionDown
          ? {
              top: 'calc(100%-1px)',
              borderTop: 'none',
              boxShadow: '0 2px 4px 0 rgba(0,0,0,.05), 0 12px 25px 0 rgba(0,0,0,.1)',
              '&::before': {
                ...baseDirectionPseudoStyle,
                top: 0,
              },
            }
          : {
              bottom: pxToRemWithUnit(INPUT_HEIGHT - 1),
              borderBottom: 'none',
              boxShadow: '0 -2px 4px 0 rgba(0,0,0,.05), 0 -12px 25px 0 rgba(0,0,0,.075)',
              '&::after': {
                ...baseDirectionPseudoStyle,
                bottom: 0,
              },
            }),
        ...(!isOpen && {
          top: 'calc(100%-3px)',
          opacity: 0,
          overflow: 'hidden',
          height: 1,
          pointerEvents: 'none',
        }),
      },
    },
    option: {
      display: 'flex',
      padding: `${pxToRemWithUnit(4)} ${pxToRemWithUnit(11)}`,
      minHeight: pxToRemWithUnit(OPTION_HEIGHT),
      cursor: 'pointer',
      textAlign: 'left',
      wordBreak: 'break-word',
      boxSizing: 'border-box',
      transition: getTransition('color') + ',' + getTransition('background-color'),
      '&[role="status"]': {
        cursor: 'not-allowed',
      },
      '&__sr': getTextHiddenJssStyle(true),
      '&:not([aria-disabled]):not([role="status"]):hover': {
        color: hoverColor,
        background: highlightedSelectedColor,
      },
      '&--highlighted, &--selected': {
        color: activeColor,
        background: highlightedSelectedColor,
      },
      '&--selected': {
        cursor: 'default',
        pointerEvents: 'none',
      },
      '&--disabled': {
        cursor: 'not-allowed',
        color: disabledColor,
      },
      '&--hidden': {
        display: 'none',
      },
    },
    icon: {
      marginLeft: pxToRemWithUnit(4),
    },
    optgroup: {
      display: 'block',
      padding: `${pxToRemWithUnit(8)} ${pxToRemWithUnit(12)}`,
      marginTop: pxToRemWithUnit(8),
      fontWeight: fontWeight.bold,
      '&~$option': {
        paddingLeft: pxToRemWithUnit(24),
      },
    },
    'sr-text': {
      display: 'none',
    },
  };
};

export const getComponentCss = (
  direction: DropdownDirectionInternal,
  isOpen: boolean,
  disabled: boolean,
  state: FormState,
  filter: boolean,
  theme: Theme
): string => {
  const { baseColor, contrastHighColor, contrastMediumColor, disabledColor } = getThemedColors(theme);
  const { stateColor, stateHoverColor } = getThemedFormStateColors(theme, state);

  return getCss({
    ':host': {
      [dropdownPositionVar]: 'absolute', // TODO: make conditional only for tests
      display: 'block',
      position: `var(${dropdownPositionVar})`, // for vrt tests
      marginTop: pxToRemWithUnit(-INPUT_HEIGHT),
      paddingTop: pxToRemWithUnit(INPUT_HEIGHT),
      left: 0,
      right: 0,
      color: disabled ? disabledColor : stateColor || contrastMediumColor,
      ...(!disabled && {
        '&(:hover)': {
          color: stateHoverColor || (isDark(theme) ? contrastHighColor : baseColor),
        },
      }),
    },
    ...mergeDeep(
      // merge because of global styles
      filter ? getFilterStyles(isOpen, disabled, state, theme) : getButtonStyles(isOpen, state, theme),
      getListStyles(direction, isOpen, theme)
    ),
  });
};
