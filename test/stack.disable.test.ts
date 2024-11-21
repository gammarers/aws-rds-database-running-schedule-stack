import { App } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { RDSDatabaseRunningScheduleStack } from '../src';

describe('RdsDatabaseRunningScheduler disabled Testing', () => {
  const app = new App();

  const stack = new RDSDatabaseRunningScheduleStack(app, 'RDSDatabaseRunningScheduleStack', {
    targetResource: {
      tagKey: 'WorkHoursRunning',
      tagValues: ['YES'],
    },
    enableScheduling: false,
  });

  const template = Template.fromStack(stack);

  it('Should have Schedule 2 exist', async () => {
    template.resourceCountIs('AWS::Scheduler::Schedule', 2);
  });

  it('Should have diabled all Schedule', async () => {
    template.allResourcesProperties('AWS::Scheduler::Schedule', {
      State: 'DISABLED',
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