import { ResourceGroup } from '@pulumi/azure-native/resources';

export default async () => {
  const group = new ResourceGroup('social-dev');

  return {
    groupName: group.name
  };
};
