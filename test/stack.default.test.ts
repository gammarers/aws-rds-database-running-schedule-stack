import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { RDSDatabaseRunningScheduleStack } from '../src';

describe('RdsDatabaseRunningScheduler Default Testing', () => {

  describe('default schedule', () => {
    const app = new App();

    const stack = new RDSDatabaseRunningScheduleStack(app, 'RDSDatabaseRunningScheduleStack', {
      targetResource: {
        tagKey: 'WorkHoursRunning',
        tagValues: ['YES'],
      },
    });

    const template = Template.fromStack(stack);

    it('Should have Schedule 2 exist', async () => {
      template.resourceCountIs('AWS::Scheduler::Schedule', 2);
    });

    it('Should have Schedule 2 exist', async () => {
      template.resourceCountIs('AWS::Scheduler::Schedule', 2);
    });

    // Stop Instance Schedule testing
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