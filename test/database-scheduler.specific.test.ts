import { App } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { RdsDatabaseRunningScheduleStack } from '../src';

describe('RdsDatabaseRunningScheduler Specific Testing', () => {

  describe('specify schedule', () => {
    const app = new App();

    const stack = new RdsDatabaseRunningScheduleStack(app, 'RdsDatabaseRunningScheduleStack', {
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
    });

    const template = Template.fromStack(stack);

    it('Should have Schedule 4 exist', async () => {
      template.resourceCountIs('AWS::Scheduler::Schedule', 4);
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