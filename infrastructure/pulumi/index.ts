import { ResourceGroup } from '@pulumi/azure-native/resources';
import { Config, getProject, getStack } from '@pulumi/pulumi';

import { ManagedEnvironment } from '@pulumi/azure-native/app';
import { GetSharedKeysResult } from '@pulumi/azure-native/operationalinsights';
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
  const environment = new ManagedEnvironment(`${id}-containerapps-env`, {
    resourceGroupName: group.name,
    appLogsConfiguration: {
      destination: 'log-analytics',
      logAnalyticsConfiguration: {
        customerId: workspace.customerId,
        sharedKey: workspaceSharedKeys.apply((r: GetSharedKeysResult) => r.primarySharedKey!)
      }
    }
  });

  const ui = await setupUI(id, group);

  return {
    groupName: group.name,
    environmentDomain: environment.defaultDomain,
    ...ui,
    tag
  };
};
