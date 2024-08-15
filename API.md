# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### RdsDatabaseRunningScheduleStack <a name="RdsDatabaseRunningScheduleStack" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack"></a>

#### Initializers <a name="Initializers" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.Initializer"></a>

```typescript
import { RdsDatabaseRunningScheduleStack } from '@gammarers/aws-rds-database-running-schedule-stack'

new RdsDatabaseRunningScheduleStack(scope: Construct, id: string, props: RdsDatabaseRunningScheduleStackProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.Initializer.parameter.props">props</a></code> | <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps">RdsDatabaseRunningScheduleStackProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.Initializer.parameter.props"></a>

- *Type:* <a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps">RdsDatabaseRunningScheduleStackProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.addDependency">addDependency</a></code> | Add a dependency between this stack and another stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.addMetadata">addMetadata</a></code> | Adds an arbitary key-value pair, with information you want to record about the stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.addTransform">addTransform</a></code> | Add a Transform to this stack. A Transform is a macro that AWS CloudFormation uses to process your template. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.exportStringListValue">exportStringListValue</a></code> | Create a CloudFormation Export for a string list value. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.exportValue">exportValue</a></code> | Create a CloudFormation Export for a string value. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.formatArn">formatArn</a></code> | Creates an ARN from components. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.getLogicalId">getLogicalId</a></code> | Allocates a stack-unique CloudFormation-compatible logical identity for a specific resource. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.regionalFact">regionalFact</a></code> | Look up a fact value for the given fact for the region of this stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.renameLogicalId">renameLogicalId</a></code> | Rename a generated logical identities. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.reportMissingContextKey">reportMissingContextKey</a></code> | Indicate that a context key was expected. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.resolve">resolve</a></code> | Resolve a tokenized value in the context of the current stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.splitArn">splitArn</a></code> | Splits the provided ARN into its components. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.toJsonString">toJsonString</a></code> | Convert an object, potentially containing tokens, to a JSON string. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.toYamlString">toYamlString</a></code> | Convert an object, potentially containing tokens, to a YAML string. |

---

##### `toString` <a name="toString" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addDependency` <a name="addDependency" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.addDependency"></a>

```typescript
public addDependency(target: Stack, reason?: string): void
```

Add a dependency between this stack and another stack.

This can be used to define dependencies between any two stacks within an
app, and also supports nested stacks.

###### `target`<sup>Required</sup> <a name="target" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.addDependency.parameter.target"></a>

- *Type:* aws-cdk-lib.Stack

---

###### `reason`<sup>Optional</sup> <a name="reason" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.addDependency.parameter.reason"></a>

- *Type:* string

---

##### `addMetadata` <a name="addMetadata" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.addMetadata"></a>

```typescript
public addMetadata(key: string, value: any): void
```

Adds an arbitary key-value pair, with information you want to record about the stack.

These get translated to the Metadata section of the generated template.

> [https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/metadata-section-structure.html)

###### `key`<sup>Required</sup> <a name="key" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.addMetadata.parameter.key"></a>

- *Type:* string

---

###### `value`<sup>Required</sup> <a name="value" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.addMetadata.parameter.value"></a>

- *Type:* any

---

##### `addTransform` <a name="addTransform" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.addTransform"></a>

```typescript
public addTransform(transform: string): void
```

Add a Transform to this stack. A Transform is a macro that AWS CloudFormation uses to process your template.

Duplicate values are removed when stack is synthesized.

> [https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html)

*Example*

```typescript
declare const stack: Stack;

stack.addTransform('AWS::Serverless-2016-10-31')
```


###### `transform`<sup>Required</sup> <a name="transform" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.addTransform.parameter.transform"></a>

- *Type:* string

The transform to add.

---

##### `exportStringListValue` <a name="exportStringListValue" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.exportStringListValue"></a>

```typescript
public exportStringListValue(exportedValue: any, options?: ExportValueOptions): string[]
```

Create a CloudFormation Export for a string list value.

Returns a string list representing the corresponding `Fn.importValue()`
expression for this Export. The export expression is automatically wrapped with an
`Fn::Join` and the import value with an `Fn::Split`, since CloudFormation can only
export strings. You can control the name for the export by passing the `name` option.

If you don't supply a value for `name`, the value you're exporting must be
a Resource attribute (for example: `bucket.bucketName`) and it will be
given the same name as the automatic cross-stack reference that would be created
if you used the attribute in another Stack.

