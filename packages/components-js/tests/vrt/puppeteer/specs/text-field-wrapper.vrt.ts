import {
  forceFocusHoverState,
  forceFocusState,
  forceHoverState,
  getThemedBodyMarkup,
  GetThemedMarkup,
  setContentWithDesignSystem,
} from '../helpers';
import {
  defaultViewports,
  getVisualRegressionStatesTester,
  getVisualRegressionTester,
  vrtTest,
} from '@porsche-design-system/shared/testing';

it.each(defaultViewports)('should have no visual regression for viewport %s', async (viewport) => {
  expect(await vrtTest(getVisualRegressionTester(viewport), 'text-field-wrapper', '/#text-field-wrapper')).toBeFalsy();
});

it('should have no visual regression for :hover + :focus-visible', async () => {
  const vrt = getVisualRegressionStatesTester();
  expect(
    await vrt.test('text-field-wrapper-states', async () => {
      const page = vrt.getPage();

      const head = `
        <style>
          body { display: grid; grid-template-columns: repeat(2, 50%); }
          .playground div, .playground form { display: flex; }
          .playground div > *, .playground form > * { width: 40%; }
          p-text-field-wrapper:not(:last-child) {
            margin-right: 1rem;
            margin-bottom: 1rem;
          }
        </style>`;

      const child = '<input type="text" value="Value" />';
      const childReadonly = child.replace(/((?: \/)?>)/, ' readonly$1');
      const childDisabled = child.replace(/((?: \/)?>)/, ' disabled$1');

      const getElementsMarkup: GetThemedMarkup = (theme) => `
        <div>
          <p-text-field-wrapper label="Text empty" theme="${theme}">
            <input type="text" />
          </p-text-field-wrapper>
          <p-text-field-wrapper label="Password empty" theme="${theme}">
            <input type="password" />
          </p-text-field-wrapper>
          <p-text-field-wrapper label="Search empty" theme="${theme}">
            <input type="search" />
          </p-text-field-wrapper>
        </div>
        <form>
          <p-text-field-wrapper label="Text in form" theme="${theme}">
            ${child}
          </p-text-field-wrapper>
          <p-text-field-wrapper label="Password in form" theme="${theme}">
            <input type="password" value="Value" />
          </p-text-field-wrapper>
          <p-text-field-wrapper label="Search in form" theme="${theme}">
            <input type="search" value="Value" />
          </p-text-field-wrapper>
        </form>
        <div>
          <p-text-field-wrapper label="Default" theme="${theme}">
            ${child}
          </p-text-field-wrapper>
          <p-text-field-wrapper class="toggle-password" label="Password" theme="${theme}">
            <input type="password" value="Value" />
          </p-text-field-wrapper>
          <p-text-field-wrapper label="Search" theme="${theme}">
            <input type="search" value="Value" />
          </p-text-field-wrapper>
        </div>
        <div>
          <p-text-field-wrapper label="Default" theme="${theme}">
            ${child}
          </p-text-field-wrapper>
          <p-text-field-wrapper label="Error" state="error" message="Error" theme="${theme}">
            ${child}
          </p-text-field-wrapper>
          <p-text-field-wrapper label="Success" state="success" message="Success" theme="${theme}">
            ${child}
          </p-text-field-wrapper>
        </div>
        <div>
          <p-text-field-wrapper label="Readonly" theme="${theme}">
            ${childReadonly}
          </p-text-field-wrapper>
          <p-text-field-wrapper label="Readonly Error" state="error" message="Error" theme="${theme}">
            ${childReadonly}
          </p-text-field-wrapper>
          <p-text-field-wrapper label="Readonly Success" state="success" message="Success" theme="${theme}">
            ${childReadonly}
          </p-text-field-wrapper>
        </div>
        <div>
          <p-text-field-wrapper label="Disabled" theme="${theme}">
            ${childDisabled}
          </p-text-field-wrapper>
          <p-text-field-wrapper label="Disabled Error" state="error" message="Error" theme="${theme}">
            ${childDisabled}
          </p-text-field-wrapper>
          <p-text-field-wrapper label="Disabled Success" state="success" message="Success" theme="${theme}">
            ${childDisabled}
          </p-text-field-wrapper>
        </div>
        <div>
          <p-text-field-wrapper theme="${theme}">
            <span slot="label">
              Slotted label
              <span>
                and some slotted, deeply nested <a href="#">anchor</a>.
              </span>
            </span>
            <span slot="description">
              Slotted description
              <span>
                and some slotted, deeply nested <a href="#">anchor</a>.
              </span>
            </span>
            ${child}
          </p-text-field-wrapper>
          <p-text-field-wrapper label="Error" description="Some description" state="error" theme="${theme}">
            ${child}
            <span slot="message">
              Slotted error message
              <span>
                and some slotted, deeply nested <a href="#">anchor</a>.
              </span>
            </span>
          </p-text-field-wrapper>
          <p-text-field-wrapper label="Success" description="Some description" state="success" theme="${theme}">
            ${child}
            <span slot="message">
              Slotted success message
              <span>
                and some slotted, deeply nested <a href="#">anchor</a>.
              </span>
            </span>
          </p-text-field-wrapper>
        </div>`;

      await setContentWithDesignSystem(page, getThemedBodyMarkup(getElementsMarkup), {
        injectIntoHead: head,
      });

      // let's toggle some password fields
      const textFieldWrappers = await page.$$('.toggle-password');
      await Promise.all(
        textFieldWrappers.map(
          async (item) =>
            (
              await item.evaluateHandle((el) => el.shadowRoot.querySelector('p-button-pure'))
            ).evaluate((el: HTMLElement) => el.click()) // js element.click() instead of puppeteer ElementHandle.click() to workaround element off screen issue
        )
      );

      // get rid of focus from last .toggle-password input
      await page.mouse.click(0, 0);

      await forceHoverState(page, '.hover p-text-field-wrapper input');
      await forceHoverState(page, '.hover p-text-field-wrapper a');
      await forceHoverState(page, '.hover p-text-field-wrapper >>> p-button-pure >>> button');
      await forceFocusState(page, '.focus p-text-field-wrapper input');
      await forceFocusState(page, '.focus p-text-field-wrapper a');
      await forceFocusState(page, '.focus p-text-field-wrapper >>> p-button-pure >>> button');
      await forceFocusHoverState(page, '.focus-hover p-text-field-wrapper input');
      await forceFocusHoverState(page, '.focus-hover p-text-field-wrapper a');
      await forceFocusHoverState(page, '.focus-hover p-text-field-wrapper >>> p-button-pure >>> button');
    })
  ).toBeFalsy();
});
