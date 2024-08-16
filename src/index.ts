import * as crypto from 'crypto';
import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export enum DatabaseType {
  CLUSTER = 'Cluster',
  INSTANCE = 'Instance',
}

export interface ScheduleProperty {
  readonly timezone: string;
  readonly minute?: string;
  readonly hour?: string;
  readonly week?: string;
}

export interface TargetProperty {
  readonly type: DatabaseType;
  readonly identifiers: string[];
  readonly stopSchedule: ScheduleProperty;
  readonly startSchedule: ScheduleProperty;
}

export interface RdsDatabaseRunningScheduleStackProps extends StackProps {
  readonly targets: TargetProperty[];
}

export class RdsDatabaseRunningScheduleStack extends Stack {
  constructor(scope: Construct, id: string, props: RdsDatabaseRunningScheduleStackProps) {
    super(scope, id, props);

    const account = cdk.Stack.of(this).account;
    //const stackName: string = cdk.Stack.of(this).stackName;
    //const region = cdk.Stack.of(this).region;

    const randomNameKey = crypto.createHash('shake256', { outputLength: 4 })
      .update(`${cdk.Names.uniqueId(scope)}-${cdk.Names.uniqueId(this)}`)
      .digest('hex');

    // 👇 Succeed
    const succeed = new sfn.Succeed(this, 'Succeed');

    // 👇 Get DB Instance Resources (Filter by Tag)
    const getDBInstanceResources = new tasks.CallAwsService(this, 'GetDBInstanceResources', {
      iamResources: ['*'],
      iamAction: 'tag:GetResources',
      service: 'resourcegroupstaggingapi',
      action: 'getResources',
      parameters: {
        ResourceTypeFilters: [
          'rds:db',
        ],
        TagFilters: [
          {
            'Key.$': '$.Input.TagKey',
            'Values.$': '$.Input.TagValues',
          },
        ],
      },
      resultPath: '$.Result',
      resultSelector: {
        'TargetResources.$': '$..ResourceTagMappingList[*].ResourceARN',
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
            'Key.$': '$.Input.TagKey',
            'Values.$': '$.Input.TagValues',
          },
        ],
      },
      resultPath: '$.Result',
      resultSelector: {
        'TargetResources.$': '$..ResourceTagMappingList[*].ResourceARN',
      },
    });

    // 👇 Describe DB Instance Task
    const describeDBInstancesTask = new tasks.CallAwsService(this, 'DescribeDBInstances', {
      iamResources: [`arn:aws:rds:*:${account}:db:*`],
      service: 'rds',
      action: 'describeDBInstances',
      parameters: {},
      resultPath: '$.Result',
      outputPath: '$.Result.DbInstances[?(@.DbInstanceIdentifier == $.TargetDBInstanceIdentifier)]',
    });

    // 👇 Stop DB Instance Task
    const stopDBInstanceTask = new tasks.CallAwsService(this, 'StopDBInstance', {
      iamResources: [`arn:aws:rds:*:${account}:db:*`],
      service: 'rds',
      action: 'stopDBInstance',
      parameters: {
        'DbInstanceIdentifier.$': '$[0].DbInstanceIdentifier',
      },
    }).next(succeed);

    // 👇 Start DB Instance Task
    const startDBInstanceTask = new tasks.CallAwsService(this, 'StartDBInstance', {
      iamResources: [`arn:aws:rds:*:${account}:db:*`],
      service: 'rds',
      action: 'stopDBInstance',
      parameters: {
        'DbInstanceIdentifier.$': '$[0].DbInstanceIdentifier',
      },
    }).next(succeed);

    // 👇 Describe DB Cluster Task
    const describeDBClustersTask = new tasks.CallAwsService(this, 'DescribeDBClusters', {
      iamResources: [`arn:aws:rds:*:${account}:cluster:*`],
      service: 'rds',
      action: 'describeDBClusters',
      parameters: {},
      resultPath: '$.Result',
      outputPath: '$.Result.DbClusters[?(@.DbClusterIdentifier == $.detail.SourceIdentifier)]',
    });

    // 👇 Stop DB Cluster Task
    const stopDBClusterTask = new tasks.CallAwsService(this, 'StopDBCluster', {
      iamResources: [`arn:aws:rds:*:${account}:cluster:*`],
      service: 'rds',
      action: 'stopDBCluster',
      parameters: {
        'DbClusterIdentifier.$': '$[0].DbClusterIdentifier',
      },
    }).next(succeed);

    // 👇 Stop DB Cluster Task
    const startDBClusterTask = new tasks.CallAwsService(this, 'StartDBCluster', {
      iamResources: [`arn:aws:rds:*:${account}:cluster:*`],
      service: 'rds',
      action: 'stopDBCluster',
      parameters: {
        'DbClusterIdentifier.$': '$[0].DbClusterIdentifier',
      },
    }).next(succeed);

    const startDBInstanceStatusChangeWait = new sfn.Wait(this, 'StartDBInstanceStatusChangeWait', {
      time: sfn.WaitTime.duration(cdk.Duration.minutes(1)),
    });

    const stopDBInstanceStatusChangeWait = new sfn.Wait(this, 'StopDBInstanceStatusChangeWait', {
      time: sfn.WaitTime.duration(cdk.Duration.minutes(1)),
    });

    const startDBClusterStatusChangeWait = new sfn.Wait(this, 'StartDBClusterStatusChangeWait', {
      time: sfn.WaitTime.duration(cdk.Duration.minutes(1)),
    });

    const stopDBClusterStatusChangeWait = new sfn.Wait(this, 'StopDBClusterStatusChangeWait', {
      time: sfn.WaitTime.duration(cdk.Duration.minutes(1)),
    });

    // Inputとして、モードを取得し、開始か終了かを取得
    // Inputとして、タイプを取得し、インスタンスかクラスターかを取得
    // インスタンスの場合
    //  リソースタグを使って、対象となるリソースを取得する
    //  リソースをそれぞれdescribeし起動中か停止中かを取得
    //  ・モードが開始でリソースが停止中の場合に、開始処理を実施する。それ以外の場合は、Skipして終了する（メールを送る？）。
    //  ・モードが停止でリソースが起動中の場合に、停止処理を実施する。それ以外の場合は、Skipして終了する（メールを送る？）。
    //    ・開始処理をしてWaiting=60sする
    //        開始モードの場合、開始していたら終了する。開始していなかったらWaitingを繰り返す。
    //        停止モードの場合、停止していたら終了する。開始していなかったらWaitingを繰り返す。
    // クラスターの場合
    //  リソースタグを使って、対象となるリソースを取得する
    //  リソースをそれぞれdescribeし起動中か停止中かを取得
    //  ・モードが開始でリソースが停止中の場合に、開始処理を実施する。それ以外の場合は、Skipして終了する（メールを送る？）。
    //  ・モードが停止でリソースが起動中の場合に、停止処理を実施する。それ以外の場合は、Skipして終了する（メールを送る？）。
    const modeChoice = new sfn.Choice(this, 'ModeChoice')
      .when(
        sfn.Condition.and(sfn.Condition.stringEquals('$.Input.Mode', 'Start'), sfn.Condition.stringEquals('$.Input.Type', 'Instance')),
        getDBInstanceResources.next(
          new sfn.Map(this, 'StartInstancesMap', {
            itemsPath: sfn.JsonPath.stringAt('$.Result.TargetResources'),
            maxConcurrency: 10,
          }).iterator(
            new sfn.Pass(this, 'GetStartDBInstanceIdentifier', {
              parameters: {
                'TargetDBInstanceIdentifier.$': "States.ArrayGetItem(States.StringSplit($, ':'), 6)",
              },
            }).next(
              describeDBInstancesTask.next(
                new sfn.Choice(this, 'StartDBInstanceStatusChoice').when(
                  sfn.Condition.stringEquals('$[0].DbInstanceStatus', 'stopped'),
                  startDBInstanceTask.next(startDBInstanceStatusChangeWait.next(describeDBInstancesTask.next(
                    new sfn.Choice(this, 'Choice')
                      .when(
                        sfn.Condition.stringEquals('$[0].DbInstanceStatus', 'starting'),
                        startDBInstanceStatusChangeWait,
                      )
                      .when(
                        sfn.Condition.stringEquals('$[0].DbInstanceStatus', 'available'),
                        succeed,
                      )
                      .otherwise(new sfn.Fail(this, 'StartDbInstanceStatusFail', {
                        cause: 'start db instance status fail.',
                      })),
                  ))),
                ),
              ),
            ))),
      )
      .when(
        sfn.Condition.and(sfn.Condition.stringEquals('$.Input.Mode', 'Stop'), sfn.Condition.stringEquals('$.Input.Type', 'Instance')),
        getDBInstanceResources.next(
          new sfn.Map(this, 'StopInstancesMap', {
            itemsPath: sfn.JsonPath.stringAt('$.Result.TargetResources'),
            maxConcurrency: 10,
          }).iterator(
            new sfn.Pass(this, 'GetStopDBInstanceIdentifier', {
              parameters: {
                'TargetDBInstanceIdentifier.$': "States.ArrayGetItem(States.StringSplit($, ':'), 6)",
              },
            }).next(
              describeDBInstancesTask.next(
                new sfn.Choice(this, 'StopDBInstanceStatusChoice').when(
                  sfn.Condition.stringEquals('$[0].DbInstanceStatus', 'available'),
                  stopDBInstanceTask.next(stopDBInstanceStatusChangeWait.next(describeDBInstancesTask.next(
                    new sfn.Choice(this, 'Choice')
                      .when(
                        sfn.Condition.stringEquals('$[0].DbInstanceStatus', 'stopping'),
                        stopDBInstanceStatusChangeWait,
                      )
                      .when(
                        sfn.Condition.stringEquals('$[0].DbInstanceStatus', 'stopped'),
                        succeed,
                      )
                      .otherwise(new sfn.Fail(this, 'StartDbInstanceStatusFail', {
                        cause: 'stop db instance status fail.',
                      })),
                  ))),
                ),
              ),
            ))),
      )
      .when(
        sfn.Condition.and(sfn.Condition.stringEquals('$.Input.Mode', 'Start'), sfn.Condition.stringEquals('$.Input.Type', 'Cluster')),
        getDBClusterResources.next(
          new sfn.Map(this, 'StartClustersMap', {
            itemsPath: sfn.JsonPath.stringAt('$.Result.TargetResources'),
            maxConcurrency: 10,
          }).iterator(
            new sfn.Pass(this, 'GetStartDBClusterIdentifier', {
              parameters: {
                'TargetDBClusterIdentifier.$': "States.ArrayGetItem(States.StringSplit($, ':'), 6)",
              },
            }).next(
              describeDBClustersTask.next(
                new sfn.Choice(this, 'StartDBClusterStatusChoice').when(
                  sfn.Condition.stringEquals('$[0].Status', 'stopped'),
                  startDBClusterTask.next(startDBClusterStatusChangeWait.next(describeDBClustersTask.next(
                    new sfn.Choice(this, 'Choice')
                      .when(
                        sfn.Condition.stringEquals('$[0].Status', 'starting'),
                        startDBClusterStatusChangeWait,
                      )
                      .when(
                        sfn.Condition.stringEquals('$[0].Status', 'available'),
                        succeed,
                      )
                      .otherwise(new sfn.Fail(this, 'StartDBClusterStatusFail', {
                        cause: 'start db clusater status fail.',
                      })),
                  ))),
                ),
              ),
            ))),
      )
      .when(
        sfn.Condition.and(sfn.Condition.stringEquals('$.Input.Mode', 'Stop'), sfn.Condition.stringEquals('$.Input.Type', 'Cluster')),
        getDBClusterResources.next(
          new sfn.Map(this, 'StopClusterMap', {
            itemsPath: sfn.JsonPath.stringAt('$.Result.TargetResources'),
            maxConcurrency: 10,
          }).iterator(
            new sfn.Pass(this, 'GetStopDBClusterIdentifier', {
              parameters: {
                'TargetDBClusterIdentifier.$': "States.ArrayGetItem(States.StringSplit($, ':'), 6)",
              },
            }).next(
              describeDBClustersTask.next(
                new sfn.Choice(this, 'StopDBClusterStatusChoice').when(
                  sfn.Condition.stringEquals('$[0].Status', 'available'),
                  stopDBClusterTask.next(stopDBClusterStatusChangeWait.next(describeDBClustersTask.next(
                    new sfn.Choice(this, 'Choice')
                      .when(
                        sfn.Condition.stringEquals('$[0].Status', 'stopping'),
                        stopDBClusterStatusChangeWait,
                      )
                      .when(
                        sfn.Condition.stringEquals('$[0].Status', 'stopped'),
                        succeed,
                      )
                      .otherwise(new sfn.Fail(this, 'StopDBClusterStatusFail', {
                        cause: 'stop db instance status fail.',
                      })),
                  ))),
                ),
              ),
            ))),
      )
      .otherwise(new sfn.Fail(this, 'ModeChoiceFail', {
        cause: 'input argment Mode is unmatch.',
      }));

    // 👇EventBridge Scheduler IAM Role
    const schedulerExecutionRole = new iam.Role(this, 'SchedulerExecutionRole', {
      roleName: `stop-db-schedule-${randomNameKey}-exec-role`,
      assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
      inlinePolicies: {
        ['rds-instance-stop-policy']: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'rds:StopDBInstance',
                'rds:StartDBInstance',
              ],
              resources: [
                `arn:aws:rds:*:${account}:db:*`,
              ],
            }),
          ],
        }),
        ['rds-cluster-stop-policy']: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'rds:StopDBCluster',
                'rds:StartDBCluster',
              ],
              resources: [
                `arn:aws:rds:*:${account}:cluster:*`,
              ],
            }),
          ],
        }),
      },
    });

    for (const target of props.targets) {

      for (const identify of target.identifiers) {
        // 👇Create random string
        const scheduleNameKey = crypto.createHash('shake256', { outputLength: 4 })
          .update(identify)
          .digest('hex');

        // 👇EventBridge Scheduler for DB Instance Stop
        new scheduler.CfnSchedule(this, `StopSchedule${scheduleNameKey.toUpperCase()}`, {
          name: `auto-stop-db-${target.type.toLowerCase()}-${scheduleNameKey}-schedule`,
          description: `auto stop db ${target.type.toLowerCase()}(${identify}) schedule.`,
          state: 'ENABLED',
          //groupName: scheduleGroup.name, // default
          flexibleTimeWindow: {
            mode: 'OFF',
          },
          scheduleExpressionTimezone: target.stopSchedule.timezone,
          scheduleExpression: (() => {
            // default: weekday 21:10
            const minute: string = target.stopSchedule.minute ?? '10';
            const hour: string = target.stopSchedule.hour ?? '21';
            const week: string = target.stopSchedule.week ?? 'MON-FRI';
            return `cron(${minute} ${hour} ? * ${week} *)`;
          })(),
          target: {
            arn: (() => {
              switch (target.type) {
                case DatabaseType.CLUSTER:
                  return 'arn:aws:scheduler:::aws-sdk:rds:stopDBCluster';
                case DatabaseType.INSTANCE:
                  return 'arn:aws:scheduler:::aws-sdk:rds:stopDBInstance';
              }
            })(),
            roleArn: schedulerExecutionRole.roleArn,
            input: (() => {
              switch (target.type) {
                case DatabaseType.CLUSTER:
                  return JSON.stringify({ DbClusterIdentifier: identify });
                case DatabaseType.INSTANCE:
                  return JSON.stringify({ DbInstanceIdentifier: identify });
              }
            })(),
            retryPolicy: {
              maximumEventAgeInSeconds: 60,
              maximumRetryAttempts: 0,
            },
          },
        });

        // 👇EventBridge Scheduler for DB Instance Start
        new scheduler.CfnSchedule(this, `StartSchedule${scheduleNameKey.toUpperCase()}`, {
          name: `auto-start-db-${target.type.toLowerCase()}-${scheduleNameKey}-schedule`,
          description: `auto start db ${target.type.toLowerCase()}(${identify}) schedule.`,
          state: 'ENABLED',
          //groupName: scheduleGroup.name, // default
          flexibleTimeWindow: {
            mode: 'OFF',
          },
          scheduleExpressionTimezone: target.startSchedule.timezone,
          scheduleExpression: (() => {
            // default: weekday 07:50
            const minute: string = target.startSchedule.minute ?? '50';
            const hour: string = target.startSchedule.hour ?? '7';
            const week: string = target.startSchedule.week ?? 'MON-FRI';
            return `cron(${minute} ${hour} ? * ${week} *)`;
          })(),
          target: {
            arn: (() => {
              switch (target.type) {
                case DatabaseType.CLUSTER:
                  return 'arn:aws:scheduler:::aws-sdk:rds:startDBCluster';
                case DatabaseType.INSTANCE:
                  return 'arn:aws:scheduler:::aws-sdk:rds:startDBInstance';
              }
            })(),
            roleArn: schedulerExecutionRole.roleArn,
            input: (() => {
              switch (target.type) {
                case DatabaseType.CLUSTER:
                  return JSON.stringify({ DbClusterIdentifier: identify });
                case DatabaseType.INSTANCE:
                  return JSON.stringify({ DbInstanceIdentifier: identify });
              }
            })(),
            retryPolicy: {
              maximumEventAgeInSeconds: 60,
              maximumRetryAttempts: 0,
            },
          },
        });
      }

    }
  }
}