One of the uses for this method is to *remove* the relationship between
two Stacks established by automatic cross-stack references. It will
temporarily ensure that the CloudFormation Export still exists while you
remove the reference from the consuming stack. After that, you can remove
the resource and the manual export.

See `exportValue` for an example of this process.

###### `exportedValue`<sup>Required</sup> <a name="exportedValue" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.exportStringListValue.parameter.exportedValue"></a>

- *Type:* any

---

###### `options`<sup>Optional</sup> <a name="options" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.exportStringListValue.parameter.options"></a>

- *Type:* aws-cdk-lib.ExportValueOptions

---

##### `exportValue` <a name="exportValue" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.exportValue"></a>

```typescript
public exportValue(exportedValue: any, options?: ExportValueOptions): string
```

Create a CloudFormation Export for a string value.

Returns a string representing the corresponding `Fn.importValue()`
expression for this Export. You can control the name for the export by
passing the `name` option.

If you don't supply a value for `name`, the value you're exporting must be
a Resource attribute (for example: `bucket.bucketName`) and it will be
given the same name as the automatic cross-stack reference that would be created
if you used the attribute in another Stack.

One of the uses for this method is to *remove* the relationship between
two Stacks established by automatic cross-stack references. It will
temporarily ensure that the CloudFormation Export still exists while you
remove the reference from the consuming stack. After that, you can remove
the resource and the manual export.

## Example

Here is how the process works. Let's say there are two stacks,
`producerStack` and `consumerStack`, and `producerStack` has a bucket
called `bucket`, which is referenced by `consumerStack` (perhaps because
an AWS Lambda Function writes into it, or something like that).

It is not safe to remove `producerStack.bucket` because as the bucket is being
deleted, `consumerStack` might still be using it.

Instead, the process takes two deployments:

### Deployment 1: break the relationship

- Make sure `consumerStack` no longer references `bucket.bucketName` (maybe the consumer
  stack now uses its own bucket, or it writes to an AWS DynamoDB table, or maybe you just
  remove the Lambda Function altogether).
- In the `ProducerStack` class, call `this.exportValue(this.bucket.bucketName)`. This
  will make sure the CloudFormation Export continues to exist while the relationship
  between the two stacks is being broken.
