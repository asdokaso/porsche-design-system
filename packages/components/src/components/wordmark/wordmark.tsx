import type { PropTypes, SelectedAriaAttributes, Theme } from '../../types';
import type { WordmarkSize, WordmarkTarget, WordmarkAriaAttribute } from './wordmark-utils';
import { Component, Element, h, Host, JSX, Prop } from '@stencil/core';
import { AllowedTypes, attachComponentCss, parseAndGetAriaAttributes, THEMES } from '../../utils';
import { getWordmarkSvgUrl, WORDMARK_ARIA_ATTRIBUTES, WORDMARK_SIZES } from './wordmark-utils';
import { validateProps } from '../../utils/validation/validateProps';
import { getComponentCss } from './wordmark-styles';

const propTypes: PropTypes<typeof Wordmark> = {
  trademark: AllowedTypes.boolean,
  size: AllowedTypes.oneOf<WordmarkSize>(WORDMARK_SIZES),
  theme: AllowedTypes.oneOf<Theme>(THEMES),
  href: AllowedTypes.string,
  target: AllowedTypes.string,
  aria: AllowedTypes.aria<WordmarkAriaAttribute>(WORDMARK_ARIA_ATTRIBUTES),
};

@Component({
  tag: 'p-wordmark',
  shadow: { delegatesFocus: true },
})
export class Wordmark {
  @Element() public host!: HTMLElement;

  // TODO: discuss if trademark is needed within this component
  /** Show/hide trademark sign. */
  @Prop() public trademark?: boolean = true;

  // TODO: do we name the default size responsive or fluid?
  /** Adapts sizing of wordmark. */
  @Prop() public size?: WordmarkSize = 'responsive';

  /** Adapts color depending on theme. */
  @Prop() public theme?: Theme = 'light';

  /** When providing an url then the component will be rendered as `<a>`. */
  @Prop() public href?: string;

  /** Target attribute where the link should be opened. */
  @Prop() public target?: WordmarkTarget = '_self';

  /** Add ARIA attributes. */
  @Prop() aria?: SelectedAriaAttributes<WordmarkAriaAttribute>;

  public render(): JSX.Element {
    validateProps(this, propTypes);
    attachComponentCss(this.host, getComponentCss, this.size, this.theme);

    const picture = <img src={getWordmarkSvgUrl()} height={36} alt="Porsche" />;
    return (
      <Host>
        {this.href === undefined ? (
          picture
        ) : (
          <a href={this.href} target={this.target} {...parseAndGetAriaAttributes(this.aria)}>
            {picture}
          </a>
        )}
      </Host>
    );
  }
}
