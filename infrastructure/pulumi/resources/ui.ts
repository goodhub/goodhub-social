import {
  ClientPortOperator,
  DestinationProtocol,
  Endpoint,
  Profile,
  QueryStringCachingBehavior,
  RedirectType,
  SkuName
} from '@pulumi/azure-native/cdn';
import { ResourceGroup } from '@pulumi/azure-native/resources';
import {
  BlobServiceProperties,
  Kind,
  StorageAccount,
  StorageAccountStaticWebsite,
  SkuName as StorageSkuName
} from '@pulumi/azure-native/storage';
import { cdn } from '@pulumi/azure-native/types/input';

export default async (id: string, group: ResourceGroup) => {
  const simpleId = id.replace(/-/g, '');
  const profile = new Profile(`${id}-profile`, {
    resourceGroupName: group.name,
    location: 'global',
    sku: {
      name: SkuName.Standard_Microsoft
    }
  });

  const storageAccount = new StorageAccount(simpleId, {
    enableHttpsTrafficOnly: true,
    kind: Kind.StorageV2,
    resourceGroupName: group.name,
    sku: {
      name: StorageSkuName.Standard_LRS
    }
  });

  new BlobServiceProperties(`${simpleId}-blob-service-properties`, {
    accountName: storageAccount.name,
    blobServicesName: 'default',
    resourceGroupName: group.name,
    cors: {
      corsRules: [
        {
          allowedHeaders: ['*'],
          allowedMethods: ['GET'],
          allowedOrigins: ['*'],
          exposedHeaders: ['*'],
          maxAgeInSeconds: 3600
        }
      ]
    }
  });

  const staticWebsite = new StorageAccountStaticWebsite(`${id}-static`, {
    accountName: storageAccount.name,
    resourceGroupName: group.name,
    indexDocument: 'index.html',
    error404Document: '404.html'
  });

  const endpointOrigin = storageAccount.primaryEndpoints.apply(ep => ep.web.replace('https://', '').replace('/', ''));

  const enforceHTTPSRule: cdn.DeliveryRuleArgs = {
    name: 'EnforceHTTPS',
    order: 1,
    conditions: [
      {
        name: 'RequestScheme',
        parameters: {
          matchValues: ['HTTP'],
          operator: ClientPortOperator.Equal,
          negateCondition: false,
          transforms: [],
          typeName: 'DeliveryRuleRequestSchemeConditionParameters'
        }
      }
    ],
    actions: [
      {
        name: 'UrlRedirect',
        parameters: {
          redirectType: RedirectType.Found,
          destinationProtocol: DestinationProtocol.Https,
          typeName: 'DeliveryRuleUrlRedirectActionParameters'
        }
      }
    ]
  };

  const spaRewriteRule: cdn.DeliveryRuleArgs = {
    name: 'SPARewrite',
    order: 2,
    conditions: [
      {
        name: 'UrlFileExtension',
        parameters: {
          operator: ClientPortOperator.GreaterThan,
          negateCondition: true,
          matchValues: ['0'],
          typeName: 'DeliveryRuleUrlFileExtensionMatchConditionParameters'
        }
      }
    ],
    actions: [
      {
        name: 'UrlRewrite',
        parameters: {
          sourcePattern: '/',
          destination: '/index.html',
          preserveUnmatchedPath: false,
          typeName: 'DeliveryRuleUrlRewriteActionParameters'
        }
      }
    ]
  };

  const endpoint = new Endpoint(`${id}-endpoint`, {
    endpointName: storageAccount.name.apply(sa => `cdn-endpnt-${sa}`),
    location: 'global',
    isHttpAllowed: false,
    isHttpsAllowed: true,
    originHostHeader: endpointOrigin,
    origins: [
      {
        hostName: endpointOrigin,
        httpsPort: 443,
        name: 'origin-storage-account'
      }
    ],
    profileName: profile.name,
    queryStringCachingBehavior: QueryStringCachingBehavior.NotSet,
    resourceGroupName: group.name,
    deliveryPolicy: {
      rules: [enforceHTTPSRule, spaRewriteRule]
    }
  });

  return {
    endpoint: endpoint.hostName.apply(hn => `https://${hn}`),
    resourceGroupName: group.name,
    accountName: storageAccount.name,
    containerName: staticWebsite.containerName,
    endpointName: endpoint.name,
    profileName: profile.name
  };
};
