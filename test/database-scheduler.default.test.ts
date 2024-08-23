import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { RdsDatabaseRunningScheduleStack } from '../src';

describe('RdsDatabaseRunningScheduler Default Testing', () => {

  describe('default schedule', () => {
    const app = new App();

    const stack = new RdsDatabaseRunningScheduleStack(app, 'RdsDatabaseRunningScheduleStack', {
      targetResource: {
        tagKey: 'WorkHoursRunning',
        tagValues: ['YES'],
      },
    });

    const template = Template.fromStack(stack);

    // Schedule execution role
    it('Should have state machine execution role from sheduler', async () => {
      template.hasResourceProperties('AWS::IAM::Role', Match.objectEquals({
        RoleName: Match.stringLikeRegexp('rds-db-running-scheduler-.*-exec-role'),
        Description: Match.anyValue(),
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
            PolicyName: 'state-machine-exec-policy',
            PolicyDocument: Match.objectEquals({
              Version: '2012-10-17',
              Statement: [
                Match.objectEquals({
                  Effect: 'Allow',
                  Action: 'states:StartExecution',
                  Resource: {
                    Ref: Match.stringLikeRegexp('StateMachine'),
                  },
                }),
              ],
            }),
          },
        ]),
      }));
    });

    it('Should have Schedule 4 exist', async () => {
      template.resourceCountIs('AWS::Scheduler::Schedule', 4);
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