import * as path from 'path';
import * as fs from 'fs';
import * as globby from 'globby';
import { paramCase } from 'change-case';
import { breakpoint } from '@porsche-design-system/utilities-v2';

const prepareSsrComponents = (): void => {
  const rootDirectory = path.resolve(__dirname, '..');
  const componentsDirectory = path.resolve(rootDirectory, 'src/components');
  const destinationDirectory = path.resolve(
    rootDirectory,
    '../components-react/projects/components-wrapper/src/lib/components-stencil'
  );

  const componentPaths = globby.sync(`${componentsDirectory}/**/*.tsx`).sort();

  const componentFileContents = componentPaths
    // .filter((filePath) => filePath.includes('accordion'))
    .map((filePath) => {
      const fileContent = fs.readFileSync(filePath, 'utf8');

      let newFileContent = fileContent
        .replace(/@Component\({[\S\s]+?\)\n/g, '')
        .replace(/@Element\(\) /g, '')
        .replace(/\n  \/\*\*[\s\S]*?@Prop\(.*?\) [\s\S]*?;\n/g, '')
        .replace(/\n  @Listen\(.*\)[\s\S]+?\n  }\n/g, '')
        .replace(/@Watch\(.*\)[\s\S]+?\n  }\n/g, '')
        .replace(/@Method\(.*\)[\s\S]+?\n  }\n/g, '')
        .replace(/@State\(\) /g, '')
        .replace(/\n.*\n  @Event\(.*\).*\n/g, '')
        .replace(/\n  public connectedCallback\(\): void {[\S\s]+?\n  }\n/g, '')
        .replace(/\n  public componentWillLoad\(\): void {[\S\s]+?\n  }\n/g, '')
        .replace(/\n  public componentDidLoad\(\): void {[\S\s]+?\n  }\n/g, '')
        .replace(/\n  public componentWillUpdate\(\): void {[\S\s]+?\n  }\n/g, '')
        .replace(/\n  public componentDidUpdate\(\): void {[\S\s]+?\n  }\n/g, '')
        .replace(/\n  public componentWillRender\(\): void {[\S\s]+?\n  }\n/g, '')
        .replace(/\n  public componentDidRender\(\): void {[\S\s]+?\n  }\n/g, '')
        .replace(/\n  public disconnectedCallback\(\): void {[\S\s]+?\n  }\n/g, '')
        .replace(/\n  public componentShouldUpdate\([\S\s]+?\n  }\n/g, '')
        // .replace(/\n  private .*;/g, '') // private members
        .replace(/\n  private (?!get).*{[\S\s]+?\n  };?\n/g, '') // private methods without getters
        .replace(/\nconst propTypes[\s\S]*?};\n/g, '') // temporary
        // .replace(/    validateProps\(this, propTypes\);\n/, '') // temporary
        // .replace(/attachComponentCss\(this\.host, (getComponentCss), /, 'return $1(')
        .replace(/\s+ref={.*?}/g, '') // ref props
        .replace(/\s+onMouseDown={.*?}/g, '') // onMouseDown props
        .replace(/\s+onClick={.*?}/g, '') // onClick props
        .replace(/\s+onDismiss={.*?}/g, '') // onDismiss props
        .replace(/\s+onKeyDown={.*?}/g, '') // onKeyDown props
        .replace(/\s+onInput={.*?}/g, '') // onInput props
        .replace(/\s+onTabChange={.*?}/g, '') // onTabChange props
        .replace(/ +ref: [\s\S]*?,\n/g, '') // ref props
        .replace(/ +onClick: [\s\S]*?,\n/g, '') // onClick props
        .replace(/ +onKeyDown: [\s\S]*?,\n/g, '') // onKeyDown props
        // .replace(/(public [a-zA-Z]+\??:) [-a-zA-Z<>,'| ]+/g, '$1 any ') // change type if props to any
        .replace(/( class)=/g, '$1Name=') // change class prop to className in JSX
        // .replace(/tabindex=/g, 'tabIndex=') // fix casing
        .replace(/getPrefixedTagNames,?\s*/, '') // remove getPrefixedTagNames import
        // remove all imports except for utils and functional components which are rewritten
        .replace(/import[\s\S]*?from '(.*)';\n/g, (m, group) =>
          group.endsWith('utils')
            ? m.replace(group, '@porsche-design-system/components/dist/utils/utils-entry')
            : group.endsWith('state-message') || group.endsWith('required')
            ? m.replace(group, './' + group.split('/').pop())
            : ''
        )
        .replace(/(getPrefixedTagNames)\((?:this\.)?host\)/g, '$1()') // remove this.host param
        .replace(/(this\.(?:input|select|textarea));/g, '$1 || defaultChildren[0].props;') // fallback for undefined input, select and textarea reference
        .replace(/(this\.host)\./g, '$1?.') // make this.host optional
        // add new imports
        .replace(
          /^/g,
          "import { Component } from 'react';\nimport { getPrefixedTagNames } from '../../getPrefixedTagNames';\n"
        )
        .replace(/export class [A-Za-z]+/, '$& extends Component<any>') // make it a real React.Component
        .replace(/(<\/?)Host.*(>)/g, '$1$2') // remove Host fragment
        .replace(/(public state)\?(: any)/, '$1$2') // make state required to fix linting issue with React
        .replace(/\bbreakpoint\.l\b/, `'${breakpoint.l}'`) // inline breakpoint value from utilities-v2 for marque
        .replace(/(this\.)([a-zA-Z]+)/g, '$1props.$2') // change this.whatever to this.props.whatever
        .replace(/(this\.)props\.(input|select|textarea)/g, '$1$2') // revert for input, select and textarea
        .replace(/(this\.)props\.(key\+\+|tabsItemElements|slides)/g, '$1$2') // revert for certain private members
        .replace('<slot />', '<>{this.props.children}</>');

      // rewire named slots
      if (newFileContent.includes('<slot name="') && !newFileContent.includes('FunctionalComponent')) {
        newFileContent = newFileContent.replace(/this\.props\.children/, 'defaultChildren').replace(
          /public render\(\): JSX\.Element {/,
          `$&
    const children = Array.isArray(this.props.children)
      ? this.props.children
      : this.props.children
      ? [this.props.children]
      : [];
    const namedSlottedChildren = children.filter((child) => child.props?.slot);
    const defaultChildren = children.filter((child) => !child.props?.slot);\n`
        );

        const namedSlots = Array.from(fileContent.matchAll(/<slot name="([a-z]+)" \/>/g));
        namedSlots.forEach(([match, slotName]) => {
          newFileContent = newFileContent.replace(
            match,
            `namedSlottedChildren.filter(({ props: { slot } }) => slot === '${slotName}')`
          );
        });

        newFileContent = newFileContent
          .replace(
            /hasLabel\(this\.props\.host, (this\.props\.label)\)/,
            `$1 || namedSlottedChildren.filter(({ props: { slot } }) => slot === 'label').length > 0`
          )
          .replace(
            /hasDescription\(this\.props\.host, (this\.props\.description)\)/,
            `$1 || namedSlottedChildren.filter(({ props: { slot } }) => slot === 'description').length > 0`
          )
          .replace(
            /hasMessage\(this\.props\.host, (this\.props\.message), (this\.props\.state)\)/,
            `($1 || namedSlottedChildren.filter(({ props: { slot } }) => slot === 'message').length > 0) && ['success', 'error'].includes($2)`
          )
          .replace(
            /(<StateMessage.*?message)={(.*?)}/,
            `$1={$2 || namedSlottedChildren.filter(({ props: { slot } }) => slot === 'message')}`
          )
          .replace(/namedSlottedChildren\.filter\(\({ props: { slot } }\) => slot === '(?:subline|caption)'\)/, '{$&}')
          .replace(
            /= hasSlottedSubline\(this\.props\.host\)/,
            `= namedSlottedChildren.filter(({ props: { slot } }) => slot === 'subline').length > 0`
          )
          .replace(
            /= hasNamedSlot\(this\.props\.host, 'caption'\)/,
            `= namedSlottedChildren.filter(({ props: { slot } }) => slot === 'caption').length > 0`
          );
      }

      return newFileContent;
    });

  fs.rmSync(destinationDirectory, { force: true, recursive: true });
  fs.mkdirSync(destinationDirectory, { recursive: true });

  componentFileContents.forEach((fileContent) => {
    const name = /export (?:class|const) ([A-Za-z]+)/.exec(fileContent)![1];

    const fileName = `${paramCase(name)}.tsx`;
    const filePath = path.resolve(destinationDirectory, fileName);

    fs.writeFileSync(filePath, fileContent);
    console.log(`Generated SSR Component into '${fileName}'`);
  });
};

prepareSsrComponents();
