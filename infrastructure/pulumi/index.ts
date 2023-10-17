import { ResourceGroup } from '@pulumi/azure-native/resources';
import { Config, getProject, getStack } from '@pulumi/pulumi';

const project = getProject();
const stack = getStack();
const id = `${project}-${stack}`;
const simpleId = `${project.replace('-', '')}${stack}`;

const config = new Config();

export = async () => {
  const group = new ResourceGroup('social-dev');

  return {
    groupName: group.name
  };
};
