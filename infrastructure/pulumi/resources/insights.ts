import { Component } from '@pulumi/azure-native/insights/v20200202preview';
import { Workspace, getSharedKeysOutput } from '@pulumi/azure-native/operationalinsights';
import { ResourceGroup } from '@pulumi/azure-native/resources';

export default async (id: string, group: ResourceGroup) => {
  const workspace = new Workspace(`${id}-logs`, {
    resourceGroupName: group.name,
    sku: { name: 'PerGB2018' },
    retentionInDays: 30
  });

  const workspaceSharedKeys = getSharedKeysOutput({
    resourceGroupName: group.name,
    workspaceName: workspace.name
  });

  const appInsights = new Component(`${id}-app-insights`, {
    resourceGroupName: group.name,
    applicationType: 'web',
    kind: 'web',
    workspaceResourceId: workspace.id
  });

  return {
    workspace,
    workspaceSharedKeys,
    appInsights
  };
};
