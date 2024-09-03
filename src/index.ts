import * as crypto from 'crypto';
import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

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
}

export class RDSDatabaseRunningScheduleStack extends Stack {
  constructor(scope: Construct, id: string, props: RDSDatabaseRunningScheduleStackProps) {
    super(scope, id, props);

    const account = cdk.Stack.of(this).account;
    //const stackName: string = cdk.Stack.of(this).stackName;
    //const region = cdk.Stack.of(this).region;

    // 👇 Create random 8 length string
    const random = crypto.createHash('shake256', { outputLength: 4 })
      .update(`${cdk.Names.uniqueId(scope)}-${cdk.Names.uniqueId(this)}`)
      .digest('hex');

    // 👇 SNS Topic for notifications
    const topic: sns.Topic = new sns.Topic(this, 'NotificationTopic', {
      topicName: `rds-db-running-schedule-notification-${random}-topic`,
      displayName: 'RDS DB Running Schedule Notification Topic',
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
    const dbInstanceStateChangeSucceed = new sfn.Succeed(this, 'DBInstanceStateChangeSucceed');
    const dbClusterStateChangeSucceed = new sfn.Succeed(this, 'DBClusterStateChangeSucceed');

    const generateTopicContent = new sfn.Pass(this, 'GenerateTopicSubject', {
      resultPath: '$.Generate.Topic.Subject',
      parameters: {
        Value: sfn.JsonPath.format('{} [{}] AWS RDS DB {} Running Notification [{}][{}]',
          sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringAt('$.definition.stateList[?(@.state == $.Result.DBInstance.CurrentStatus)].emoji'), 0),
          sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringAt('$.definition.stateList[?(@.state == $.Result.DBInstance.CurrentStatus)].name'), 0),
          sfn.JsonPath.stringAt('$.params.Mode'),
          sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.TargetResource'), ':'), 4), // account
          sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.TargetResource'), ':'), 3), // region
        ),
      },
    }).next(new sfn.Pass(this, 'GenerateTopicTextMessage', {
      resultPath: '$.Generate.Topic.Message',
      parameters: {
        Value: sfn.JsonPath.format('Account : {}\nRegion : {}\nType : {}\nStatus : {}',
          sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.TargetResource'), ':'), 4), // account
          sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.TargetResource'), ':'), 3), // region
          sfn.JsonPath.stringAt('$.params.Type'),
          sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringAt('$.definition.stateList[?(@.state == $.Result.DBInstance.CurrentStatus)].name'), 0),
        ),
      },
    }).next(new tasks.SnsPublish(this, 'SendNotification', {
      topic: topic,
      subject: sfn.JsonPath.stringAt('$.Generate.Topic.Subject.Value'),
      message: sfn.TaskInput.fromJsonPathAt('$.Generate.Topic.Message.Value'),
      resultPath: '$.snsResult',
    }).next(dbInstanceStateChangeSucceed)));

