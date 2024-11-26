import { ResourceAutoNaming, ResourceDefaultNaming, ResourceNaming, ResourceNamingOptions, ResourceNamingType } from '@gammarers/aws-resource-naming';
import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export { ResourceAutoNaming, ResourceDefaultNaming, ResourceNamingOptions, ResourceNamingType };

export interface CustomNaming {
  readonly type: ResourceNamingType.CUSTOM;
  readonly notificationTopicName: string;
  readonly notificationTopicDisplayName: string;
  readonly stateMachineName: string;
  readonly stateMachineRoleName: string;
  readonly schedulerRoleName: string;
  readonly startScheduleName: string;
  readonly stopScheduleName: string;
}

export type ResourceNamingOption = ResourceDefaultNaming | ResourceAutoNaming | CustomNaming;

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

export interface NotificationsProperty {
  readonly emails?: string[];
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

    // 👇 Get account
    const account = cdk.Stack.of(this).account;

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
    const names = ResourceNaming.naming(autoNaming, props.resourceNamingOption as ResourceNamingOptions);


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

    const initStateListDefinition: sfn.Pass = new sfn.Pass(this, 'InitStateListDefinition', {
      result: sfn.Result.fromObject([
        { name: 'AVAILABLE', emoji: '🤩', state: 'available' },
        { name: 'STOPPED', emoji: '😴', state: 'stopped' },
      ]),
      resultPath: '$.definition.stateList',
    });

    // 👇 Succeed
    const stateChangeSucceed = new sfn.Succeed(this, 'StateChangeSucceed');

