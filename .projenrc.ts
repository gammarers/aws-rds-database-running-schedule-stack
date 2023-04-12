import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.60.0',
  defaultReleaseBranch: 'main',
  name: '@yicr/aws-rds-database-running-scheduler',
  description: 'AWS RDS Database Running Scheduler',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/yuichiro.higa/aws-rds-database-running-scheduler.git',
  releaseToNpm: false,
});
project.synth();