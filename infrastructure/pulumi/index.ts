import { ResourceGroup } from '@pulumi/azure-native/resources';
import { Config, getProject, getStack, interpolate } from '@pulumi/pulumi';

import { ContainerApp, ManagedEnvironment } from '@pulumi/azure-native/app';
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
  const image = config.get('api-image');

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

  const env = {
    PORT: '3000',
    DATABASE_URL: config.require('database-url'),
    OPEN_AI_API_KEY: config.require('openai-key')
  };

  const api = new ContainerApp(`${id}-api`, {
    resourceGroupName: group.name,
    managedEnvironmentId: environment.id,
    configuration: {
      ingress: {
        external: true,
        targetPort: 3000
      }
    },
    template: {
      containers: [
        {
          name: 'api',
          image,
          resources: {
            cpu: 1,
            memory: '2.0Gi'
          },
          env: Object.entries(env).map(([name, value]) => ({ name, value }))
        }
      ],
      scale: {
        minReplicas: 0,
        maxReplicas: 1,
        rules: [
          {
            name: 'requests',
            http: {
              metadata: {
                concurrentRequests: '100'
              }
            }
          }
        ]
      }
    }
  });

  return {
    environmentDomain: environment.defaultDomain,
    apiUrl: interpolate`https://${api.name}.${environment.defaultDomain}`,
    ...ui,
    image
  };
};
