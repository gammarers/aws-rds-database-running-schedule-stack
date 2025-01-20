import { ResourceAutoNaming, ResourceDefaultNaming, ResourceNaming, ResourceNamingType } from '@gammarers/aws-resource-naming';
import { SNSSlackMessageLambdaSubscription } from '@gammarers/aws-sns-slack-message-lambda-subscription';
import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as sns from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import { RunningControlStateMachine } from './resources/running-control-state-machine';

export { ResourceAutoNaming, ResourceDefaultNaming, ResourceNamingType };

export interface ResourceCustomNaming {
  readonly type: ResourceNamingType.CUSTOM;
  readonly notificationTopicName: string;
  readonly notificationTopicDisplayName: string;
  readonly stateMachineName: string;
  readonly stateMachineRoleName: string;
  readonly schedulerRoleName: string;
  readonly startScheduleName: string;
  readonly stopScheduleName: string;
}

export type ResourceNamingOption = ResourceDefaultNaming | ResourceAutoNaming | ResourceCustomNaming;

export interface ScheduleProperty {
  readonly timezone: string;
  readonly minute?: string;
  readonly hour?: string;
  readonly week?: string;
}

export interface TargetResourceProperty {
  readonly tagKey: string;
  readonly tagValues: string[];
}

export interface Slack {
  readonly webhookSecretName: string;
}

export interface NotificationsProperty {
  readonly emails?: string[];
  readonly slack?: Slack;
}

export interface RDSDatabaseRunningScheduleStackProps extends StackProps {
  readonly targetResource: TargetResourceProperty;
  readonly enableScheduling?: boolean;
  readonly stopSchedule?: ScheduleProperty;
  readonly startSchedule?: ScheduleProperty;
  readonly notifications?: NotificationsProperty;
  readonly resourceNamingOption?: ResourceNamingOption;
}