- Deploy (this will effectively only change the `consumerStack`, but it's safe to deploy both).

### Deployment 2: remove the bucket resource

- You are now free to remove the `bucket` resource from `producerStack`.
- Don't forget to remove the `exportValue()` call as well.
- Deploy again (this time only the `producerStack` will be changed -- the bucket will be deleted).

###### `exportedValue`<sup>Required</sup> <a name="exportedValue" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.exportValue.parameter.exportedValue"></a>

- *Type:* any

---

###### `options`<sup>Optional</sup> <a name="options" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.exportValue.parameter.options"></a>

- *Type:* aws-cdk-lib.ExportValueOptions

---

##### `formatArn` <a name="formatArn" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.formatArn"></a>

```typescript
public formatArn(components: ArnComponents): string
```

Creates an ARN from components.

If `partition`, `region` or `account` are not specified, the stack's
partition, region and account will be used.

If any component is the empty string, an empty string will be inserted
into the generated ARN at the location that component corresponds to.

The ARN will be formatted as follows:

  arn:{partition}:{service}:{region}:{account}:{resource}{sep}{resource-name}

The required ARN pieces that are omitted will be taken from the stack that
the 'scope' is attached to. If all ARN pieces are supplied, the supplied scope
can be 'undefined'.

###### `components`<sup>Required</sup> <a name="components" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.formatArn.parameter.components"></a>

- *Type:* aws-cdk-lib.ArnComponents

---

##### `getLogicalId` <a name="getLogicalId" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.getLogicalId"></a>

```typescript
public getLogicalId(element: CfnElement): string
```

Allocates a stack-unique CloudFormation-compatible logical identity for a specific resource.

This method is called when a `CfnElement` is created and used to render the
initial logical identity of resources. Logical ID renames are applied at
this stage.

This method uses the protected method `allocateLogicalId` to render the
logical ID for an element. To modify the naming scheme, extend the `Stack`
class and override this method.

###### `element`<sup>Required</sup> <a name="element" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.getLogicalId.parameter.element"></a>

- *Type:* aws-cdk-lib.CfnElement

The CloudFormation element for which a logical identity is needed.

---

##### `regionalFact` <a name="regionalFact" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.regionalFact"></a>

```typescript
public regionalFact(factName: string, defaultValue?: string): string
```

Look up a fact value for the given fact for the region of this stack.

Will return a definite value only if the region of the current stack is resolved.
If not, a lookup map will be added to the stack and the lookup will be done at
CDK deployment time.

What regions will be included in the lookup map is controlled by the
`@aws-cdk/core:target-partitions` context value: it must be set to a list
of partitions, and only regions from the given partitions will be included.
If no such context key is set, all regions will be included.

This function is intended to be used by construct library authors. Application
builders can rely on the abstractions offered by construct libraries and do
not have to worry about regional facts.

If `defaultValue` is not given, it is an error if the fact is unknown for
the given region.

###### `factName`<sup>Required</sup> <a name="factName" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.regionalFact.parameter.factName"></a>

- *Type:* string

---

###### `defaultValue`<sup>Optional</sup> <a name="defaultValue" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.regionalFact.parameter.defaultValue"></a>

- *Type:* string

---

##### `renameLogicalId` <a name="renameLogicalId" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.renameLogicalId"></a>

```typescript
public renameLogicalId(oldId: string, newId: string): void
```

Rename a generated logical identities.

To modify the naming scheme strategy, extend the `Stack` class and
override the `allocateLogicalId` method.

###### `oldId`<sup>Required</sup> <a name="oldId" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.renameLogicalId.parameter.oldId"></a>

- *Type:* string

---

###### `newId`<sup>Required</sup> <a name="newId" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.renameLogicalId.parameter.newId"></a>

- *Type:* string

---

##### `reportMissingContextKey` <a name="reportMissingContextKey" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.reportMissingContextKey"></a>

```typescript
public reportMissingContextKey(report: MissingContext): void
```

Indicate that a context key was expected.

Contains instructions which will be emitted into the cloud assembly on how
the key should be supplied.

###### `report`<sup>Required</sup> <a name="report" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.reportMissingContextKey.parameter.report"></a>

- *Type:* aws-cdk-lib.cloud_assembly_schema.MissingContext

The set of parameters needed to obtain the context.

---

##### `resolve` <a name="resolve" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.resolve"></a>

```typescript
public resolve(obj: any): any
```

Resolve a tokenized value in the context of the current stack.

###### `obj`<sup>Required</sup> <a name="obj" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.resolve.parameter.obj"></a>

- *Type:* any

---

##### `splitArn` <a name="splitArn" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.splitArn"></a>

```typescript
public splitArn(arn: string, arnFormat: ArnFormat): ArnComponents
```

Splits the provided ARN into its components.

Works both if 'arn' is a string like 'arn:aws:s3:::bucket',
and a Token representing a dynamic CloudFormation expression
(in which case the returned components will also be dynamic CloudFormation expressions,
encoded as Tokens).

###### `arn`<sup>Required</sup> <a name="arn" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.splitArn.parameter.arn"></a>

- *Type:* string

the ARN to split into its components.

---

###### `arnFormat`<sup>Required</sup> <a name="arnFormat" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.splitArn.parameter.arnFormat"></a>

- *Type:* aws-cdk-lib.ArnFormat

the expected format of 'arn' - depends on what format the service 'arn' represents uses.

---

##### `toJsonString` <a name="toJsonString" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.toJsonString"></a>

```typescript
public toJsonString(obj: any, space?: number): string
```

Convert an object, potentially containing tokens, to a JSON string.

###### `obj`<sup>Required</sup> <a name="obj" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.toJsonString.parameter.obj"></a>

- *Type:* any

---

###### `space`<sup>Optional</sup> <a name="space" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.toJsonString.parameter.space"></a>

- *Type:* number

---

##### `toYamlString` <a name="toYamlString" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.toYamlString"></a>

```typescript
public toYamlString(obj: any): string
```

Convert an object, potentially containing tokens, to a YAML string.

###### `obj`<sup>Required</sup> <a name="obj" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.toYamlString.parameter.obj"></a>

- *Type:* any

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.isStack">isStack</a></code> | Return whether the given object is a Stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.of">of</a></code> | Looks up the first stack scope in which `construct` is defined. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.isConstruct"></a>

```typescript
import { RdsDatabaseRunningScheduleStack } from '@gammarers/aws-rds-database-running-schedule-stack'

RdsDatabaseRunningScheduleStack.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isStack` <a name="isStack" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.isStack"></a>

```typescript
import { RdsDatabaseRunningScheduleStack } from '@gammarers/aws-rds-database-running-schedule-stack'

RdsDatabaseRunningScheduleStack.isStack(x: any)
```

Return whether the given object is a Stack.

We do attribute detection since we can't reliably use 'instanceof'.

###### `x`<sup>Required</sup> <a name="x" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.isStack.parameter.x"></a>

- *Type:* any

---

##### `of` <a name="of" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.of"></a>

```typescript
import { RdsDatabaseRunningScheduleStack } from '@gammarers/aws-rds-database-running-schedule-stack'

RdsDatabaseRunningScheduleStack.of(construct: IConstruct)
```

Looks up the first stack scope in which `construct` is defined.

Fails if there is no stack up the tree.

###### `construct`<sup>Required</sup> <a name="construct" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.of.parameter.construct"></a>

- *Type:* constructs.IConstruct

The construct to start the search from.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.account">account</a></code> | <code>string</code> | The AWS account into which this stack will be deployed. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.artifactId">artifactId</a></code> | <code>string</code> | The ID of the cloud assembly artifact for this stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.availabilityZones">availabilityZones</a></code> | <code>string[]</code> | Returns the list of AZs that are available in the AWS environment (account/region) associated with this stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.bundlingRequired">bundlingRequired</a></code> | <code>boolean</code> | Indicates whether the stack requires bundling or not. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.dependencies">dependencies</a></code> | <code>aws-cdk-lib.Stack[]</code> | Return the stacks this stack depends on. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.environment">environment</a></code> | <code>string</code> | The environment coordinates in which this stack is deployed. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.nested">nested</a></code> | <code>boolean</code> | Indicates if this is a nested stack, in which case `parentStack` will include a reference to it's parent. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.notificationArns">notificationArns</a></code> | <code>string[]</code> | Returns the list of notification Amazon Resource Names (ARNs) for the current stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.partition">partition</a></code> | <code>string</code> | The partition in which this stack is defined. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.region">region</a></code> | <code>string</code> | The AWS region into which this stack will be deployed (e.g. `us-west-2`). |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.stackId">stackId</a></code> | <code>string</code> | The ID of the stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.stackName">stackName</a></code> | <code>string</code> | The concrete CloudFormation physical stack name. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.synthesizer">synthesizer</a></code> | <code>aws-cdk-lib.IStackSynthesizer</code> | Synthesis method for this stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.tags">tags</a></code> | <code>aws-cdk-lib.TagManager</code> | Tags to be applied to the stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.templateFile">templateFile</a></code> | <code>string</code> | The name of the CloudFormation template file emitted to the output directory during synthesis. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.templateOptions">templateOptions</a></code> | <code>aws-cdk-lib.ITemplateOptions</code> | Options for CloudFormation template (like version, transform, description). |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.urlSuffix">urlSuffix</a></code> | <code>string</code> | The Amazon domain suffix for the region in which this stack is defined. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.nestedStackParent">nestedStackParent</a></code> | <code>aws-cdk-lib.Stack</code> | If this is a nested stack, returns it's parent stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.nestedStackResource">nestedStackResource</a></code> | <code>aws-cdk-lib.CfnResource</code> | If this is a nested stack, this represents its `AWS::CloudFormation::Stack` resource. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.terminationProtection">terminationProtection</a></code> | <code>boolean</code> | Whether termination protection is enabled for this stack. |

---

##### `node`<sup>Required</sup> <a name="node" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `account`<sup>Required</sup> <a name="account" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string

The AWS account into which this stack will be deployed.

This value is resolved according to the following rules:

1. The value provided to `env.account` when the stack is defined. This can
   either be a concrete account (e.g. `585695031111`) or the
   `Aws.ACCOUNT_ID` token.
3. `Aws.ACCOUNT_ID`, which represents the CloudFormation intrinsic reference
   `{ "Ref": "AWS::AccountId" }` encoded as a string token.

Preferably, you should use the return value as an opaque string and not
attempt to parse it to implement your logic. If you do, you must first
check that it is a concrete value an not an unresolved token. If this
value is an unresolved token (`Token.isUnresolved(stack.account)` returns
`true`), this implies that the user wishes that this stack will synthesize
into a **account-agnostic template**. In this case, your code should either
fail (throw an error, emit a synth error using `Annotations.of(construct).addError()`) or
implement some other region-agnostic behavior.

---

##### `artifactId`<sup>Required</sup> <a name="artifactId" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.artifactId"></a>

```typescript
public readonly artifactId: string;
```

- *Type:* string

The ID of the cloud assembly artifact for this stack.

---

##### `availabilityZones`<sup>Required</sup> <a name="availabilityZones" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.availabilityZones"></a>

```typescript
public readonly availabilityZones: string[];
```

- *Type:* string[]

Returns the list of AZs that are available in the AWS environment (account/region) associated with this stack.

If the stack is environment-agnostic (either account and/or region are
tokens), this property will return an array with 2 tokens that will resolve
at deploy-time to the first two availability zones returned from CloudFormation's
`Fn::GetAZs` intrinsic function.

If they are not available in the context, returns a set of dummy values and
reports them as missing, and let the CLI resolve them by calling EC2
`DescribeAvailabilityZones` on the target environment.

To specify a different strategy for selecting availability zones override this method.

---

##### `bundlingRequired`<sup>Required</sup> <a name="bundlingRequired" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.bundlingRequired"></a>

```typescript
public readonly bundlingRequired: boolean;
```

- *Type:* boolean

Indicates whether the stack requires bundling or not.

---

##### `dependencies`<sup>Required</sup> <a name="dependencies" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.dependencies"></a>

```typescript
public readonly dependencies: Stack[];
```

- *Type:* aws-cdk-lib.Stack[]

Return the stacks this stack depends on.

---

##### `environment`<sup>Required</sup> <a name="environment" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.environment"></a>

```typescript
public readonly environment: string;
```

- *Type:* string

The environment coordinates in which this stack is deployed.

In the form
`aws://account/region`. Use `stack.account` and `stack.region` to obtain
the specific values, no need to parse.

You can use this value to determine if two stacks are targeting the same
environment.

If either `stack.account` or `stack.region` are not concrete values (e.g.
`Aws.ACCOUNT_ID` or `Aws.REGION`) the special strings `unknown-account` and/or
`unknown-region` will be used respectively to indicate this stack is
region/account-agnostic.

---

##### `nested`<sup>Required</sup> <a name="nested" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.nested"></a>

```typescript
public readonly nested: boolean;
```

- *Type:* boolean

Indicates if this is a nested stack, in which case `parentStack` will include a reference to it's parent.

---

##### `notificationArns`<sup>Required</sup> <a name="notificationArns" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.notificationArns"></a>

```typescript
public readonly notificationArns: string[];
```

- *Type:* string[]

Returns the list of notification Amazon Resource Names (ARNs) for the current stack.

---

##### `partition`<sup>Required</sup> <a name="partition" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.partition"></a>

```typescript
public readonly partition: string;
```

- *Type:* string

The partition in which this stack is defined.

---

##### `region`<sup>Required</sup> <a name="region" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string

The AWS region into which this stack will be deployed (e.g. `us-west-2`).

This value is resolved according to the following rules:

1. The value provided to `env.region` when the stack is defined. This can
   either be a concrete region (e.g. `us-west-2`) or the `Aws.REGION`
   token.
3. `Aws.REGION`, which is represents the CloudFormation intrinsic reference
   `{ "Ref": "AWS::Region" }` encoded as a string token.

Preferably, you should use the return value as an opaque string and not
attempt to parse it to implement your logic. If you do, you must first
check that it is a concrete value an not an unresolved token. If this
value is an unresolved token (`Token.isUnresolved(stack.region)` returns
`true`), this implies that the user wishes that this stack will synthesize
into a **region-agnostic template**. In this case, your code should either
fail (throw an error, emit a synth error using `Annotations.of(construct).addError()`) or
implement some other region-agnostic behavior.

---

##### `stackId`<sup>Required</sup> <a name="stackId" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.stackId"></a>

```typescript
public readonly stackId: string;
```

- *Type:* string

The ID of the stack.

---

*Example*

```typescript
// After resolving, looks like
'arn:aws:cloudformation:us-west-2:123456789012:stack/teststack/51af3dc0-da77-11e4-872e-1234567db123'
```


##### `stackName`<sup>Required</sup> <a name="stackName" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.stackName"></a>

```typescript
public readonly stackName: string;
```

- *Type:* string

The concrete CloudFormation physical stack name.

This is either the name defined explicitly in the `stackName` prop or
allocated based on the stack's location in the construct tree. Stacks that
are directly defined under the app use their construct `id` as their stack
name. Stacks that are defined deeper within the tree will use a hashed naming
scheme based on the construct path to ensure uniqueness.

If you wish to obtain the deploy-time AWS::StackName intrinsic,
you can use `Aws.STACK_NAME` directly.

---

##### `synthesizer`<sup>Required</sup> <a name="synthesizer" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.synthesizer"></a>

```typescript
public readonly synthesizer: IStackSynthesizer;
```

- *Type:* aws-cdk-lib.IStackSynthesizer

Synthesis method for this stack.

---

##### `tags`<sup>Required</sup> <a name="tags" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.tags"></a>

```typescript
public readonly tags: TagManager;
```

- *Type:* aws-cdk-lib.TagManager

Tags to be applied to the stack.

---

##### `templateFile`<sup>Required</sup> <a name="templateFile" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.templateFile"></a>

```typescript
public readonly templateFile: string;
```

- *Type:* string

The name of the CloudFormation template file emitted to the output directory during synthesis.

Example value: `MyStack.template.json`

---

##### `templateOptions`<sup>Required</sup> <a name="templateOptions" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.templateOptions"></a>

```typescript
public readonly templateOptions: ITemplateOptions;
```

- *Type:* aws-cdk-lib.ITemplateOptions

Options for CloudFormation template (like version, transform, description).

---

##### `urlSuffix`<sup>Required</sup> <a name="urlSuffix" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.urlSuffix"></a>

```typescript
public readonly urlSuffix: string;
```

- *Type:* string

The Amazon domain suffix for the region in which this stack is defined.

---

##### `nestedStackParent`<sup>Optional</sup> <a name="nestedStackParent" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.nestedStackParent"></a>

```typescript
public readonly nestedStackParent: Stack;
```

- *Type:* aws-cdk-lib.Stack

If this is a nested stack, returns it's parent stack.

---

##### `nestedStackResource`<sup>Optional</sup> <a name="nestedStackResource" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.nestedStackResource"></a>

```typescript
public readonly nestedStackResource: CfnResource;
```

- *Type:* aws-cdk-lib.CfnResource

If this is a nested stack, this represents its `AWS::CloudFormation::Stack` resource.

`undefined` for top-level (non-nested) stacks.

---

##### `terminationProtection`<sup>Optional</sup> <a name="terminationProtection" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStack.property.terminationProtection"></a>

```typescript
public readonly terminationProtection: boolean;
```

- *Type:* boolean

Whether termination protection is enabled for this stack.

---


## Structs <a name="Structs" id="Structs"></a>

### RdsDatabaseRunningScheduleStackProps <a name="RdsDatabaseRunningScheduleStackProps" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps"></a>

#### Initializer <a name="Initializer" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.Initializer"></a>

```typescript
import { RdsDatabaseRunningScheduleStackProps } from '@gammarers/aws-rds-database-running-schedule-stack'

const rdsDatabaseRunningScheduleStackProps: RdsDatabaseRunningScheduleStackProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.analyticsReporting">analyticsReporting</a></code> | <code>boolean</code> | Include runtime versioning information in this Stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.crossRegionReferences">crossRegionReferences</a></code> | <code>boolean</code> | Enable this flag to allow native cross region stack references. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.description">description</a></code> | <code>string</code> | A description of the stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.env">env</a></code> | <code>aws-cdk-lib.Environment</code> | The AWS environment (account/region) where this stack will be deployed. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.permissionsBoundary">permissionsBoundary</a></code> | <code>aws-cdk-lib.PermissionsBoundary</code> | Options for applying a permissions boundary to all IAM Roles and Users created within this Stage. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.stackName">stackName</a></code> | <code>string</code> | Name to deploy the stack with. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.synthesizer">synthesizer</a></code> | <code>aws-cdk-lib.IStackSynthesizer</code> | Synthesis method to use while deploying this stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Stack tags that will be applied to all the taggable resources and the stack itself. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.terminationProtection">terminationProtection</a></code> | <code>boolean</code> | Whether to enable termination protection for this stack. |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.targets">targets</a></code> | <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.TargetProperty">TargetProperty</a>[]</code> | *No description.* |

---

##### `analyticsReporting`<sup>Optional</sup> <a name="analyticsReporting" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.analyticsReporting"></a>

```typescript
public readonly analyticsReporting: boolean;
```

- *Type:* boolean
- *Default:* `analyticsReporting` setting of containing `App`, or value of 'aws:cdk:version-reporting' context key

Include runtime versioning information in this Stack.

---

##### `crossRegionReferences`<sup>Optional</sup> <a name="crossRegionReferences" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.crossRegionReferences"></a>

```typescript
public readonly crossRegionReferences: boolean;
```

- *Type:* boolean
- *Default:* false

Enable this flag to allow native cross region stack references.

Enabling this will create a CloudFormation custom resource
in both the producing stack and consuming stack in order to perform the export/import

This feature is currently experimental

---

##### `description`<sup>Optional</sup> <a name="description" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string
- *Default:* No description.

A description of the stack.

---

##### `env`<sup>Optional</sup> <a name="env" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.env"></a>

```typescript
public readonly env: Environment;
```

- *Type:* aws-cdk-lib.Environment
- *Default:* The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.

The AWS environment (account/region) where this stack will be deployed.

Set the `region`/`account` fields of `env` to either a concrete value to
select the indicated environment (recommended for production stacks), or to
the values of environment variables
`CDK_DEFAULT_REGION`/`CDK_DEFAULT_ACCOUNT` to let the target environment
depend on the AWS credentials/configuration that the CDK CLI is executed
under (recommended for development stacks).

If the `Stack` is instantiated inside a `Stage`, any undefined
`region`/`account` fields from `env` will default to the same field on the
encompassing `Stage`, if configured there.

If either `region` or `account` are not set nor inherited from `Stage`, the
Stack will be considered "*environment-agnostic*"". Environment-agnostic
stacks can be deployed to any environment but may not be able to take
advantage of all features of the CDK. For example, they will not be able to
use environmental context lookups such as `ec2.Vpc.fromLookup` and will not
automatically translate Service Principals to the right format based on the
environment's AWS partition, and other such enhancements.

---

*Example*

```typescript
// Use a concrete account and region to deploy this stack to:
// `.account` and `.region` will simply return these values.
new Stack(app, 'Stack1', {
  env: {
    account: '123456789012',
    region: 'us-east-1'
  },
});

// Use the CLI's current credentials to determine the target environment:
// `.account` and `.region` will reflect the account+region the CLI
// is configured to use (based on the user CLI credentials)
new Stack(app, 'Stack2', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
});

