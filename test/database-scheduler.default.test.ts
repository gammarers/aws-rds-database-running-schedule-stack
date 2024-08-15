import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { DatabaseType, RdsDatabaseRunningScheduleStack } from '../src';

describe('RdsDatabaseRunningScheduler Default Testing', () => {

  describe('default schedule', () => {
    const app = new App();

    const stack = new RdsDatabaseRunningScheduleStack(app, 'RdsDatabaseRunningScheduleStack', {
      targets: [
        {
          type: DatabaseType.CLUSTER,
          identifiers: ['db-cluster-1a'],
          startSchedule: {
            timezone: 'UTC',
          },
          stopSchedule: {
            timezone: 'UTC',
          },
        },
        {
          type: DatabaseType.INSTANCE,
          identifiers: ['db-instance-1a'],
          startSchedule: {
            timezone: 'UTC',
          },
          stopSchedule: {
            timezone: 'UTC',
          },
        },
      ],
    });

    const template = Template.fromStack(stack);

    // Schedule execution role
    it('Should have schedule execution role', async () => {
      template.hasResourceProperties('AWS::IAM::Role', Match.objectEquals({
        RoleName: Match.stringLikeRegexp('stop-db-schedule-.*-exec-role'),
        AssumeRolePolicyDocument: Match.objectEquals({
          Version: '2012-10-17',
          Statement: Match.arrayWith([
            Match.objectEquals({
              Effect: 'Allow',
              Principal: {
                Service: 'scheduler.amazonaws.com',
              },
              Action: 'sts:AssumeRole',
            }),
          ]),
        }),
        Policies: Match.arrayEquals([
          {
            PolicyName: 'rds-instance-stop-policy',
            PolicyDocument: Match.objectEquals({
              Version: '2012-10-17',
              Statement: [
                Match.objectEquals({
                  Effect: 'Allow',
                  Action: Match.arrayEquals([
                    'rds:StopDBInstance',
                    'rds:StartDBInstance',
                  ]),
                  Resource: {
                    'Fn::Join': [
                      '',
                      [
                        'arn:aws:rds:*:',
                        {
                          Ref: 'AWS::AccountId',
                        },
                        ':db:*',
                      ],
                    ],
                  },
                }),
              ],
            }),
          },
          {
            PolicyName: 'rds-cluster-stop-policy',
            PolicyDocument: Match.objectEquals({
              Version: '2012-10-17',
              Statement: [
                Match.objectEquals({
                  Effect: 'Allow',
                  Action: Match.arrayEquals([
                    'rds:StopDBCluster',
                    'rds:StartDBCluster',
                  ]),
                  Resource: {
                    'Fn::Join': [
                      '',
                      [
                        'arn:aws:rds:*:',
                        {
                          Ref: 'AWS::AccountId',
                        },
                        ':cluster:*',
                      ],
                    ],
                  },
                }),
              ],
            }),
          },
        ]),
      }));
    });

    // Start Cluster Schedule testing
    it('Should have Cluster Start Schedule', async () => {
      template.hasResourceProperties('AWS::Scheduler::Schedule', Match.objectEquals({
        Name: Match.stringLikeRegexp('auto-start-db-cluster-.*-schedule'),
        Description: Match.anyValue(),
        State: 'ENABLED',
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        ScheduleExpressionTimezone: 'UTC',
        ScheduleExpression: 'cron(50 7 ? * MON-FRI *)',
        Target: Match.objectEquals({
          Arn: 'arn:aws:scheduler:::aws-sdk:rds:startDBCluster',
          RoleArn: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('SchedulerExecutionRole.*'),
              'Arn',
            ],
          },
          Input: Match.stringLikeRegexp('{"DbClusterIdentifier":"db-cluster-1a"}'),
          RetryPolicy: {
            MaximumEventAgeInSeconds: 60,
            MaximumRetryAttempts: 0,
          },
        }),
      }));
    });

    // Stop Cluster Schedule testing
    it('Should have Cluster Stop Schedule', async () => {
      template.hasResourceProperties('AWS::Scheduler::Schedule', Match.objectEquals({
        Name: Match.stringLikeRegexp('auto-stop-db-cluster-.*-schedule'),
        Description: Match.anyValue(),
        State: 'ENABLED',
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        ScheduleExpressionTimezone: 'UTC',
        ScheduleExpression: 'cron(10 21 ? * MON-FRI *)',
        Target: Match.objectEquals({
          Arn: 'arn:aws:scheduler:::aws-sdk:rds:stopDBCluster',
          RoleArn: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('SchedulerExecutionRole.*'),
              'Arn',
            ],
          },
          Input: Match.stringLikeRegexp('{"DbClusterIdentifier":"db-cluster-1a"}'),
          RetryPolicy: {
            MaximumEventAgeInSeconds: 60,
            MaximumRetryAttempts: 0,
          },
        }),
      }));
    });

    // Start Instance Schedule testing
    it('Should have Instance Start Schedule', async () => {
      template.hasResourceProperties('AWS::Scheduler::Schedule', Match.objectEquals({
        Name: Match.stringLikeRegexp('auto-start-db-instance-.*-schedule'),
        Description: Match.anyValue(),
        State: 'ENABLED',
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        ScheduleExpressionTimezone: 'UTC',
        ScheduleExpression: 'cron(50 7 ? * MON-FRI *)',
        Target: Match.objectEquals({
          Arn: 'arn:aws:scheduler:::aws-sdk:rds:startDBInstance',
          RoleArn: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('SchedulerExecutionRole.*'),
              'Arn',
            ],
          },
          Input: Match.stringLikeRegexp('{"DbInstanceIdentifier":"db-instance-1a"}'),
          RetryPolicy: {
            MaximumEventAgeInSeconds: 60,
            MaximumRetryAttempts: 0,
          },
        }),
      }));
    });

    // Stop Instance Schedule testing
    it('Should have Instance Stop Schedule', async () => {
      template.hasResourceProperties('AWS::Scheduler::Schedule', Match.objectEquals({
        Name: Match.stringLikeRegexp('auto-stop-db-instance-.*-schedule'),
        Description: Match.anyValue(),
        State: 'ENABLED',
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        ScheduleExpressionTimezone: 'UTC',
        ScheduleExpression: 'cron(10 21 ? * MON-FRI *)',
        Target: Match.objectEquals({
          Arn: 'arn:aws:scheduler:::aws-sdk:rds:stopDBInstance',
          RoleArn: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('SchedulerExecutionRole.*'),
              'Arn',
            ],
          },
          Input: Match.stringLikeRegexp('{"DbInstanceIdentifier":"db-instance-1a"}'),
          RetryPolicy: {
            MaximumEventAgeInSeconds: 60,
            MaximumRetryAttempts: 0,
          },
        }),
      }));
    });

    it('Should match snapshot', async () => {
      expect(template.toJSON()).toMatchSnapshot('default');
    });

  });

});