export class RDSDatabaseRunningScheduleStack extends Stack {
  constructor(scope: Construct, id: string, props: RDSDatabaseRunningScheduleStackProps) {
    super(scope, id, props);

    // 👇 Create random 8 length string
    const random = ResourceNaming.createRandomString(`${cdk.Names.uniqueId(scope)}-${cdk.Names.uniqueId(this)}`);
    // 👇 Definition auto naming
    const autoNaming = {
      notificationTopicName: `rds-db-running-schedule-notification-${random}-topic`,
      notificationTopicDisplayName: 'RDS DB Running Schedule Notification Topic',
      stateMachineName: `rds-db-running-schedule-${random}-state-machine`,
      stateMachineRoleName: `rds-db-running-schedule-${random}-state-machine-role`,
      schedulerRoleName: `rds-db-running-scheduler-${random}-exec-role`,
      startScheduleName: `rds-database-running-stop-${random}-schedule`,
      stopScheduleName: `rds-database-running-start-${random}-schedule`,
    };
    // 👇　final naming
    const names = ResourceNaming.naming(autoNaming, props.resourceNamingOption as ResourceNaming.ResourceNamingOption);


    // 👇 SNS Topic for notifications
    const topic: sns.Topic = new sns.Topic(this, 'NotificationTopic', {
      topicName: names.notificationTopicName,
      displayName: names.notificationTopicDisplayName,
    });

    // 👇 Subscribe an email endpoint to the topic
    const emails = props.notifications?.emails ?? [];
    for (const [index, value] of emails.entries()) {
      new sns.Subscription(this, `SubscriptionEmail${index.toString().padStart(3, '0')}`, {
        topic,
        protocol: sns.SubscriptionProtocol.EMAIL,
        endpoint: value,
      });
    }

    // 👇 Subscription slack webhook
    if (props.notifications?.slack) {
      new SNSSlackMessageLambdaSubscription(this, 'SNSSlackMessageLambdaSubscription', {
        topic,
        slackWebhookSecretName: props.notifications.slack.webhookSecretName,
      });
    }


    // 👇 StepFunctions State Machine
    const stateMachine = new RunningControlStateMachine(this, 'StateMachine', {
      stateMachineName: names.stateMachineName,
      notificationTopic: topic,
    });

    // 👇 rename role name & description.
    if (names.stateMachineRoleName) {
      const role = stateMachine.node.findChild('Role') as iam.Role;
      const cfnRole = role.node.defaultChild as iam.CfnRole;
      cfnRole.addPropertyOverride('RoleName', names.stateMachineRoleName);
      cfnRole.addPropertyOverride('Description', 'RDS DB Running machine role.');
      const policy = role.node.findChild('DefaultPolicy') as iam.Policy;
      const cfnPolicy = policy.node.defaultChild as iam.CfnPolicy;
      cfnPolicy.addPropertyOverride('PolicyName', `rds-db-running-schedule-${random}-state-machine-policy`);
    }

    // 👇 StateMachine Exec Role of Scheduler
    const schedulerExecRole = new iam.Role(this, 'SchedulerExecutionRole', {
      roleName: names.schedulerRoleName,
      description: 'RDS DB Running scheduler role',
      assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
      inlinePolicies: {
        'state-machine-exec-policy': new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'states:StartExecution',
              ],
              resources: [
                stateMachine.stateMachineArn,
              ],
            }),
          ],
        }),
      },
    });

    // 👇 Schedule state
    const sheduleState: string = (() => {
      if (props.enableScheduling === undefined || props.enableScheduling) {
        return 'ENABLED';
      } else {
        return 'DISABLED';
      }
    })();

    // 👇 Stop Schedule expression
    const stopScheduleExpression: string = (() => {
      // default: weekday 21:10
      const minute: string = props.stopSchedule?.minute ?? '10';
      const hour: string = props.stopSchedule?.hour ?? '21';
      const week: string = props.stopSchedule?.week ?? 'MON-FRI';
      return `cron(${minute} ${hour} ? * ${week} *)`;
    })();

    // 👇 Start Schedule expression
    const startScheduleExpression: string = (() => {
      // default: weekday 07:50
      const minute: string = props.startSchedule?.minute ?? '50';
      const hour: string = props.startSchedule?.hour ?? '7';
      const week: string = props.startSchedule?.week ?? 'MON-FRI';
      return `cron(${minute} ${hour} ? * ${week} *)`;
    })();

    // 👇 Stop DB schedule
    new DBRuningSchedule(this, 'StopDatabaseRunningSchedule', {
      name: names.startScheduleName,
      description: 'stop database(instance/cluster) running stop schedule.',
      sheduleState,
      timezone: props.stopSchedule?.timezone ?? 'UTC',
      expression: stopScheduleExpression,
      target: {
        stateMachineArn: stateMachine.stateMachineArn,
        roleArn: schedulerExecRole.roleArn,
        resourceTag: {
          key: props.targetResource.tagKey,
          values: props.targetResource.tagValues,
        },
        input: { mode: 'Stop' },
      },
    });

    // 👇 Start DB schedule
    new DBRuningSchedule(this, 'StartDatabaseRunningSchedule', {
      name: names.stopScheduleName,
      description: 'start db instance schedule.',
      sheduleState,
      timezone: props.startSchedule?.timezone ?? 'UTC',
      expression: startScheduleExpression,
      target: {
        stateMachineArn: stateMachine.stateMachineArn,
        roleArn: schedulerExecRole.roleArn,
        resourceTag: {
          key: props.targetResource.tagKey,
          values: props.targetResource.tagValues,
        },
        input: { mode: 'Start' },
      },
    });

  }
}

interface DBRuningScheduleProps {
  name?: string;
  description: string;
  sheduleState: string;
  timezone: string;
  expression: string;
  target: {
    stateMachineArn: string;
    roleArn: string;
    resourceTag: {
      key: string;
      values: string[];
    };
    input: {
      mode: string;
    };
  };
}

class DBRuningSchedule extends scheduler.CfnSchedule {
  constructor(scope: Construct, id: string, props: DBRuningScheduleProps) {
    super(scope, id, {
      name: props.name,
      description: props.description,
      state: props.sheduleState,
      //groupName: scheduleGroup.name, // default
      flexibleTimeWindow: {
        mode: 'OFF',
      },
      scheduleExpressionTimezone: props.timezone,
      scheduleExpression: props.expression,
      target: {
        arn: props.target.stateMachineArn,
        roleArn: props.target.roleArn,
        input: JSON.stringify({
          Params: {
            TagKey: props.target.resourceTag.key,
            TagValues: props.target.resourceTag.values,
            Mode: props.target.input.mode,
          },
        }),
        retryPolicy: {
          maximumEventAgeInSeconds: 60,
          maximumRetryAttempts: 0,
        },
      },
    });
  }
}