    const prepareTopicValue = new sfn.Pass(this, 'PrepareTopicValue', {
      resultPath: '$.prepare.topic.values',
      parameters: {
        emoji: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringAt('$.definition.stateList[?(@.state == $.Result.status.current)].emoji'), 0),
        status: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringAt('$.definition.stateList[?(@.state == $.Result.status.current)].name'), 0),
        account: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.TargetResource'), ':'), 4), // account
        region: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.TargetResource'), ':'), 3), // region
      },
    }).next(new sfn.Pass(this, 'GenerateTopic', {
      resultPath: '$.Generate.Topic',
      parameters: {
        Subject: sfn.JsonPath.format('{} [{}] AWS RDS DB {} Running Notification [{}][{}]',
          sfn.JsonPath.stringAt('$.prepare.topic.values.emoji'),
          sfn.JsonPath.stringAt('$.prepare.topic.values.status'),
          sfn.JsonPath.stringAt('$.params.Mode'),
          sfn.JsonPath.stringAt('$.prepare.topic.values.account'),
          sfn.JsonPath.stringAt('$.prepare.topic.values.region'),
        ),
        TextMessage: sfn.JsonPath.format('Account : {}\nRegion : {}\nType : {}\nIdentifier : {}\nStatus : {}',
          sfn.JsonPath.stringAt('$.prepare.topic.values.account'),
          sfn.JsonPath.stringAt('$.prepare.topic.values.region'),
          sfn.JsonPath.stringAt('$.Result.target.type'),
          sfn.JsonPath.stringAt('$.Result.target.identifier'),
          sfn.JsonPath.stringAt('$.prepare.topic.values.status'),
        ),
      },
    }).next(new tasks.SnsPublish(this, 'SendNotification', {
      topic: topic,
      subject: sfn.JsonPath.stringAt('$.Generate.Topic.Subject'),
      message: sfn.TaskInput.fromJsonPathAt('$.Generate.Topic.TextMessage'),
      resultPath: '$.snsResult',
    }).next(stateChangeSucceed)));

    // 👇 Get DB Instance Resources (Filter by Tag)
    const getResources = new tasks.CallAwsService(this, 'GetResources', {
      iamResources: ['*'],
      iamAction: 'tag:GetResources',
      service: 'resourcegroupstaggingapi',
      action: 'getResources',
      parameters: {
        ResourceTypeFilters: [
          'rds:db',
          'rds:cluster',
        ],
        TagFilters: [
          {
            Key: sfn.JsonPath.stringAt('$.Params.TagKey'),
            Values: sfn.JsonPath.stringAt('$.Params.TagValues'),
          },
        ],
      },
      resultPath: '$.Result',
      resultSelector: {
        TargetResources: sfn.JsonPath.stringAt('$..ResourceTagMappingList[*].ResourceARN'),
      },
    });

    initStateListDefinition.next(getResources);

    // 👇 Describe DB Instance Task
    const describeDBInstancesTask = new tasks.CallAwsService(this, 'DescribeDBInstances', {
      iamResources: [`arn:aws:rds:*:${account}:db:*`],
      service: 'rds',
      action: 'describeDBInstances',
      parameters: {
        DbInstanceIdentifier: sfn.JsonPath.stringAt('$.Result.target.identifier'),
      },
      resultPath: '$.Result.status',
      resultSelector: {
        current: sfn.JsonPath.stringAt('$.DbInstances[0].DbInstanceStatus'),
      },
    });

    // 👇 Stop DB Instance Task
    const stopDBInstanceTask = new tasks.CallAwsService(this, 'StopDBInstance', {
      iamResources: [`arn:aws:rds:*:${account}:db:*`],
      service: 'rds',
      action: 'stopDBInstance',
      parameters: {
        DbInstanceIdentifier: sfn.JsonPath.stringAt('$.Result.target.identifier'),
      },
      resultPath: '$.Result.StopDBInstance',
    });

    // 👇 Start DB Instance Task
    const startDBInstanceTask = new tasks.CallAwsService(this, 'StartDBInstance', {
      iamResources: [`arn:aws:rds:*:${account}:db:*`],
      service: 'rds',
      action: 'startDBInstance',
      parameters: {
        DbInstanceIdentifier: sfn.JsonPath.stringAt('$.Result.target.identifier'),
      },
      resultPath: '$.Result.StartDBInstance',
    });

    // 👇 Describe DB Cluster Task
    const describeDBClustersTask = new tasks.CallAwsService(this, 'DescribeDBClusters', {
      iamResources: [`arn:aws:rds:*:${account}:cluster:*`],
      service: 'rds',
      action: 'describeDBClusters',
      parameters: {
        DbClusterIdentifier: sfn.JsonPath.stringAt('$.Result.target.identifier'),
      },
      resultPath: '$.Result.status',
      resultSelector: {
        current: sfn.JsonPath.stringAt('$.DbClusters[0].Status'),
      },
    });

    const handleDbClusterNotFound = new sfn.Pass(this, 'HandleDbClusterNotFound', {
      result: sfn.Result.fromObject({
        message: 'DB Cluster not found, but continuing...',
      }),
    });

    describeDBClustersTask.addCatch(handleDbClusterNotFound, {
      errors: ['Rds.DbClusterNotFoundException'],
    });

    // 👇 Stop DB Cluster Task
    const stopDBClusterTask = new tasks.CallAwsService(this, 'StopDBCluster', {
      iamResources: [`arn:aws:rds:*:${account}:cluster:*`],
      service: 'rds',
      action: 'stopDBCluster',
      parameters: {
        DbClusterIdentifier: sfn.JsonPath.stringAt('$.Result.target.identifier'),
      },
      resultPath: '$.Result.StopDBCluster',
    });

    // 👇 Stop DB Cluster Task
    const startDBClusterTask = new tasks.CallAwsService(this, 'StartDBCluster', {
      iamResources: [`arn:aws:rds:*:${account}:cluster:*`],
      service: 'rds',
      action: 'startDBCluster',
      parameters: {
        DbClusterIdentifier: sfn.JsonPath.stringAt('$.Result.target.identifier'),
      },
      resultPath: '$.Result.StartDBCluster',
    });

    const describeTypeChoice = new sfn.Choice(this, 'DescribeTypeChoice')
      .when(
        sfn.Condition.stringEquals('$.Result.target.type', 'db'),
        describeDBInstancesTask,
      )
      .when(
        sfn.Condition.stringEquals('$.Result.target.type', 'cluster'),
        describeDBClustersTask,
      )
      .otherwise(new sfn.Fail(this, 'UnknownType'));

    const statusChangeWait = new sfn.Wait(this, 'StatusChangeWait', {
      time: sfn.WaitTime.duration(cdk.Duration.minutes(1)),
    });
    statusChangeWait.next(describeTypeChoice);

    startDBInstanceTask.next(statusChangeWait);
    stopDBInstanceTask.next(statusChangeWait);

    startDBClusterTask.next(statusChangeWait);
    stopDBClusterTask.next(statusChangeWait);

    const statusChoice = new sfn.Choice(this, 'StatusChoice')
      // db instance start on status.stopped
      .when(
        sfn.Condition.and(
          sfn.Condition.stringEquals('$.params.Mode', 'Start'),
          sfn.Condition.stringEquals('$.Result.target.type', 'db'),
          sfn.Condition.stringEquals('$.Result.status.current', 'stopped'),
        ),
        startDBInstanceTask,
      )
      // db instance stop on status.available
      .when(
        sfn.Condition.and(
          sfn.Condition.stringEquals('$.params.Mode', 'Stop'),
          sfn.Condition.stringEquals('$.Result.target.type', 'db'),
          sfn.Condition.stringEquals('$.Result.status.current', 'available'),
        ),
        stopDBInstanceTask,
      )
      // start on status.stopped
      .when(
        sfn.Condition.and(
          sfn.Condition.stringEquals('$.params.Mode', 'Start'),
          sfn.Condition.stringEquals('$.Result.target.type', 'cluster'),
          sfn.Condition.stringEquals('$.Result.status.current', 'stopped'),
        ),
        startDBClusterTask,
      )
      // stop on status.available
      .when(
        sfn.Condition.and(
          sfn.Condition.stringEquals('$.params.Mode', 'Stop'),
          sfn.Condition.stringEquals('$.Result.target.type', 'cluster'),
          sfn.Condition.stringEquals('$.Result.status.current', 'available'),
        ),
        stopDBClusterTask,
      )
      // status change succeed, generate topic
      .when(
        sfn.Condition.or(
          sfn.Condition.and(
            sfn.Condition.stringEquals('$.params.Mode', 'Start'),
            sfn.Condition.or(
              sfn.Condition.stringEquals('$.Result.target.type', 'db'),
              sfn.Condition.stringEquals('$.Result.target.type', 'cluster'),
            ),
            sfn.Condition.stringEquals('$.Result.status.current', 'available'),
          ),
          sfn.Condition.and(
            sfn.Condition.stringEquals('$.params.Mode', 'Stop'),
            sfn.Condition.or(
              sfn.Condition.stringEquals('$.Result.target.type', 'db'),
              sfn.Condition.stringEquals('$.Result.target.type', 'cluster'),
            ),
            sfn.Condition.stringEquals('$.Result.status.current', 'stopped'),
          ),
        ),
        prepareTopicValue,
      )
      .when(
        // start & starting/configuring-enhanced-monitoring/backing-up or stop modifying/stopping
        sfn.Condition.or(
          sfn.Condition.and(
            sfn.Condition.and(
              sfn.Condition.stringEquals('$.params.Mode', 'Start'),
              sfn.Condition.or(
                sfn.Condition.stringEquals('$.Result.target.type', 'db'),
                sfn.Condition.stringEquals('$.Result.target.type', 'cluster'),
              ),
              sfn.Condition.or(
                sfn.Condition.stringEquals('$.Result.status.current', 'starting'),
                sfn.Condition.stringEquals('$.Result.status.current', 'configuring-enhanced-monitoring'),
                sfn.Condition.stringEquals('$.Result.status.current', 'backing-up'),
                sfn.Condition.stringEquals('$.Result.status.current', 'modifying'),
              ),
            ),
          ),
          sfn.Condition.and(
            sfn.Condition.and(
              sfn.Condition.stringEquals('$.params.Mode', 'Stop'),
              sfn.Condition.or(
                sfn.Condition.stringEquals('$.Result.target.type', 'db'),
                sfn.Condition.stringEquals('$.Result.target.type', 'cluster'),
              ),
              sfn.Condition.or(
                sfn.Condition.stringEquals('$.Result.status.current', 'modifying'),
                sfn.Condition.stringEquals('$.Result.status.current', 'stopping'),
              ),
            ),
          ),
        ),
        statusChangeWait,
      )
      .otherwise(new sfn.Fail(this, 'StatusFail', {
        cause: 'db instance or cluster status fail.',
      }));

    getResources.next(
      new sfn.Map(this, 'ResourceProcessingMap', {
        itemsPath: sfn.JsonPath.stringAt('$.Result.TargetResources'),
        parameters: {
          TargetResource: sfn.JsonPath.stringAt('$$.Map.Item.Value'),
          params: sfn.JsonPath.stringAt('$.Params'),
          definition: sfn.JsonPath.stringAt('$.definition'),
        },
        maxConcurrency: 10,
      }).itemProcessor(
        new sfn.Pass(this, 'GetIdentifier', {
          resultPath: '$.Result.target',
          parameters: {
            identifier: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.TargetResource'), ':'), 6),
            type: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.TargetResource'), ':'), 5), // db or cluster
          },
        }).next(describeTypeChoice)));

    describeDBInstancesTask.next(statusChoice);
    describeDBClustersTask.next(statusChoice);

    // 👇 StepFunctions State Machine
    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      stateMachineName: names.stateMachineName,
      definitionBody: sfn.DefinitionBody.fromChainable(initStateListDefinition),
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
