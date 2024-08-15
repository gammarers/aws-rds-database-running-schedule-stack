import { App } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { DatabaseType, RdsDatabaseRunningScheduleStack } from '../src';

describe('RdsDatabaseRunningScheduler Specific Testing', () => {

  describe('specify schedule', () => {
    const app = new App();

    const stack = new RdsDatabaseRunningScheduleStack(app, 'RdsDatabaseRunningScheduleStack', {
      targets: [
        {
          type: DatabaseType.CLUSTER,
          identifiers: ['db-cluster-1a'],
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
        {
          type: DatabaseType.INSTANCE,
          identifiers: ['db-instance-1a'],
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
      ],
    });

    const template = Template.fromStack(stack);

    // Start Schedule testing
    it('Should have Cluster Start Schedule', async () => {
      template.hasResourceProperties('AWS::Scheduler::Schedule', Match.objectEquals({
        Name: Match.stringLikeRegexp('auto-start-db-cluster-.*-schedule'),
        Description: Match.anyValue(),
        State: 'ENABLED',
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        ScheduleExpressionTimezone: 'Asia/Tokyo',
        ScheduleExpression: 'cron(55 8 ? * MON-FRI *)',
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

    // Stop Schedule testing
    it('Should have Cluster Stop Schedule', async () => {
      template.hasResourceProperties('AWS::Scheduler::Schedule', Match.objectEquals({
        Name: Match.stringLikeRegexp('auto-stop-db-cluster-.*-schedule'),
        Description: Match.anyValue(),
        State: 'ENABLED',
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        ScheduleExpressionTimezone: 'Asia/Tokyo',
        ScheduleExpression: 'cron(5 19 ? * MON-FRI *)',
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
        ScheduleExpressionTimezone: 'Asia/Tokyo',
        ScheduleExpression: 'cron(55 8 ? * MON-FRI *)',
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
        ScheduleExpressionTimezone: 'Asia/Tokyo',
        ScheduleExpression: 'cron(5 19 ? * MON-FRI *)',
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
      expect(template.toJSON()).toMatchSnapshot('specify');
    });

  });
});