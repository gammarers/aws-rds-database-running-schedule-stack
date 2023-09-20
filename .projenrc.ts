import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  authorOrganization: true,
  cdkVersion: '2.80.0',
  typescriptVersion: '4.9.x',
  jsiiVersion: '~5.0.0',
  defaultReleaseBranch: 'main',
  name: '@gammarer/aws-rds-database-running-scheduler',
  description: 'AWS RDS Database Running Scheduler',
  keywords: ['aws', 'cdk', 'aws-cdk', 'rds', 'scheduler', 'cost', 'saving'],
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gammarer/aws-rds-database-running-scheduler.git',
  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '16.0.0',
  workflowNodeVersion: '18.17.1',
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 16 * * 3']), // every wednesday 16:00 (JST/THU:0100)
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
  publishToPypi: {
    distName: 'gammarer.aws-rds-database-running-scheduler',
    module: 'gammarer.aws_rds_database_running_scheduler',
  },
  publishToMaven: {
    mavenGroupId: 'com.gammarer',
    javaPackage: 'com.gammarer.cdk.aws.rds_database_running_scheduler',
    mavenArtifactId: 'aws-rds-database-running-scheduler',
    mavenEndpoint: 'https://s01.oss.sonatype.org',
  },
});
project.synth();