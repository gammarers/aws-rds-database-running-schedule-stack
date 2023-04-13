import * as crypto from 'crypto';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import { Construct } from 'constructs';

export enum Type {
  CLUSTER = 'Cluster',
  INSTANCE = 'Instance',
}

export interface IdentifiersProperty {
  readonly [name: string]: StatusProperty;
}

export interface StatusProperty {
  readonly stopSchedule: ScheduleProperty;
  readonly startSchedule: ScheduleProperty;
}

export interface ScheduleProperty {
  readonly timezone: string;
  readonly minute?: string;
  readonly hour?: string;
  readonly week?: string;
}

export interface RdsDatabaseRunningSchedulerProps {
  readonly type: Type;
  readonly identifiers: IdentifiersProperty;
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
    const type: string = (() => {
      switch (props.type) {
        case Type.CLUSTER:
          return 'cluster';
        case Type.INSTANCE:
          return 'instance';
      }
    })();
    const schedulerExecutionRole = new iam.Role(this, 'SchedulerExecutionRole', {
      roleName: `stop-db-${type}-schedule-${randomNameKey}-exec-role`,
      assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
      inlinePolicies: {
        [`rds-${type}-stop-policy`]: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: (() => {
                switch (props.type) {
                  case Type.CLUSTER:
                    return [
                      'rds:StopDBCluster',
                      'rds:StartDBCluster',
                    ];
                  case Type.INSTANCE:
                    return [
                      'rds:StopDBInstance',
                      'rds:StartDBInstance',
                    ];
                }
              })(),
              resources: [
                `arn:aws:rds:*:${account}:db:*`,
              ],
            }),
          ],
        }),
      },
    });

    for (const [identifier, status] of Object.entries(props.identifiers)) {
      // 👇Create random string
      const scheduleNameKey = crypto.createHash('shake256', { outputLength: 4 })
        .update(identifier)
        .digest('hex');

      // 👇EventBridge Scheduler for DB Instance Stop
      new scheduler.CfnSchedule(this, `StopSchedule${scheduleNameKey.toUpperCase()}`, {
        name: `auto-stop-db-${type}-${scheduleNameKey}-schedule`,
        description: `auto stop db ${type}(${identifier}) schedule.`,
        state: 'ENABLED',
        //groupName: scheduleGroup.name, // default
        flexibleTimeWindow: {
          mode: 'OFF',
        },
        scheduleExpressionTimezone: status.stopSchedule.timezone,
        scheduleExpression: (() => {
          // default: weekday 21:10
          const minute: string = status.stopSchedule.minute ?? '10';
          const hour: string = status.stopSchedule.hour ?? '21';
          const week: string = status.stopSchedule.week ?? 'MON-FRI';
          return `cron(${minute} ${hour} ? * ${week} *)`;
        })(),
        target: {
          arn: (() => {
            switch (props.type) {
              case Type.CLUSTER:
                return 'arn:aws:scheduler:::aws-sdk:rds:stopDBCluster';
              case Type.INSTANCE:
                return 'arn:aws:scheduler:::aws-sdk:rds:stopDBInstance';
            }
          })(),
          roleArn: schedulerExecutionRole.roleArn,
          input: (() => {
            switch (props.type) {
              case Type.CLUSTER:
                return JSON.stringify({ DbClusterIdentifier: identifier });
              case Type.INSTANCE:
                return JSON.stringify({ DbInstanceIdentifier: identifier });
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
        name: `auto-start-db-${type}-${scheduleNameKey}-schedule`,
        description: `auto start db ${type}(${identifier}) schedule.`,
        state: 'ENABLED',
        //groupName: scheduleGroup.name, // default
        flexibleTimeWindow: {
          mode: 'OFF',
        },
        scheduleExpressionTimezone: status.startSchedule.timezone,
        scheduleExpression: (() => {
          // default: weekday 07:50
          const minute: string = status.startSchedule.minute ?? '50';
          const hour: string = status.startSchedule.hour ?? '7';
          const week: string = status.startSchedule.week ?? 'MON-FRI';
          return `cron(${minute} ${hour} ? * ${week} *)`;
        })(),
        target: {
          arn: (() => {
            switch (props.type) {
              case Type.CLUSTER:
                return 'arn:aws:scheduler:::aws-sdk:rds:startDBCluster';
              case Type.INSTANCE:
                return 'arn:aws:scheduler:::aws-sdk:rds:startDBInstance';
            }
          })(),
          roleArn: schedulerExecutionRole.roleArn,
          input: (() => {
            switch (props.type) {
              case Type.CLUSTER:
                return JSON.stringify({ DbClusterIdentifier: identifier });
              case Type.INSTANCE:
                return JSON.stringify({ DbInstanceIdentifier: identifier });
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
