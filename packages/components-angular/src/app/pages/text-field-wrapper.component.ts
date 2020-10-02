import { Component } from '@angular/core';

@Component({
  selector: 'page-text-field-wrapper',
  template: `
    <div class="playground light" title="should render with label">
      <p-text-field-wrapper [label]="'Some label'">
        <input type="text" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with label and placeholder">
      <p-text-field-wrapper [label]="'Some label'">
        <input type="text" name="some-name" placeholder="Some placeholder" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with label, description and placeholder">
      <p-text-field-wrapper [label]="'Some label'" [description]="'Some description'">
        <input type="text" name="some-name" placeholder="Some placeholder" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render without label and without description">
      <p-text-field-wrapper [label]="'Some label'" [description]="'Some description'" [hideLabel]="true">
        <input type="text" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with responsive label and description">
      <p-text-field-wrapper
        [label]="'Some label'"
        [description]="'Some description'"
        [hideLabel]="{ base: true, xs: false, s: true, m: false, l: true, xl: false }"
      >
        <input type="text" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render in required state">
      <p-text-field-wrapper [label]="'Some label'">
        <input type="text" name="some-name" required />
      </p-text-field-wrapper>
      <p-text-field-wrapper [label]="'This is a very insanely super long label across multiple lines'">
        <input type="text" name="some-name" required />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render in disabled state">
      <p-text-field-wrapper [label]="'Some label'" [description]="'Some description'">
        <input type="text" name="some-name" disabled />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with placeholder in disabled state">
      <p-text-field-wrapper [label]="'Some label'">
        <input type="text" name="some-name" placeholder="Some placeholder" disabled />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with readonly state">
      <p-text-field-wrapper [label]="'Some label'" [description]="'Some description'">
        <input type="text" name="some-name" value="Some value" readonly />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with type number">
      <p-text-field-wrapper [label]="'Some label'">
        <input type="number" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with type email">
      <p-text-field-wrapper [label]="'Some label'">
        <input type="email" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with type tel">
      <p-text-field-wrapper [label]="'Some label'">
        <input type="tel" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with type url">
      <p-text-field-wrapper [label]="'Some label'">
        <input type="url" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with type date">
      <p-text-field-wrapper [label]="'Some label'">
        <input type="date" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with type time">
      <p-text-field-wrapper [label]="'Some label'">
        <input type="time" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with type month">
      <p-text-field-wrapper [label]="'Some label'">
        <input type="month" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with type week">
      <p-text-field-wrapper [label]="'Some label'">
        <input type="week" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with type password in different states">
      <p-text-field-wrapper [label]="'Some label'">
        <input type="password" name="some-name" value="some password" />
      </p-text-field-wrapper>
      <br />
      <p-text-field-wrapper [label]="'Some label'">
        <input type="password" name="some-name" value="some password" disabled />
      </p-text-field-wrapper>
      <br />
      <p-text-field-wrapper [label]="'Some label'">
        <input type="password" name="some-name" value="some password" readonly />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with type search in different states">
      <p-text-field-wrapper [label]="'Some label'">
        <input type="search" name="some-name" />
      </p-text-field-wrapper>
      <br />
      <p-text-field-wrapper [label]="'Some label'">
        <input type="search" name="some-name" disabled />
      </p-text-field-wrapper>
      <br />
      <p-text-field-wrapper [label]="'Some label'">
        <input type="search" name="some-name" readonly />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with error state and error message">
      <p-text-field-wrapper [label]="'Some label'" [state]="'error'" [message]="'error message'">
        <input type="text" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with error state and no error message">
      <p-text-field-wrapper [label]="'Some label'" [state]="'error'">
        <input type="text" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with success state and success message">
      <p-text-field-wrapper [label]="'Some label'" [state]="'success'" [message]="'success message'">
        <input type="text" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with success state and no success message">
      <p-text-field-wrapper [label]="'Some label'" [state]="'success'">
        <input type="text" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render with default state and no message">
      <p-text-field-wrapper [label]="'Some label'" [state]="'none'" [message]="'this message should be hidden'">
        <input type="text" name="some-name" />
      </p-text-field-wrapper>
    </div>

    <div
      class="playground light"
      title="should render label, description and message by slotted content with error state"
    >
      <p-text-field-wrapper [state]="'error'">
        <span slot="label">Some label with a <a href="https://designsystem.porsche.com">link</a>.</span>
        <span slot="description">Some description with a <a href="https://designsystem.porsche.com">link</a>.</span>
        <input type="text" name="some-name" placeholder="Some placeholder" />
        <span slot="message">Some error message with a <a href="https://designsystem.porsche.com">link</a>.</span>
      </p-text-field-wrapper>
    </div>

    <div
      class="playground light"
      title="should render label, description and message by slotted content with success state"
    >
      <p-text-field-wrapper [state]="'success'">
        <span slot="label">Some label with a <a href="https://designsystem.porsche.com">link</a>.</span>
        <span slot="description">Some description with a <a href="https://designsystem.porsche.com">link</a>.</span>
        <input type="text" name="some-name" placeholder="Some placeholder" />
        <span slot="message">Some success message with a <a href="https://designsystem.porsche.com">link</a>.</span>
      </p-text-field-wrapper>
    </div>

    <div
      class="playground light"
      title="should render with multiline label, description and message and cut off too long option text"
    >
      <p-text-field-wrapper
        [label]="'Lorem ipsum dolor sit amet, consetetur sadipscing'"
        [description]="'Lorem ipsum dolor sit amet, consetetur sadipscing lorem ipsum dolor sit amet'"
        [state]="'error'"
        [message]="'At vero eos et accusam et justo duo dolores et ea rebum.'"
        style="width: 240px;"
      >
        <input type="text" name="some-name" value="Lorem ipsum dolor sit amet, consetetur sadipscing elitr," />
      </p-text-field-wrapper>
    </div>

    <div class="playground light" title="should render in focus state">
      <p-text-field-wrapper [label]="'Some label'">
        <input id="test-focus-state" style="caret-color: transparent;" type="text" name="some-name" />
      </p-text-field-wrapper>
    </div>
  `
})
export class TextFieldWrapperComponent {}