// Define multiple stacks stage associated with an environment
const myStage = new Stage(app, 'MyStage', {
  env: {
    account: '123456789012',
    region: 'us-east-1'
  }
});

// both of these stacks will use the stage's account/region:
// `.account` and `.region` will resolve to the concrete values as above
new MyStack(myStage, 'Stack1');
new YourStack(myStage, 'Stack2');

// Define an environment-agnostic stack:
// `.account` and `.region` will resolve to `{ "Ref": "AWS::AccountId" }` and `{ "Ref": "AWS::Region" }` respectively.
// which will only resolve to actual values by CloudFormation during deployment.
new MyStack(app, 'Stack1');
```


##### `permissionsBoundary`<sup>Optional</sup> <a name="permissionsBoundary" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.permissionsBoundary"></a>

```typescript
public readonly permissionsBoundary: PermissionsBoundary;
```

- *Type:* aws-cdk-lib.PermissionsBoundary
- *Default:* no permissions boundary is applied

Options for applying a permissions boundary to all IAM Roles and Users created within this Stage.

---

##### `stackName`<sup>Optional</sup> <a name="stackName" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.stackName"></a>

```typescript
public readonly stackName: string;
```

- *Type:* string
- *Default:* Derived from construct path.

Name to deploy the stack with.

---

##### `synthesizer`<sup>Optional</sup> <a name="synthesizer" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.synthesizer"></a>

```typescript
public readonly synthesizer: IStackSynthesizer;
```

- *Type:* aws-cdk-lib.IStackSynthesizer
- *Default:* The synthesizer specified on `App`, or `DefaultStackSynthesizer` otherwise.

Synthesis method to use while deploying this stack.

The Stack Synthesizer controls aspects of synthesis and deployment,
like how assets are referenced and what IAM roles to use. For more
information, see the README of the main CDK package.

If not specified, the `defaultStackSynthesizer` from `App` will be used.
If that is not specified, `DefaultStackSynthesizer` is used if
`@aws-cdk/core:newStyleStackSynthesis` is set to `true` or the CDK major
version is v2. In CDK v1 `LegacyStackSynthesizer` is the default if no
other synthesizer is specified.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}
- *Default:* {}

Stack tags that will be applied to all the taggable resources and the stack itself.

---

##### `terminationProtection`<sup>Optional</sup> <a name="terminationProtection" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.terminationProtection"></a>

```typescript
public readonly terminationProtection: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to enable termination protection for this stack.

