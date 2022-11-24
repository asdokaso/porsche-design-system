import { minify as htmlMinifier } from 'html-minifier';

export const minifyHTML = (str: string): string => {
  return htmlMinifier(str, {
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
    removeAttributeQuotes: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    includeAutoGeneratedTags: false,
    quoteCharacter: '"',
  });
};

export const joinArrayElementsToString = (array: string[], glue = ', '): string =>
  array.map((x) => `'${x}'`).join(glue);

export const withoutTagsOption = `/** @deprecated will be removed in v3, use \`format: 'jsx'\` instead */
  withoutTags?: boolean;`;

export const convertPropsToAttributeString = (props: { [p: string]: string }): string =>
  Object.entries(props)
    .map(([attr, val]) => `${attr}${val ? '=' + val : ''}`)
    .join(' ');
