# Grid

<TableOfContents></TableOfContents>

## Example

The Porsche grid system is based on native [CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/) for best
performance, changing its available columns on mobile (6 content columns + 2 safe zone columns) and desktop view >=
760px viewport width (8-narrow/12-basic/14-extended/16-wide content columns + 2 safe zone columns). It has a size range
between 320px and 2560px, using fluid sized columns and gaps.

<p-link href="patterns/styles/example/grid" target="_blank" variant="secondary">View Porsche Grid in Full
Window</p-link>

<Playground :frameworkMarkup="codeExample" :externalStackBlitzDependencies="['styled-components']">
  <ExampleStylesGrid />
</Playground>

## Usage

##### Grid Areas:

**Basic-Grid 12 Columns:** This is the default and should contain all productive content, such as copy, graphics, and
descriptive imagery (or at least the main focus of the image).

**Extended-Grid 14 Columns:** Containers and images can be stretched to the extended grid to cluster content better or
create a more immersive moment.

**Wide-Grid 16 Columns:** Productive applications with, for example, a sidebar, can make use of the wide grid. Further
interactive/productive modules can make use of the full 16 columns.

**Full-bleed:** For immersive moments, images and background colors can be stretched to the full width of the viewport.
This does not correspond to the grid.

**Note:** that the Basic-, Extended-, and Wide-Grid all equal 6 columns on mobile viewports.

#### Do:

- Use the grid for a consistent appearance over all touchpoints.
- Align all left-aligned-headlines on one vertical line (left border of basic-grid).
- Set at least the image focus for larger imagery within the basic grid.

#### Don't:

- Don't scale elements within the grid bigger than the maximum specification for 1920px.

## Styles

The styles are available as `JavaScript` and `SCSS` version. Look at the example above to see how the styles work.

#### JS

JavaScript styles can be imported by
`import { … } from '@porsche-design-system/components-{js|angular|react|vue}/styles';`.

- `gridStyle`
- `gridGap`
- `gridNarrow`
- `gridNarrowColumnStart`
- `gridNarrowColumnEnd`
- `gridNarrowSpanOneHalf`
- `gridNarrowOffset`
- `gridNarrowOffsetBase`
- `gridNarrowOffsetS`
- `gridNarrowOffsetXXL`
- `gridBasic`
- `gridBasicColumnStart`
- `gridBasicColumnEnd`
- `gridBasicSpanOneHalf`
- `gridBasicSpanOneThird`
- `gridBasicSpanTwoThirds`
- `gridBasicOffset`
- `gridBasicOffsetBase`
- `gridBasicOffsetS`
- `gridBasicOffsetXXL`
- `gridExtended`
- `gridExtendedColumnStart`
- `gridExtendedColumnEnd`
- `gridExtendedSpanOneHalf`
- `gridExtendedOffset`
- `gridExtendedOffsetBase`
- `gridExtendedOffsetS`
- `gridExtendedOffsetXXL`
- `gridWide`
- `gridWideColumnStart`
- `gridWideColumnEnd`
- `gridWideOffset`
- `gridWideOffsetBase`
- `gridWideOffsetS`
- `gridWideOffsetXXL`
- `gridFull`
- `gridFullColumnEnd`
- `gridFullColumnStart`
- `gridFullOffset`

---

#### SCSS

SCSS styles can be imported by `@use '@porsche-design-system/components-js/styles' as *;`

<p-inline-notification heading="Important note" state="warning" dismiss-button="false">
 At the moment, importing SCSS styles is only possible from `@porsche-design-system/components-js` npm package.
</p-inline-notification>

- `@mixin pds-grid()`
- `$pds-grid-gap`
- `$pds-grid-narrow-column-start`
- `$pds-grid-narrow-column-end`
- `$pds-grid-narrow-span-one-half`
- `$pds-grid-narrow-offset-base`
- `$pds-grid-narrow-offset-s`
- `$pds-grid-narrow-offset-xxl`
- `$pds-grid-basic-column-start`
- `$pds-grid-basic-column-end`
- `$pds-grid-basic-span-one-half`
- `$pds-grid-basic-span-one-third`
- `$pds-grid-basic-span-two-thirds`
- `$pds-grid-basic-offset-base`
- `$pds-grid-basic-offset-s`
- `$pds-grid-basic-offset-xxl`
- `$pds-grid-extended-column-start`
- `$pds-grid-extended-column-end`
- `$pds-grid-extended-span-one-half`
- `$pds-grid-extended-offset-base`
- `$pds-grid-extended-offset-s`
- `$pds-grid-extended-offset-xxl`
- `$pds-grid-wide-column-start`
- `$pds-grid-wide-column-end`
- `$pds-grid-wide-offset-base`
- `$pds-grid-wide-offset-s`
- `$pds-grid-wide-offset-xxl`
- `$pds-grid-full-column-start`
- `$pds-grid-full-column-end`
- `$pds-grid-full-offset`

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { getStylesGridCodeSamples } from '@porsche-design-system/shared';
import { adjustSelectedFramework } from '@/utils';
import ExampleStylesGrid from '@/pages/patterns/styles/example-grid.vue';

@Component({
  components: {
    ExampleStylesGrid
  },
})
export default class Code extends Vue {
  codeExample = getStylesGridCodeSamples();

  public mounted(): void {
    adjustSelectedFramework(this.codeExample);
  }
}
</script>
