import {
  addEventListener,
  expectedStyleOnFocus,
  getAttribute,
  getElementStyle,
  getLifecycleStatus,
  getOutlineStyle,
  getProperty,
  initAddEventListener,
  selectNode,
  setContentWithDesignSystem,
  setProperty,
  waitForEventSerialization,
  waitForStencilLifecycle,
} from '../helpers';
import { ElementHandle, Page } from 'puppeteer';
import { FormState } from '@porsche-design-system/components/src/types';

describe('text-field-wrapper', () => {
  let page: Page;
  const CSS_TRANSITION_DURATION = 240;

  beforeEach(async () => {
    page = await browser.newPage();
    await initAddEventListener(page);
  });
  afterEach(async () => await page.close());

  const getHost = () => selectNode(page, 'p-text-field-wrapper');
  const getInput = () => selectNode(page, 'p-text-field-wrapper input');
  const getLabelLink = () => selectNode(page, 'p-text-field-wrapper [slot="label"] a');
  const getDescriptionLink = () => selectNode(page, 'p-text-field-wrapper [slot="description"] a');
  const getMessageLink = () => selectNode(page, 'p-text-field-wrapper [slot="message"] a');
  const getLabel = () => selectNode(page, 'p-text-field-wrapper >>> .label__text');
  const getButton = () => selectNode(page, 'p-text-field-wrapper >>> button');
  const getMessage = () => selectNode(page, 'p-text-field-wrapper >>> .message');
  const getIcon = () => selectNode(page, 'p-text-field-wrapper >>> p-icon');
  const getIconName = (icon: ElementHandle) => getProperty(icon, 'name');

  type InitOptions = {
    useSlottedLabel?: boolean;
    useSlottedDescription?: boolean;
    useSlottedMessage?: boolean;
    state?: FormState;
    type?: 'text' | 'password' | 'search';
    hasLabel?: boolean;
  };

  const initTextField = (opts?: InitOptions): Promise<void> => {
    const {
      useSlottedLabel = false,
      useSlottedDescription = false,
      useSlottedMessage = false,
      state = 'none',
      type = 'text',
      hasLabel = false,
    } = opts ?? {};

    const slottedLabel = useSlottedLabel
      ? '<span slot="label">Some label with a <a href="#" onclick="return false;">link</a>.</span>'
      : '';
    const slottedDescription = useSlottedDescription
      ? '<span slot="description">Some description with a <a href="#" onclick="return false;">link</a>.</span>'
      : '';
    const slottedMessage = useSlottedMessage
      ? '<span slot="message">Some message with a <a href="#" onclick="return false;">link</a>.</span>'
      : '';
    const label = hasLabel ? ' label="Some label"' : '';

    return setContentWithDesignSystem(
      page,
      `
      <p-text-field-wrapper state="${state}"${label}>
        ${slottedLabel}
        ${slottedDescription}
        <input type="${type}" />
        ${slottedMessage}
      </p-text-field-wrapper>`
    );
  };

  it('should not render label if label prop is not defined but should render if changed programmatically', async () => {
    await initTextField();
    const textFieldComponent = await getHost();
    expect(await getLabel()).toBeNull();

    await setProperty(textFieldComponent, 'label', 'Some label');
    await waitForStencilLifecycle(page);
    expect(await getLabel()).not.toBeNull();
  });

  describe('accessibility', () => {
    it('should add aria-label', async () => {
      await initTextField({ hasLabel: true });
      const input = await getInput();
      expect(await getAttribute(input, 'aria-label')).toBe('Some label');
    });

    it('should add aria-label with description text', async () => {
      await setContentWithDesignSystem(
        page,
        `
        <p-text-field-wrapper label="Some label" description="Some description">
          <input type="text">
        </p-text-field-wrapper>`
      );
      const input = await getInput();
      expect(await getAttribute(input, 'aria-label')).toBe('Some label. Some description');
    });

    it('should add aria-label with message text', async () => {
      await setContentWithDesignSystem(
        page,
        `
        <p-text-field-wrapper label="Some label" description="Some description" message="Some error message" state="error">
          <input type="text">
        </p-text-field-wrapper>`
      );
      const input = await getInput();
      expect(await getAttribute(input, 'aria-label')).toBe('Some label. Some error message');
    });

    it('should add/remove message text and update aria-label attribute if state changes programmatically', async () => {
      await initTextField({ hasLabel: true });
      const textFieldComponent = await getHost();
      const input = await getInput();

      expect(await getMessage(), 'initially').toBeNull();

      await setProperty(textFieldComponent, 'state', 'error');
      await setProperty(textFieldComponent, 'message', 'Some error message');
      await waitForStencilLifecycle(page);

      let message = await getMessage();
      expect(message, 'when state = error').toBeDefined();
      expect(await getAttribute(message, 'role'), 'when state = error').toEqual('alert');
      expect(await getAttribute(input, 'aria-label'), 'when state = error').toEqual('Some label. Some error message');

      await setProperty(textFieldComponent, 'state', 'success');
      await setProperty(textFieldComponent, 'message', 'Some success message');
      await waitForStencilLifecycle(page);

      message = await getMessage();
      expect(await message, 'when state = success').toBeDefined();
      expect(await getAttribute(message, 'role'), 'when state = success').toBeNull();
      expect(await getAttribute(input, 'aria-label'), 'when state = success').toEqual(
        'Some label. Some success message'
      );

      await setProperty(textFieldComponent, 'state', 'none');
      await setProperty(textFieldComponent, 'message', '');
      await waitForStencilLifecycle(page);

      message = await getMessage();
      expect(message, 'when state = none').toBeNull();
      expect(await getAttribute(input, 'aria-label'), 'when state = none').toEqual('Some label');
    });
  });

  describe('input type password', () => {
    it('should disable input and toggle password button when input is disabled programmatically', async () => {
      await initTextField({ type: 'password', hasLabel: true });
      const input = await getInput();

      const initialCursor = await getElementStyle(input, 'cursor');
      const initialBorderColor = await getElementStyle(input, 'borderColor');

      await setProperty(input, 'disabled', true);
      await waitForStencilLifecycle(page);
      await page.waitForTimeout(CSS_TRANSITION_DURATION);

      expect(await getElementStyle(input, 'cursor'), 'disabled cursor').not.toBe(initialCursor);
      expect(await getElementStyle(input, 'borderColor'), 'disabled border').not.toBe(initialBorderColor);

      await setProperty(input, 'disabled', false);
      await waitForStencilLifecycle(page);
      await page.waitForTimeout(CSS_TRANSITION_DURATION);

      expect(await getElementStyle(input, 'cursor'), 'not disabled cursor').toBe(initialCursor);
      expect(await getElementStyle(input, 'borderColor'), 'not disabled borderColor').toBe(initialBorderColor);
    });

    it('should toggle icon when password visibility button is clicked', async () => {
      await initTextField({ type: 'password', hasLabel: true });
      const toggleButton = await getButton();

      const icon = await getIcon();
      expect(await getIconName(icon)).toBe('view');

      await toggleButton.click();
      await waitForStencilLifecycle(page);

      expect(await getIconName(icon)).toBe('view-off');

      await toggleButton.click();
      await waitForStencilLifecycle(page);

      expect(await getIconName(icon)).toBe('view');
    });

    it('should toggle aria-pressed state when password visibility button is clicked', async () => {
      await initTextField({ type: 'password', hasLabel: true });
      const toggleButton = await getButton();

      const ariaPressedState = async () => await toggleButton.evaluate((el) => el.getAttribute('aria-pressed'));
      expect(await ariaPressedState()).toBe('false');

      await toggleButton.click();
      await waitForStencilLifecycle(page);

      expect(await ariaPressedState()).toBe('true');

      await toggleButton.click();
      await waitForStencilLifecycle(page);

      expect(await ariaPressedState()).toBe('false');
    });

    it('should have padding-right', async () => {
      await initTextField({ type: 'password', hasLabel: true });
      const input = await getInput();
      const toggleButton = await getButton();

      expect(await getElementStyle(input, 'paddingRight'), 'initially').toBe('48px');

      await toggleButton.click();
      await waitForStencilLifecycle(page);

      expect(await getElementStyle(input, 'paddingRight'), 'after toggleButton click').toBe('48px');
    });

    it('should toggle password visibility and focus input correctly', async () => {
      await initTextField({ type: 'password', hasLabel: true });
      const button = await getButton();
      const input = await getInput();

      let inputFocusCalls = 0;
      await addEventListener(input, 'focus', () => inputFocusCalls++);

      expect(await getAttribute(input, 'type')).toBe('password');
      expect(inputFocusCalls).toBe(0);

      await button.click();
      await waitForStencilLifecycle(page);

      expect(await getAttribute(input, 'type')).toBe('text');
      expect(inputFocusCalls).toBe(1);

      await button.click();
      await waitForStencilLifecycle(page);

      expect(await getAttribute(input, 'type')).toBe('password');
      expect(inputFocusCalls).toBe(2);
    });
  });

  describe('input type search', () => {
    it('should disable search button when input is set to disabled programmatically', async () => {
      await initTextField({ type: 'search', hasLabel: true });
      const input = await getInput();
      const button = await getButton();

      const initialCursor = await getElementStyle(input, 'cursor');
      const initialBorderColor = await getElementStyle(input, 'borderColor');

      const isButtonDisabled = () => getProperty(button, 'disabled');

      await setProperty(input, 'disabled', true);
      await waitForStencilLifecycle(page);
      await page.waitForTimeout(CSS_TRANSITION_DURATION);

      expect(await getElementStyle(input, 'cursor'), 'disabled cursor').not.toBe(initialCursor);
      expect(await getElementStyle(input, 'borderColor'), 'disabled borderColor').not.toBe(initialBorderColor);
      expect(await isButtonDisabled()).toBe(true);

      await setProperty(input, 'disabled', false);
      await waitForStencilLifecycle(page);
      await page.waitForTimeout(CSS_TRANSITION_DURATION);

      expect(await getElementStyle(input, 'cursor'), 'not disabled cursor').toBe(initialCursor);
      expect(await getElementStyle(input, 'borderColor'), 'not disabled borderColor').toBe(initialBorderColor);
      expect(await isButtonDisabled()).toBe(false);
    });

    it('should disable search button when input is set to readonly programmatically', async () => {
      await initTextField({ type: 'search', hasLabel: true });
      const input = await getInput();
      const button = await getButton();

      const initialColor = await getElementStyle(input, 'color');
      const initialBorderColor = await getElementStyle(input, 'borderColor');
      const initialBackgroundColor = await getElementStyle(input, 'backgroundColor');

      const isButtonDisabled = () => getProperty(button, 'disabled');

      await setProperty(input, 'readOnly', true);
      await waitForStencilLifecycle(page);
      await page.waitForTimeout(CSS_TRANSITION_DURATION);

      expect(await getElementStyle(input, 'color'), 'readonly color').not.toBe(initialColor);
      expect(await getElementStyle(input, 'borderColor'), 'readonly border').not.toBe(initialBorderColor);
      expect(await getElementStyle(input, 'backgroundColor'), 'readonly backgroundColor').not.toBe(
        initialBackgroundColor
      );
      expect(await isButtonDisabled()).toBe(true);

      await setProperty(input, 'readOnly', false);
      await waitForStencilLifecycle(page);
      await page.waitForTimeout(CSS_TRANSITION_DURATION);

      expect(await getElementStyle(input, 'color'), 'not readonly color').toBe(initialColor);
      expect(await getElementStyle(input, 'borderColor'), 'not readonly border').toBe(initialBorderColor);
      expect(await getElementStyle(input, 'backgroundColor'), 'not readonly backgroundColor').toBe(
        initialBackgroundColor
      );
      expect(await isButtonDisabled()).toBe(false);
    });

    it('should disable search button when input is set to disabled and readonly programmatically', async () => {
      await initTextField({ type: 'search', hasLabel: true });
      const input = await getInput();
      const button = await getButton();

      const isButtonDisabled = () => getProperty(button, 'disabled');

      await setProperty(input, 'disabled', true);
      await waitForStencilLifecycle(page);
      await page.waitForTimeout(CSS_TRANSITION_DURATION);

      const disabledBorderColor = await getElementStyle(input, 'borderColor');
      const disabledBackgroundColor = await getElementStyle(input, 'backgroundColor');

      expect(await isButtonDisabled()).toBe(true);

      await setProperty(input, 'readOnly', true);
      await waitForStencilLifecycle(page);
      await page.waitForTimeout(CSS_TRANSITION_DURATION);

      expect(await getElementStyle(input, 'borderColor'), 'readonly and disabled border').not.toBe(disabledBorderColor);
      expect(await getElementStyle(input, 'backgroundColor'), 'readonly and disabled backgroundColor').not.toBe(
        disabledBackgroundColor
      );
    });

    it('should submit parent form on search button click', async () => {
      await setContentWithDesignSystem(
        page,
        `
        <form onsubmit="return false;">
          <p-text-field-wrapper label="Some label">
            <input type="search">
          </p-text-field-wrapper>
        </form>`
      );
      const searchButton = await getButton();
      const form = await selectNode(page, 'form');

      let formFocusCalls = 0;
      await addEventListener(form, 'submit', () => formFocusCalls++);

      await searchButton.click();
      await waitForEventSerialization(page);
      await waitForEventSerialization(page); // 🙈
      await waitForEventSerialization(page); // 🙈

      expect(formFocusCalls).toBe(1);
    });

    it('should have padding-right', async () => {
      await initTextField({ type: 'search', hasLabel: true });
      const input = await getInput();
      expect(await getElementStyle(input, 'paddingRight')).toBe('48px');
    });

    it('should have "-webkit-appearance: none" on "::-webkit-search-decoration"', async () => {
      await initTextField({ type: 'search' });
      const input = await getInput();

      expect(await getElementStyle(input, 'webkitAppearance', { pseudo: '::-webkit-search-decoration' })).toBe('none');
    });
  });

  describe('focus state', () => {
    it('should be shown by keyboard navigation and on click for slotted <input>', async () => {
      await initTextField();

      const input = await getInput();
      const hidden = expectedStyleOnFocus({ color: 'transparent' });
      const visible = expectedStyleOnFocus({ color: 'neutral' });

      expect(await getOutlineStyle(input)).toBe(hidden);

      await input.click();

      expect(await getOutlineStyle(input)).toBe(visible);

      await page.keyboard.down('ShiftLeft');
      await page.keyboard.press('Tab');
      await page.keyboard.up('ShiftLeft');
      await page.keyboard.press('Tab');

      expect(await getOutlineStyle(input)).toBe(visible);
    });

    it('should be shown by keyboard navigation only for slotted <a>', async () => {
      await initTextField({
        useSlottedLabel: true,
        useSlottedDescription: true,
        useSlottedMessage: true,
        state: 'error',
      });

      const labelLink = await getLabelLink();
      const descriptionLink = await getDescriptionLink();
      const messageLink = await getMessageLink();
      const hidden = expectedStyleOnFocus({ color: 'transparent', offset: '1px' });
      const visible = expectedStyleOnFocus({ color: 'hover', offset: '1px' });

      expect(await getOutlineStyle(labelLink)).toBe(hidden);
      expect(await getOutlineStyle(descriptionLink)).toBe(hidden);
      expect(await getOutlineStyle(messageLink)).toBe(hidden);

      await labelLink.click();

      expect(await getOutlineStyle(labelLink)).toBe(hidden);

      await page.keyboard.down('ShiftLeft');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.up('ShiftLeft');

      expect(await getOutlineStyle(labelLink)).toBe(visible);

      await descriptionLink.click();

      expect(await getOutlineStyle(descriptionLink)).toBe(hidden);

      await page.keyboard.down('ShiftLeft');
      await page.keyboard.press('Tab');
      await page.keyboard.up('ShiftLeft');

      expect(await getOutlineStyle(descriptionLink)).toBe(visible);

      await messageLink.click();

      expect(await getOutlineStyle(messageLink)).toBe(hidden);

      await page.keyboard.down('ShiftLeft');
      await page.keyboard.press('Tab');
      await page.keyboard.up('ShiftLeft');
      await page.keyboard.press('Tab');

      expect(await getOutlineStyle(messageLink)).toBe(visible);
    });

    it('should focus input when label text is clicked', async () => {
      await initTextField({ hasLabel: true });
      const labelText = await getLabel();
      const input = await getInput();

      let inputFocusSpyCalls = 0;
      await addEventListener(input, 'focus', () => inputFocusSpyCalls++);

      expect(inputFocusSpyCalls).toBe(0);
      await labelText.click();
      await waitForStencilLifecycle(page);

      expect(inputFocusSpyCalls).toBe(1);
    });
  });

  describe('lifecycle', () => {
    it('should work without unnecessary round trips on init', async () => {
      await initTextField({
        useSlottedLabel: true,
        useSlottedDescription: true,
        useSlottedMessage: true,
        state: 'error',
        type: 'password',
      });
      const status = await getLifecycleStatus(page);

      expect(status.componentDidLoad['p-text-field-wrapper'], 'componentDidLoad: p-text-field-wrapper').toBe(1);
      expect(status.componentDidLoad['p-text'], 'componentDidLoad: p-text').toBe(3);
      expect(status.componentDidLoad['p-icon'], 'componentDidLoad: p-icon').toBe(2);

      expect(status.componentDidUpdate.all, 'componentDidUpdate: all').toBe(0);
      expect(status.componentDidLoad.all, 'componentDidLoad: all').toBe(6);
    });

    it('should work without unnecessary round trips after prop change', async () => {
      await initTextField();
      const host = await getHost();

      await setProperty(host, 'label', 'Some Label');
      await waitForStencilLifecycle(page);

      const status = await getLifecycleStatus(page);

      expect(status.componentDidLoad['p-text'], 'componentDidLoad: p-text').toBe(1);

      expect(status.componentDidUpdate['p-text-field-wrapper'], 'componentDidUpdate: p-text-field-wrapper').toBe(1);
      expect(status.componentDidUpdate['p-text'], 'componentDidUpdate: p-text').toBe(0);

      expect(status.componentDidUpdate.all, 'componentDidUpdate: all').toBe(1);
      expect(status.componentDidLoad.all, 'componentDidLoad: all').toBe(2);
    });
  });
});
