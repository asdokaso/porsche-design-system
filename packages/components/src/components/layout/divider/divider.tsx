import { Component, h, JSX, Prop } from '@stencil/core';
import { isDark, mapBreakpointPropToPrefixedClasses, prefix } from '../../../utils';
import type { BreakpointCustomizable, Theme } from '../../../types';

@Component({
  tag: 'p-divider',
  styleUrl: 'divider.scss',
  shadow: true,
})
export class Divider {
  /** Defines color depending on theme. */
  @Prop() public color?: 'neutral-contrast-high' | 'neutral-contrast-medium' | 'neutral-contrast-low' =
    'neutral-contrast-low';

  /** Defines orientation. */
  @Prop() public orientation?: BreakpointCustomizable<'vertical' | 'horizontal'> = 'horizontal';

  /** Adapts color depending on theme. */
  @Prop() public theme?: Theme = 'light';

  public render(): JSX.Element {
    const dividerClasses = {
      [prefix('divider')]: true,
      [prefix(`divider--color-${this.color}`)]: true,
      [prefix('divider--theme-dark')]: isDark(this.theme),
      ...mapBreakpointPropToPrefixedClasses('divider--orientation', this.orientation),
    };

    return <hr class={dividerClasses} />;
  }
}
