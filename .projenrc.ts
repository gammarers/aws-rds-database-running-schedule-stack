import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.60.0',
  defaultReleaseBranch: 'main',
  name: 'aws-rds-database-running-scheduler',
  description: 'AWS RDS Database Running Scheduler',
  keywords: ['aws', 'cdk', 'aws-cdk', 'rds', 'scheduler', 'cost', 'saving'],
  projenrcTs: true,
  repositoryUrl: 'https://github.com/yicr/aws-rds-database-running-scheduler.git',
  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '16.0.0',
  workflowNodeVersion: '16.19.1',
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 19 * * *']),
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
});
project.synth();