    // 👇 Get DB Instance Resources (Filter by Tag)
    const getDBInstanceResources = new tasks.CallAwsService(this, 'GetDBInstanceResources', {
      iamResources: ['*'],
      iamAction: 'tag:GetResources',
      service: 'resourcegroupstaggingapi',
      action: 'getResources',
      parameters: {
        ResourceTypeFilters: [
          'rds:db',
          // todo: ここにclusterも含める
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

    // 👇 Get DB Instance Resources (Filter by Tag)
    const getDBClusterResources = new tasks.CallAwsService(this, 'GetDBClusterResources', {
      iamResources: ['*'],
      iamAction: 'tag:GetResources',
      service: 'resourcegroupstaggingapi',
      action: 'getResources',
      parameters: {
        ResourceTypeFilters: [
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

    // 👇 Describe DB Instance Task
    const describeDBInstancesTask = new tasks.CallAwsService(this, 'DescribeDBInstances', {
      iamResources: [`arn:aws:rds:*:${account}:db:*`],
      service: 'rds',
      action: 'describeDBInstances',
      parameters: {
        DbInstanceIdentifier: sfn.JsonPath.stringAt('$.Result.TargetDBInstanceIdentifier'),
      },
      resultPath: '$.Result.DBInstance',
      resultSelector: {
        CurrentStatus: sfn.JsonPath.stringAt('$.DbInstances[0].DbInstanceStatus'),
      },
    });

    // 👇 Stop DB Instance Task
    const stopDBInstanceTask = new tasks.CallAwsService(this, 'StopDBInstance', {
      iamResources: [`arn:aws:rds:*:${account}:db:*`],
      service: 'rds',
      action: 'stopDBInstance',
      parameters: {
        DbInstanceIdentifier: sfn.JsonPath.stringAt('$.Result.TargetDBInstanceIdentifier'),
      },
      resultPath: '$.Result.StopDBInstance',
    });

    // 👇 Start DB Instance Task
    const startDBInstanceTask = new tasks.CallAwsService(this, 'StartDBInstance', {
      iamResources: [`arn:aws:rds:*:${account}:db:*`],
      service: 'rds',
      action: 'startDBInstance',
      parameters: {
        DbInstanceIdentifier: sfn.JsonPath.stringAt('$.Result.TargetDBInstanceIdentifier'),
      },
      resultPath: '$.Result.StartDBInstance',
    });

    // 👇 Describe DB Cluster Task
    const describeDBClustersTask = new tasks.CallAwsService(this, 'DescribeDBClusters', {
      iamResources: [`arn:aws:rds:*:${account}:cluster:*`],
      service: 'rds',
      action: 'describeDBClusters',
      parameters: {
        DbClusterIdentifier: sfn.JsonPath.stringAt('$.Result.TargetDBClusterIdentifier'),
      },
      resultPath: '$.Result.DBCluster',
      resultSelector: {
        CurrentStatus: sfn.JsonPath.stringAt('$.DbClusters[0].Status'),
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
        DbClusterIdentifier: sfn.JsonPath.stringAt('$.Result.TargetDBClusterIdentifier'),
      },
      resultPath: '$.Result.StopDBCluster',
    });

    // 👇 Stop DB Cluster Task
    const startDBClusterTask = new tasks.CallAwsService(this, 'StartDBCluster', {
      iamResources: [`arn:aws:rds:*:${account}:cluster:*`],
      service: 'rds',
      action: 'startDBCluster',
      parameters: {
        DbClusterIdentifier: sfn.JsonPath.stringAt('$.Result.TargetDBClusterIdentifier'),
      },
      resultPath: '$.Result.StartDBCluster',
    });

    const dbInstanceStatusChangeWait = new sfn.Wait(this, 'DBInstanceStatusChangeWait', {
      time: sfn.WaitTime.duration(cdk.Duration.minutes(1)),
    });
    dbInstanceStatusChangeWait.next(describeDBInstancesTask);
    startDBInstanceTask.next(dbInstanceStatusChangeWait);
    stopDBInstanceTask.next(dbInstanceStatusChangeWait);

    const dbClusterStatusChangeWait = new sfn.Wait(this, 'DBClusterStatusChangeWait', {
      time: sfn.WaitTime.duration(cdk.Duration.minutes(1)),
    });
    dbClusterStatusChangeWait.next(describeDBClustersTask);
    startDBClusterTask.next(dbClusterStatusChangeWait);
    stopDBClusterTask.next(dbClusterStatusChangeWait);

    const modeChoice = new sfn.Choice(this, 'ModeChoice')
      .when(
        sfn.Condition.stringEquals('$.Params.Type', 'Instance'),
        getDBInstanceResources.next(
          new sfn.Map(this, 'InstancesMap', {
            itemsPath: sfn.JsonPath.stringAt('$.Result.TargetResources'),
            parameters: {
              TargetResource: sfn.JsonPath.stringAt('$$.Map.Item.Value'),
              params: sfn.JsonPath.stringAt('$.Params'),
              definition: sfn.JsonPath.stringAt('$.definition'),
            },
            maxConcurrency: 10,
          }).itemProcessor(
            new sfn.Pass(this, 'GetDBInstanceIdentifier', {
              resultPath: '$.Result',
              parameters: {
                TargetDBInstanceIdentifier: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.TargetResource'), ':'), 6),
                // todo: ここでclusterかdbかを区別できる5indexを取得したら
              },
            }).next(
              describeDBInstancesTask.next(
                new sfn.Choice(this, 'DBInstanceStatusChoice')
                  // start on status.stopped
                  .when(
                    sfn.Condition.and(sfn.Condition.stringEquals('$.params.Mode', 'Start'), sfn.Condition.stringEquals('$.Result.DBInstance.CurrentStatus', 'stopped')),
                    startDBInstanceTask,
                  )
                  // stop on status.available
                  .when(
                    sfn.Condition.and(sfn.Condition.stringEquals('$.params.Mode', 'Stop'), sfn.Condition.stringEquals('$.Result.DBInstance.CurrentStatus', 'available')),
                    stopDBInstanceTask,
                  )
                  .when(
                    sfn.Condition.or(
                      sfn.Condition.and(sfn.Condition.stringEquals('$.params.Mode', 'Start'), sfn.Condition.stringEquals('$.Result.DBInstance.CurrentStatus', 'available')),
                      sfn.Condition.and(sfn.Condition.stringEquals('$.params.Mode', 'Stop'), sfn.Condition.stringEquals('$.Result.DBInstance.CurrentStatus', 'stopped')),
                    ),
                    generateTopicContent,
                  )
                  .when(
                    // start & starting/configuring-enhanced-monitoring/backing-up or stop modifying/stopping
                    sfn.Condition.or(
                      sfn.Condition.and(
                        sfn.Condition.and(
                          sfn.Condition.stringEquals('$.params.Mode', 'Start'),
                          sfn.Condition.or(
                            sfn.Condition.stringEquals('$.Result.DBInstance.CurrentStatus', 'starting'),
                            sfn.Condition.stringEquals('$.Result.DBInstance.CurrentStatus', 'configuring-enhanced-monitoring'),
                            sfn.Condition.stringEquals('$.Result.DBInstance.CurrentStatus', 'backing-up'),
                            sfn.Condition.stringEquals('$.Result.DBInstance.CurrentStatus', 'modifying'),
                          ),
                        ),
                      ),
                      sfn.Condition.and(
                        sfn.Condition.and(sfn.Condition.stringEquals('$.params.Mode', 'Stop'),
                          sfn.Condition.or(
                            sfn.Condition.stringEquals('$.Result.DBInstance.CurrentStatus', 'modifying'),
                            sfn.Condition.stringEquals('$.Result.DBInstance.CurrentStatus', 'stopping'),
                          ),
                        ),
                      ),
                    ),
                    dbInstanceStatusChangeWait,
                  )
                  .otherwise(new sfn.Fail(this, 'DBInstanceStatusFail', {
                    cause: 'db instance status fail.',
                  })),
              ),
            ))),
      )
      .when(
        sfn.Condition.stringEquals('$.Params.Type', 'Cluster'),
        getDBClusterResources.next(
          new sfn.Map(this, 'ClustersMap', {
            itemsPath: sfn.JsonPath.stringAt('$.Result.TargetResources'),
            parameters: {
              TargetResource: sfn.JsonPath.stringAt('$$.Map.Item.Value'),
              params: sfn.JsonPath.stringAt('$.Params'),
            },
            maxConcurrency: 10,
          }).itemProcessor(
            new sfn.Pass(this, 'GetDBClusterIdentifier', {
              resultPath: '$.Result',
              parameters: {
                TargetDBClusterIdentifier: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringSplit(sfn.JsonPath.stringAt('$.TargetResource'), ':'), 6),
              },
            }).next(
              describeDBClustersTask.next(
                new sfn.Choice(this, 'DBClusterStatusChoice')
                  // start on status.stopped
                  .when(
                    sfn.Condition.and(sfn.Condition.stringEquals('$.params.Mode', 'Start'), sfn.Condition.stringEquals('$.Result.DBCluster.CurrentStatus', 'stopped')),
                    startDBClusterTask,
                  )
                  // stop on status.available
                  .when(
                    sfn.Condition.and(sfn.Condition.stringEquals('$.params.Mode', 'Stop'), sfn.Condition.stringEquals('$.Result.DBCluster.CurrentStatus', 'available')),
                    stopDBClusterTask,
                  )
                  .when(
                    sfn.Condition.or(
                      sfn.Condition.and(sfn.Condition.stringEquals('$.params.Mode', 'Start'), sfn.Condition.stringEquals('$.Result.DBCluster.CurrentStatus', 'available')),
                      sfn.Condition.and(sfn.Condition.stringEquals('$.params.Mode', 'Stop'), sfn.Condition.stringEquals('$.Result.DBCluster.CurrentStatus', 'stopped')),
                    ),
                    dbClusterStateChangeSucceed,
                  )
                  .when(
                    // start & on state.starting/configuring-enhanced-monitoring/backing-up or stop modifying/stopping
                    sfn.Condition.or(
                      sfn.Condition.and(
                        sfn.Condition.and(
                          sfn.Condition.stringEquals('$.params.Mode', 'Start'),
                          sfn.Condition.or(
                            sfn.Condition.stringEquals('$.Result.DBCluster.CurrentStatus', 'starting'),
                            sfn.Condition.stringEquals('$.Result.DBCluster.CurrentStatus', 'configuring-enhanced-monitoring'),
                            sfn.Condition.stringEquals('$.Result.DBCluster.CurrentStatus', 'backing-up'),
                            sfn.Condition.stringEquals('$.Result.DBCluster.CurrentStatus', 'modifying'),
                          ),
                        ),
                      ),
                      sfn.Condition.and(
                        sfn.Condition.and(sfn.Condition.stringEquals('$.params.Mode', 'Stop'),
                          sfn.Condition.or(
                            sfn.Condition.stringEquals('$.Result.DBCluster.CurrentStatus', 'modifying'),
                            sfn.Condition.stringEquals('$.Result.DBCluster.CurrentStatus', 'stopping'),
                          ),
                        ),
                      ),
                    ),
                    dbClusterStatusChangeWait,
                  )
                  .otherwise(new sfn.Fail(this, 'DBClusterStatusFail', {
                    cause: 'db clusater status fail.',
                  })),
              ),
            ))),
      )
      .otherwise(new sfn.Fail(this, 'TypeChoiceFail', {
        cause: 'input Params Type is unmatch.',
      }));

    initStateListDefinition.next(modeChoice);

    // 👇 StepFunctions State Machine
    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      stateMachineName: `rds-db-running-schedule-${random}-state-machine`,
      definitionBody: sfn.DefinitionBody.fromChainable(initStateListDefinition),
    });

    // 👇 rename role name & description.
    const role = stateMachine.node.findChild('Role') as iam.Role;
    const cfnRole = role.node.defaultChild as iam.CfnRole;
    cfnRole.addPropertyOverride('RoleName', `rds-db-running-schedule-${random}-state-machine-role`);
    cfnRole.addPropertyOverride('Description', 'RDS DB Running chedule machine role.');
    const policy = role.node.findChild('DefaultPolicy') as iam.Policy;
    const cfnPolicy = policy.node.defaultChild as iam.CfnPolicy;
    cfnPolicy.addPropertyOverride('PolicyName', 'default-policy');

    // 👇 StateMachine Exec Role of Scheduler
    const schedulerExecRole = new iam.Role(this, 'SchedulerExecutionRole', {
      roleName: `rds-db-running-scheduler-${random}-exec-role`,
      description: 'RDS DB Running scheduler execution role',
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

    // 👇 Stop DB Instance schedule
    new DBRuningSchedule(this, 'StopDBInstanceSchedule', {
      name: `rds-db-instance-stop-${random}-schedule`,
      description: 'stop db instance schedule.',
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
        input: { type: 'Instance', mode: 'Stop' },
      },
    });

    // 👇 Start DB Instance schedule
    new DBRuningSchedule(this, 'StartDBInstanceSchedule', {
      name: `rds-db-instance-start-${random}-schedule`,
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
        input: { type: 'Instance', mode: 'Start' },
      },
    });

    // 👇 Stop DB Cluster schedule
    new DBRuningSchedule(this, 'StopDBClusterSchedule', {
      name: `rds-db-cluster-stop-${random}-schedule`,
      description: 'stop db cluster schedule.',
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
        input: { type: 'Cluster', mode: 'Stop' },
      },
    });

    // 👇 Start DB Cluster schedule
    new DBRuningSchedule(this, 'StartDBClusterSchedule', {
      name: `rds-db-cluster-start-${random}-schedule`,
      description: 'start db cluster schedule.',
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
        input: { type: 'Cluster', mode: 'Start' },
      },
    });

  }
}

interface DBRuningScheduleProps {
  name: string;
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
      type: string;
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
            Type: props.target.input.type,
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
