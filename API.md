# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### RdsDatabaseRunningScheduler <a name="RdsDatabaseRunningScheduler" id="@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler"></a>

#### Initializers <a name="Initializers" id="@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.Initializer"></a>

```typescript
import { RdsDatabaseRunningScheduler } from '@yicr/aws-rds-database-running-scheduler'

new RdsDatabaseRunningScheduler(scope: Construct, id: string, props: RdsDatabaseRunningSchedulerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.Initializer.parameter.props">props</a></code> | <code><a href="#@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningSchedulerProps">RdsDatabaseRunningSchedulerProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.Initializer.parameter.props"></a>

- *Type:* <a href="#@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningSchedulerProps">RdsDatabaseRunningSchedulerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.isConstruct"></a>

```typescript
import { RdsDatabaseRunningScheduler } from '@yicr/aws-rds-database-running-scheduler'

RdsDatabaseRunningScheduler.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningScheduler.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### IdentifiersProperty <a name="IdentifiersProperty" id="@yicr/aws-rds-database-running-scheduler.IdentifiersProperty"></a>

#### Initializer <a name="Initializer" id="@yicr/aws-rds-database-running-scheduler.IdentifiersProperty.Initializer"></a>

```typescript
import { IdentifiersProperty } from '@yicr/aws-rds-database-running-scheduler'

const identifiersProperty: IdentifiersProperty = { ... }
```


### RdsDatabaseRunningSchedulerProps <a name="RdsDatabaseRunningSchedulerProps" id="@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningSchedulerProps"></a>

#### Initializer <a name="Initializer" id="@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningSchedulerProps.Initializer"></a>

```typescript
import { RdsDatabaseRunningSchedulerProps } from '@yicr/aws-rds-database-running-scheduler'

const rdsDatabaseRunningSchedulerProps: RdsDatabaseRunningSchedulerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningSchedulerProps.property.identifiers">identifiers</a></code> | <code><a href="#@yicr/aws-rds-database-running-scheduler.IdentifiersProperty">IdentifiersProperty</a></code> | *No description.* |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningSchedulerProps.property.type">type</a></code> | <code><a href="#@yicr/aws-rds-database-running-scheduler.Type">Type</a></code> | *No description.* |

---

##### `identifiers`<sup>Required</sup> <a name="identifiers" id="@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningSchedulerProps.property.identifiers"></a>

```typescript
public readonly identifiers: IdentifiersProperty;
```

- *Type:* <a href="#@yicr/aws-rds-database-running-scheduler.IdentifiersProperty">IdentifiersProperty</a>

---

##### `type`<sup>Required</sup> <a name="type" id="@yicr/aws-rds-database-running-scheduler.RdsDatabaseRunningSchedulerProps.property.type"></a>

```typescript
public readonly type: Type;
```

- *Type:* <a href="#@yicr/aws-rds-database-running-scheduler.Type">Type</a>

---

### ScheduleProperty <a name="ScheduleProperty" id="@yicr/aws-rds-database-running-scheduler.ScheduleProperty"></a>

#### Initializer <a name="Initializer" id="@yicr/aws-rds-database-running-scheduler.ScheduleProperty.Initializer"></a>

```typescript
import { ScheduleProperty } from '@yicr/aws-rds-database-running-scheduler'

const scheduleProperty: ScheduleProperty = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.ScheduleProperty.property.timezone">timezone</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.ScheduleProperty.property.hour">hour</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.ScheduleProperty.property.minute">minute</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.ScheduleProperty.property.week">week</a></code> | <code>string</code> | *No description.* |

---

##### `timezone`<sup>Required</sup> <a name="timezone" id="@yicr/aws-rds-database-running-scheduler.ScheduleProperty.property.timezone"></a>

```typescript
public readonly timezone: string;
```

- *Type:* string

---

##### `hour`<sup>Optional</sup> <a name="hour" id="@yicr/aws-rds-database-running-scheduler.ScheduleProperty.property.hour"></a>

```typescript
public readonly hour: string;
```

- *Type:* string

---

##### `minute`<sup>Optional</sup> <a name="minute" id="@yicr/aws-rds-database-running-scheduler.ScheduleProperty.property.minute"></a>

```typescript
public readonly minute: string;
```

- *Type:* string

---

##### `week`<sup>Optional</sup> <a name="week" id="@yicr/aws-rds-database-running-scheduler.ScheduleProperty.property.week"></a>

```typescript
public readonly week: string;
```

- *Type:* string

---

### StatusProperty <a name="StatusProperty" id="@yicr/aws-rds-database-running-scheduler.StatusProperty"></a>

#### Initializer <a name="Initializer" id="@yicr/aws-rds-database-running-scheduler.StatusProperty.Initializer"></a>

```typescript
import { StatusProperty } from '@yicr/aws-rds-database-running-scheduler'

const statusProperty: StatusProperty = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.StatusProperty.property.startSchedule">startSchedule</a></code> | <code><a href="#@yicr/aws-rds-database-running-scheduler.ScheduleProperty">ScheduleProperty</a></code> | *No description.* |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.StatusProperty.property.stopSchedule">stopSchedule</a></code> | <code><a href="#@yicr/aws-rds-database-running-scheduler.ScheduleProperty">ScheduleProperty</a></code> | *No description.* |

---

##### `startSchedule`<sup>Required</sup> <a name="startSchedule" id="@yicr/aws-rds-database-running-scheduler.StatusProperty.property.startSchedule"></a>

```typescript
public readonly startSchedule: ScheduleProperty;
```

- *Type:* <a href="#@yicr/aws-rds-database-running-scheduler.ScheduleProperty">ScheduleProperty</a>

---

##### `stopSchedule`<sup>Required</sup> <a name="stopSchedule" id="@yicr/aws-rds-database-running-scheduler.StatusProperty.property.stopSchedule"></a>

```typescript
public readonly stopSchedule: ScheduleProperty;
```

- *Type:* <a href="#@yicr/aws-rds-database-running-scheduler.ScheduleProperty">ScheduleProperty</a>

---



## Enums <a name="Enums" id="Enums"></a>

### Type <a name="Type" id="@yicr/aws-rds-database-running-scheduler.Type"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.Type.CLUSTER">CLUSTER</a></code> | *No description.* |
| <code><a href="#@yicr/aws-rds-database-running-scheduler.Type.INSTANCE">INSTANCE</a></code> | *No description.* |

---

##### `CLUSTER` <a name="CLUSTER" id="@yicr/aws-rds-database-running-scheduler.Type.CLUSTER"></a>

---


##### `INSTANCE` <a name="INSTANCE" id="@yicr/aws-rds-database-running-scheduler.Type.INSTANCE"></a>

---