---

##### `targets`<sup>Required</sup> <a name="targets" id="@gammarers/aws-rds-database-running-schedule-stack.RdsDatabaseRunningScheduleStackProps.property.targets"></a>

```typescript
public readonly targets: TargetProperty[];
```

- *Type:* <a href="#@gammarers/aws-rds-database-running-schedule-stack.TargetProperty">TargetProperty</a>[]

---

### ScheduleProperty <a name="ScheduleProperty" id="@gammarers/aws-rds-database-running-schedule-stack.ScheduleProperty"></a>

#### Initializer <a name="Initializer" id="@gammarers/aws-rds-database-running-schedule-stack.ScheduleProperty.Initializer"></a>

```typescript
import { ScheduleProperty } from '@gammarers/aws-rds-database-running-schedule-stack'

const scheduleProperty: ScheduleProperty = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.ScheduleProperty.property.timezone">timezone</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.ScheduleProperty.property.hour">hour</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.ScheduleProperty.property.minute">minute</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.ScheduleProperty.property.week">week</a></code> | <code>string</code> | *No description.* |

---

##### `timezone`<sup>Required</sup> <a name="timezone" id="@gammarers/aws-rds-database-running-schedule-stack.ScheduleProperty.property.timezone"></a>

```typescript
public readonly timezone: string;
```

- *Type:* string

---

##### `hour`<sup>Optional</sup> <a name="hour" id="@gammarers/aws-rds-database-running-schedule-stack.ScheduleProperty.property.hour"></a>

```typescript
public readonly hour: string;
```

- *Type:* string

---

##### `minute`<sup>Optional</sup> <a name="minute" id="@gammarers/aws-rds-database-running-schedule-stack.ScheduleProperty.property.minute"></a>

```typescript
public readonly minute: string;
```

- *Type:* string

---

##### `week`<sup>Optional</sup> <a name="week" id="@gammarers/aws-rds-database-running-schedule-stack.ScheduleProperty.property.week"></a>

```typescript
public readonly week: string;
```

- *Type:* string

---

### TargetProperty <a name="TargetProperty" id="@gammarers/aws-rds-database-running-schedule-stack.TargetProperty"></a>

#### Initializer <a name="Initializer" id="@gammarers/aws-rds-database-running-schedule-stack.TargetProperty.Initializer"></a>

```typescript
import { TargetProperty } from '@gammarers/aws-rds-database-running-schedule-stack'

