import { getVisualRegressionStatesTester, getVisualRegressionTester, testOptions } from '../helpers';
import {
  CSS_ANIMATION_DURATION,
  FOCUSED_HOVERED_STATE,
  FOCUSED_STATE,
  forceStateOnElement,
  HOVERED_STATE,
  setContentWithDesignSystem,
} from '../../e2e/helpers';

describe('Link Pure', () => {
  it('should have no visual regression', async () => {
    const vrt = getVisualRegressionTester();
    expect(
      await vrt.test(
        'link-pure',
        async () => {
          await vrt.goTo('/#link-pure');
        },
        testOptions
      )
    ).toBeFalsy();
  });

  it('should have no visual regression for :hover + :focus-visible', async () => {
    const vrt = getVisualRegressionStatesTester();
    expect(
      await vrt.test('link-pure-states', async () => {
        const page = await vrt.getPage();

        const head = `
          <link rel="stylesheet" href="styles.css" />
          <style type="text/css">p-link-pure:not(:last-child) { margin-right: 8px; }</style>`;

        const body = `
          <div class="playground light">
            <p-link-pure id="link-pure-hovered" href="#">Some label</p-link-pure>
            <p-link-pure id="link-pure-subline-hovered" href="#">Some label <p slot="subline">Some Subline</p></p-link-pure>
          </div>
          <div class="playground dark">
            <p-link-pure id="link-pure-dark-hovered" theme="dark" href="#">Some label</p-link-pure>
            <p-link-pure id="link-pure-subline-dark-hovered" theme="dark" href="#">Some label <p slot="subline">Some Subline</p></p-link-pure>
          </div>
          <div class="playground light">
            <p-link-pure id="link-pure-focused" href="#">Some label</p-link-pure>
            <p-link-pure id="link-pure-subline-focused" href="#">Some label <p slot="subline">Some Subline</p></p-link-pure>
          </div>
          <div class="playground dark">
            <p-link-pure id="link-pure-dark-focused" theme="dark" href="#">Some label</p-link-pure>
            <p-link-pure id="link-pure-subline-dark-focused" theme="dark" href="#">Some label <p slot="subline">Some Subline</p></p-link-pure>
          </div>
          <div class="playground light">
            <p-link-pure id="link-pure-hovered-focused" href="#">Some label</p-link-pure>
            <p-link-pure id="link-pure-subline-hovered-focused" href="#">Some label <p slot="subline">Some Subline</p></p-link-pure>
          </div>
          <div class="playground dark">
            <p-link-pure id="link-pure-dark-hovered-focused" theme="dark" href="#">Some label</p-link-pure>
            <p-link-pure id="link-pure-subline-dark-hovered-focused" theme="dark" href="#">Some label <p slot="subline">Some Subline</p></p-link-pure>
          </div>`;

        await setContentWithDesignSystem(page, body, { injectIntoHead: head });

        await forceStateOnElement(page, '#link-pure-hovered >>> a', HOVERED_STATE);
        await forceStateOnElement(page, '#link-pure-subline-hovered >>> a', HOVERED_STATE);

        await forceStateOnElement(page, '#link-pure-focused >>> a', FOCUSED_STATE);
        await forceStateOnElement(page, '#link-pure-subline-focused >>> a', FOCUSED_STATE);

        await forceStateOnElement(page, '#link-pure-hovered-focused >>> a', FOCUSED_HOVERED_STATE);
        await forceStateOnElement(page, '#link-pure-subline-hovered-focused >>> a', FOCUSED_HOVERED_STATE);

        await forceStateOnElement(page, '#link-pure-dark-hovered >>> a', HOVERED_STATE);
        await forceStateOnElement(page, '#link-pure-subline-dark-hovered >>> a', HOVERED_STATE);

        await forceStateOnElement(page, '#link-pure-dark-focused >>> a', FOCUSED_STATE);
        await forceStateOnElement(page, '#link-pure-subline-dark-focused >>> a', FOCUSED_STATE);

        await forceStateOnElement(page, '#link-pure-dark-hovered-focused >>> a', FOCUSED_HOVERED_STATE);
        await forceStateOnElement(page, '#link-pure-subline-dark-hovered-focused >>> a', FOCUSED_HOVERED_STATE);

        //wait for all style transitions to finish
        await page.waitForTimeout(CSS_ANIMATION_DURATION);
      })
    ).toBeFalsy();
  });
});
