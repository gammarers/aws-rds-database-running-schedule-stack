import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  authorOrganization: true,
  cdkVersion: '2.80.0',
  constructsVersion: '10.0.5',
  typescriptVersion: '5.1.x',
  jsiiVersion: '5.1.x',
  defaultReleaseBranch: 'main',
  name: '@gammarer/aws-rds-database-running-scheduler',
  description: 'AWS RDS Database Running Scheduler',
  keywords: ['aws', 'cdk', 'aws-cdk', 'rds', 'scheduler', 'cost', 'saving'],
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gammarer/aws-rds-database-running-scheduler.git',
  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  majorVersion: 1,
  minNodeVersion: '16.0.0',
  workflowNodeVersion: '20.11.x',
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
  publishToNuget: {
    dotNetNamespace: 'Gammarer.CDK.AWS',
    packageId: 'Gammarer.CDK.AWS.RdsDatabaseRunningScheduler',
  },
});
project.synth();