const targetProperty: TargetProperty = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.TargetProperty.property.identifiers">identifiers</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.TargetProperty.property.startSchedule">startSchedule</a></code> | <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.ScheduleProperty">ScheduleProperty</a></code> | *No description.* |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.TargetProperty.property.stopSchedule">stopSchedule</a></code> | <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.ScheduleProperty">ScheduleProperty</a></code> | *No description.* |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.TargetProperty.property.type">type</a></code> | <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.DatabaseType">DatabaseType</a></code> | *No description.* |

---

##### `identifiers`<sup>Required</sup> <a name="identifiers" id="@gammarers/aws-rds-database-running-schedule-stack.TargetProperty.property.identifiers"></a>

```typescript
public readonly identifiers: string[];
```

- *Type:* string[]

---

##### `startSchedule`<sup>Required</sup> <a name="startSchedule" id="@gammarers/aws-rds-database-running-schedule-stack.TargetProperty.property.startSchedule"></a>

```typescript
public readonly startSchedule: ScheduleProperty;
```

- *Type:* <a href="#@gammarers/aws-rds-database-running-schedule-stack.ScheduleProperty">ScheduleProperty</a>

---

##### `stopSchedule`<sup>Required</sup> <a name="stopSchedule" id="@gammarers/aws-rds-database-running-schedule-stack.TargetProperty.property.stopSchedule"></a>

