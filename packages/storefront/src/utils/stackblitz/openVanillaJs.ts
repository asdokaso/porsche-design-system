import sdk from '@stackblitz/sdk';
import { version as pdsVersion } from '../../../../components-js/projects/components-wrapper/package.json';
import { dependencies } from '../../../package.json';
import type { StackBlitzFrameworkOpts } from '@/utils/stackblitz/openInStackBlitz';
import type { DependenciesMap } from '@/utils/stackblitz/helper';
import {
  headBasic,
  dataBasic,
  headSorting,
  dataSorting,
  dataAdvanced,
  headAdvanced,
} from '@porsche-design-system/shared';
import { getAdditionalDependencies } from '@/utils/stackblitz/helper';

const sharedImport = {
  headBasic,
  dataBasic,
  headSorting,
  dataSorting,
  dataAdvanced,
  headAdvanced,
};

const extendMarkupWithSharedTableData = (markup: string, sharedTableData: string): string => {
  const importVariables = sharedTableData.replace(/\s/g, '').split(',') as [
    'headBasic' | 'dataBasic' | 'headSorting' | 'dataSorting' | 'dataAdvanced' | 'headAdvanced'
  ];

  return markup.replace(
    /(<script>)/,
    `$1
const getHeadAndData = () => {

    ${importVariables.map((x) => `const ${x} = ${JSON.stringify(sharedImport[x])};`).join('\n    ')}

  return { ${sharedTableData} };
};`
  );
};

export const openVanillaJS = (props: StackBlitzFrameworkOpts): void => {
  const { markup, description, title, bodyStyles, additionalDependencies } = props;
  const [, sharedTableData] = markup.match(/const { ((?:[A-z]+,* )+)} = await getHeadAndData\(\);/) ?? [];

  const dependenciesMap: DependenciesMap = {
    IMask: {
      imask: `${dependencies['imask']}`,
    },
  };

  sdk.openProject(
    {
      files: {
        'index.html': `${sharedTableData ? extendMarkupWithSharedTableData(markup, sharedTableData) : markup}`,
        'index.js': `import './style.css'
import * as porscheDesignSystem from '@porsche-design-system/components-js'
${
  additionalDependencies && additionalDependencies.filter((x) => x === 'IMask')
    ? `import IMask from 'imask';
IMask`
    : ''
}

porscheDesignSystem.load();
`,
        'style.css': bodyStyles,
      },
      template: 'javascript',
      title,
      description,
      dependencies: {
        '@porsche-design-system/components-js': `${pdsVersion}`,
        ...(additionalDependencies && getAdditionalDependencies(additionalDependencies, dependenciesMap)),
      },
    },
    {
      openFile: 'index.html',
    }
  );
};
