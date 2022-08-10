import * as sharedData from '@porsche-design-system/shared/data';
import type { ColorScheme, StackBlitzProjectAndOpenOptions, StackblitzProjectDependencies, Theme } from '@/models';
import { themeDark, themeLight } from '@porsche-design-system/utilities-v2';
import type { OpenInStackBlitzOpts } from '@/utils/stackblitz/openInStackBlitz';

export type StackBlitzFrameworkOpts = Omit<OpenInStackBlitzOpts, 'framework' | 'theme' | 'backgroundColorScheme'> & {
  title: string;
  description: string;
  globalStyles: string;
};

export type SharedImportKey = Exclude<keyof typeof sharedData, 'headVrt' | 'dataVrt'>;

export const removeSharedImport = (markup: string): string =>
  markup.replace(/import { .+ } from '@porsche-design-system\/shared';/, '');

export const getSharedImportConstants = (sharedImportKeys: SharedImportKey[]): string => {
  const sharedImportConstants = sharedImportKeys
    .map((x) => `const ${x} = ${JSON.stringify(sharedData[x], null, 1)};`)
    .join('\n\n');

  return sharedImportConstants ? `${sharedImportConstants}\n\n` : '';
};

export const EXTERNAL_DEPENDENCIES = ['imask'] as const;
export type ExternalDependency = typeof EXTERNAL_DEPENDENCIES[number];

export type DependencyMap = { [key in ExternalDependency]: StackblitzProjectDependencies };

// TODO: validate if typing works from md files, otherwise validate
export const getExternalDependencies = (
  additionalDependencies: ExternalDependency[],
  dependenciesMap: DependencyMap
): StackblitzProjectDependencies =>
  additionalDependencies.reduce(
    (result, current) => ({ ...result, ...dependenciesMap[current] }),
    {} as StackblitzProjectDependencies
  );

export const getBackgroundColor = (theme: Theme, colorScheme: ColorScheme): string => {
  const {
    background: { base, surface },
  } = theme === 'light' ? themeLight : themeDark;

  return colorScheme === 'surface' ? surface : base;
};

export type GetStackblitzProjectAndOpenOptions = (opts: StackBlitzFrameworkOpts) => StackBlitzProjectAndOpenOptions;

export const validateExternalDependencies = (externalDependencies: ExternalDependency[]): ExternalDependency[] => {
  if (externalDependencies.some((x) => !EXTERNAL_DEPENDENCIES.includes(x))) {
    throw new Error(
      `Passed 'externalStackBlitzDependencies[]' contains invalid value. Allowed are '${EXTERNAL_DEPENDENCIES.join(
        ', '
      )}'.`
    );
  }
  return externalDependencies;
};