```typescript
public readonly stopSchedule: ScheduleProperty;
```

- *Type:* <a href="#@gammarers/aws-rds-database-running-schedule-stack.ScheduleProperty">ScheduleProperty</a>

---

##### `type`<sup>Required</sup> <a name="type" id="@gammarers/aws-rds-database-running-schedule-stack.TargetProperty.property.type"></a>

```typescript
public readonly type: DatabaseType;
```

- *Type:* <a href="#@gammarers/aws-rds-database-running-schedule-stack.DatabaseType">DatabaseType</a>

---



## Enums <a name="Enums" id="Enums"></a>

### DatabaseType <a name="DatabaseType" id="@gammarers/aws-rds-database-running-schedule-stack.DatabaseType"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.DatabaseType.CLUSTER">CLUSTER</a></code> | *No description.* |
| <code><a href="#@gammarers/aws-rds-database-running-schedule-stack.DatabaseType.INSTANCE">INSTANCE</a></code> | *No description.* |

---

##### `CLUSTER` <a name="CLUSTER" id="@gammarers/aws-rds-database-running-schedule-stack.DatabaseType.CLUSTER"></a>

---


##### `INSTANCE` <a name="INSTANCE" id="@gammarers/aws-rds-database-running-schedule-stack.DatabaseType.INSTANCE"></a>

---

