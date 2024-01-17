# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### RdsDatabaseRunningScheduler <a name="RdsDatabaseRunningScheduler" id="@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler"></a>

#### Initializers <a name="Initializers" id="@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.Initializer"></a>

```typescript
import { RdsDatabaseRunningScheduler } from '@gammarer/aws-rds-database-running-scheduler'

new RdsDatabaseRunningScheduler(scope: Construct, id: string, props: RdsDatabaseRunningSchedulerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.Initializer.parameter.props">props</a></code> | <code><a href="#@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningSchedulerProps">RdsDatabaseRunningSchedulerProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.Initializer.parameter.props"></a>

- *Type:* <a href="#@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningSchedulerProps">RdsDatabaseRunningSchedulerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.isConstruct"></a>

```typescript
import { RdsDatabaseRunningScheduler } from '@gammarer/aws-rds-database-running-scheduler'

RdsDatabaseRunningScheduler.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### RdsDatabaseRunningSchedulerProps <a name="RdsDatabaseRunningSchedulerProps" id="@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningSchedulerProps"></a>

#### Initializer <a name="Initializer" id="@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningSchedulerProps.Initializer"></a>

```typescript
import { RdsDatabaseRunningSchedulerProps } from '@gammarer/aws-rds-database-running-scheduler'

const rdsDatabaseRunningSchedulerProps: RdsDatabaseRunningSchedulerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningSchedulerProps.property.targets">targets</a></code> | <code><a href="#@gammarer/aws-rds-database-running-scheduler.TargetProperty">TargetProperty</a>[]</code> | *No description.* |

---

##### `targets`<sup>Required</sup> <a name="targets" id="@gammarer/aws-rds-database-running-scheduler.RdsDatabaseRunningSchedulerProps.property.targets"></a>

```typescript
public readonly targets: TargetProperty[];
```

- *Type:* <a href="#@gammarer/aws-rds-database-running-scheduler.TargetProperty">TargetProperty</a>[]

---

### ScheduleProperty <a name="ScheduleProperty" id="@gammarer/aws-rds-database-running-scheduler.ScheduleProperty"></a>

#### Initializer <a name="Initializer" id="@gammarer/aws-rds-database-running-scheduler.ScheduleProperty.Initializer"></a>

```typescript
import { ScheduleProperty } from '@gammarer/aws-rds-database-running-scheduler'

const scheduleProperty: ScheduleProperty = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.ScheduleProperty.property.timezone">timezone</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.ScheduleProperty.property.hour">hour</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.ScheduleProperty.property.minute">minute</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.ScheduleProperty.property.week">week</a></code> | <code>string</code> | *No description.* |

---

##### `timezone`<sup>Required</sup> <a name="timezone" id="@gammarer/aws-rds-database-running-scheduler.ScheduleProperty.property.timezone"></a>

```typescript
public readonly timezone: string;
```

- *Type:* string

---

##### `hour`<sup>Optional</sup> <a name="hour" id="@gammarer/aws-rds-database-running-scheduler.ScheduleProperty.property.hour"></a>

```typescript
public readonly hour: string;
```

- *Type:* string

---

##### `minute`<sup>Optional</sup> <a name="minute" id="@gammarer/aws-rds-database-running-scheduler.ScheduleProperty.property.minute"></a>

```typescript
public readonly minute: string;
```

- *Type:* string

---

##### `week`<sup>Optional</sup> <a name="week" id="@gammarer/aws-rds-database-running-scheduler.ScheduleProperty.property.week"></a>

```typescript
public readonly week: string;
```

- *Type:* string

---

### TargetProperty <a name="TargetProperty" id="@gammarer/aws-rds-database-running-scheduler.TargetProperty"></a>

#### Initializer <a name="Initializer" id="@gammarer/aws-rds-database-running-scheduler.TargetProperty.Initializer"></a>

```typescript
import { TargetProperty } from '@gammarer/aws-rds-database-running-scheduler'

const targetProperty: TargetProperty = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.TargetProperty.property.identifiers">identifiers</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.TargetProperty.property.startSchedule">startSchedule</a></code> | <code><a href="#@gammarer/aws-rds-database-running-scheduler.ScheduleProperty">ScheduleProperty</a></code> | *No description.* |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.TargetProperty.property.stopSchedule">stopSchedule</a></code> | <code><a href="#@gammarer/aws-rds-database-running-scheduler.ScheduleProperty">ScheduleProperty</a></code> | *No description.* |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.TargetProperty.property.type">type</a></code> | <code><a href="#@gammarer/aws-rds-database-running-scheduler.DatabaseType">DatabaseType</a></code> | *No description.* |

---

##### `identifiers`<sup>Required</sup> <a name="identifiers" id="@gammarer/aws-rds-database-running-scheduler.TargetProperty.property.identifiers"></a>

```typescript
public readonly identifiers: string[];
```

- *Type:* string[]

---

##### `startSchedule`<sup>Required</sup> <a name="startSchedule" id="@gammarer/aws-rds-database-running-scheduler.TargetProperty.property.startSchedule"></a>

```typescript
public readonly startSchedule: ScheduleProperty;
```

- *Type:* <a href="#@gammarer/aws-rds-database-running-scheduler.ScheduleProperty">ScheduleProperty</a>

---

##### `stopSchedule`<sup>Required</sup> <a name="stopSchedule" id="@gammarer/aws-rds-database-running-scheduler.TargetProperty.property.stopSchedule"></a>

```typescript
public readonly stopSchedule: ScheduleProperty;
```

- *Type:* <a href="#@gammarer/aws-rds-database-running-scheduler.ScheduleProperty">ScheduleProperty</a>

---

##### `type`<sup>Required</sup> <a name="type" id="@gammarer/aws-rds-database-running-scheduler.TargetProperty.property.type"></a>

```typescript
public readonly type: DatabaseType;
```

- *Type:* <a href="#@gammarer/aws-rds-database-running-scheduler.DatabaseType">DatabaseType</a>

---



## Enums <a name="Enums" id="Enums"></a>

### DatabaseType <a name="DatabaseType" id="@gammarer/aws-rds-database-running-scheduler.DatabaseType"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.DatabaseType.CLUSTER">CLUSTER</a></code> | *No description.* |
| <code><a href="#@gammarer/aws-rds-database-running-scheduler.DatabaseType.INSTANCE">INSTANCE</a></code> | *No description.* |

---

##### `CLUSTER` <a name="CLUSTER" id="@gammarer/aws-rds-database-running-scheduler.DatabaseType.CLUSTER"></a>

---


##### `INSTANCE` <a name="INSTANCE" id="@gammarer/aws-rds-database-running-scheduler.DatabaseType.INSTANCE"></a>

---

