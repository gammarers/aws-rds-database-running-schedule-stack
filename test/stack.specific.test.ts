import { ResourceNamingType } from '@gammarers/aws-resource-naming';
import { App, Duration } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { RDSDatabaseRunningScheduleStack } from '../src';

describe('RdsDatabaseRunningScheduler Specific Testing', () => {

  describe('specify schedule', () => {
    const app = new App();

    const stack = new RDSDatabaseRunningScheduleStack(app, 'RDSDatabaseRunningScheduleStack', {
      targetResource: {
        tagKey: 'WorkHoursRunning',
        tagValues: ['YES'],
      },
      enableScheduling: true,
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
      notifications: {
        emails: [
          'foo@example.com',
          'bar@example.net',
        ],
        slack: {
          webhookSecretName: 'example/slack/webhook',
        },
      },
      resourceNamingOption: {
        type: ResourceNamingType.AUTO,
      },
      timeoutOption: {
        stateMachineTimeout: Duration.seconds(30),
      },
    });

    const template = Template.fromStack(stack);

    it('Should have Schedule 2 exist', async () => {
      template.resourceCountIs('AWS::Scheduler::Schedule', 2);
    });

    it('Should have Schedule default setting', async () => {
      template.allResourcesProperties('AWS::Scheduler::Schedule', {
        State: 'ENABLED',
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        Target: {
          Arn: {
            Ref: Match.stringLikeRegexp('StateMachine'),
          },
          RoleArn: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('SchedulerExecutionRole'),
              'Arn',
            ],
          },
          Input: Match.anyValue(),
          RetryPolicy: {
            MaximumEventAgeInSeconds: 60,
            MaximumRetryAttempts: 0,
          },
        },
      });
    });

    it('Should match snapshot', async () => {
      expect(template.toJSON()).toMatchSnapshot();
    });

  });
});