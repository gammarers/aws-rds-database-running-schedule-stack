import * as crypto from 'crypto';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
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

export interface RdsDatabaseRunningSchedulerProps {
  readonly targets: TargetProperty[];
}

export class RdsDatabaseRunningScheduler extends Construct {
  constructor(scope: Construct, id: string, props: RdsDatabaseRunningSchedulerProps) {
    super(scope, id);

    const account = cdk.Stack.of(this).account;
    //const stackName: string = cdk.Stack.of(this).stackName;
    //const region = cdk.Stack.of(this).region;

    const randomNameKey = crypto.createHash('shake256', { outputLength: 4 })
      .update(`${cdk.Names.uniqueId(scope)}-${cdk.Names.uniqueId(this)}`)
      .digest('hex');

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
