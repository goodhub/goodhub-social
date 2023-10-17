import { ResourceGroup } from '@pulumi/azure-native/resources';
import { Config, getProject, getStack } from '@pulumi/pulumi';

import setupInsights from './resources/insights';
import setupUI from './resources/ui';

const project = getProject();
const stack = getStack();
const id = `${project}-${stack}`;
const simpleId = `${project.replace('-', '')}${stack}`;

const config = new Config();

export = async () => {
  const group = new ResourceGroup('social-dev');
  const tag = config.get('api');

  const { workspace, workspaceSharedKeys, appInsights } = await setupInsights(id, group);

  const ui = await setupUI(id, group);

  return {
    groupName: group.name,
    ...ui,
    tag
  };
};
