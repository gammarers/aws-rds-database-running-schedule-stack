import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { RdsDatabaseRunningScheduler, Type } from '../src';

describe('RdsDatabaseRunningScheduler Type=Instance Testing', () => {

  describe('default schedule', () => {
    const app = new App();
    const stack = new Stack(app, 'TestingStack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    new RdsDatabaseRunningScheduler(stack, 'RdsDatabaseRunningScheduler', {
      type: Type.INSTANCE,
      identifiers: {
        ['db-instance-1a']: {
          startSchedule: {
            timezone: 'UTC',
          },
          stopSchedule: {
            timezone: 'UTC',
          },
        },
      },
    });

    const template = Template.fromStack(stack);

    // Schedule execution role
    it('Should have schedule execution role', async () => {
      template.hasResourceProperties('AWS::IAM::Role', Match.objectEquals({
        RoleName: Match.stringLikeRegexp('stop-db-instance-schedule-.*-exec-role'),
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
                  Action: [
                    'rds:StopDBInstance',
                    'rds:StartDBInstance',
                  ],
                  Resource: 'arn:aws:rds:*:123456789012:db:*',
                }),
              ],
            }),
          },
        ]),
      }));
    });

    // Start Schedule testing
    it('Should have Start Schedule', async () => {
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
              Match.stringLikeRegexp('RdsDatabaseRunningSchedulerSchedulerExecutionRole.*'),
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

    // Stop Schedule testing
    it('Should have Stop Schedule', async () => {
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
              Match.stringLikeRegexp('RdsDatabaseRunningSchedulerSchedulerExecutionRole.*'),
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

  describe('specify schedule', () => {
    const app = new App();
    const stack = new Stack(app, 'TestingStack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    new RdsDatabaseRunningScheduler(stack, 'RdsDatabaseRunningScheduler', {
      type: Type.INSTANCE,
      identifiers: {
        ['db-instance-1a']: {
          startSchedule: {
            timezone: 'Asia/Tokyo',
            minute: '55',
            hour: '8',
            week: 'MON-FRI',
          },
          stopSchedule: {
            timezone: 'Asia/Tokyo',
            minute: '5',
            hour: '19',
            week: 'MON-FRI',
          },
        },
      },
    });

    const template = Template.fromStack(stack);

    // Start Schedule testing
    it('Should have Start Schedule', async () => {
      template.hasResourceProperties('AWS::Scheduler::Schedule', Match.objectEquals({
        Name: Match.stringLikeRegexp('auto-start-db-instance-.*-schedule'),
        Description: Match.anyValue(),
        State: 'ENABLED',
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        ScheduleExpressionTimezone: 'Asia/Tokyo',
        ScheduleExpression: 'cron(55 8 ? * MON-FRI *)',
        Target: Match.objectEquals({
          Arn: 'arn:aws:scheduler:::aws-sdk:rds:startDBInstance',
          RoleArn: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('RdsDatabaseRunningSchedulerSchedulerExecutionRole.*'),
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

    // Stop Schedule testing
    it('Should have Stop Schedule', async () => {
      template.hasResourceProperties('AWS::Scheduler::Schedule', Match.objectEquals({
        Name: Match.stringLikeRegexp('auto-stop-db-instance-.*-schedule'),
        Description: Match.anyValue(),
        State: 'ENABLED',
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        ScheduleExpressionTimezone: 'Asia/Tokyo',
        ScheduleExpression: 'cron(5 19 ? * MON-FRI *)',
        Target: Match.objectEquals({
          Arn: 'arn:aws:scheduler:::aws-sdk:rds:stopDBInstance',
          RoleArn: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('RdsDatabaseRunningSchedulerSchedulerExecutionRole.*'),
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
      expect(template.toJSON()).toMatchSnapshot('specify');
    });

  });
});