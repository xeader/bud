---
id: "Item"
title: "Class: Item"
sidebar_label: "Item"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `Base`

  ↳ **`Item`**

## Implements

- `Item`

## Constructors

### constructor

• **new Item**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `ConstructorOptions` |

#### Overrides

Base.constructor

#### Defined in

packages/@roots/bud-build/types/Item/index.d.ts:6

## Properties

### loader

• `Protected` **loader**: `LoaderFn`

#### Defined in

packages/@roots/bud-build/types/Item/index.d.ts:4

___

### options

• `Protected` **options**: `OptionsFn`

#### Defined in

packages/@roots/bud-build/types/Item/index.d.ts:5

## Methods

### getLoader

▸ **getLoader**(`app`): `Loader`

#### Parameters

| Name | Type |
| :------ | :------ |
| `app` | [`Framework`](Framework.md) |

#### Returns

`Loader`

#### Defined in

packages/@roots/bud-build/types/Item/index.d.ts:7

___

### make

▸ **make**(`app`): `Output`

#### Parameters

| Name | Type |
| :------ | :------ |
| `app` | [`Framework`](Framework.md) |

#### Returns

`Output`

#### Implementation of

Build.Item.make

#### Defined in

packages/@roots/bud-build/types/Item/index.d.ts:11

___

### mergeOptions

▸ **mergeOptions**(`options`, `app`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Options` |
| `app` | [`Framework`](Framework.md) |

#### Returns

`void`

#### Implementation of

Build.Item.mergeOptions

#### Defined in

packages/@roots/bud-build/types/Item/index.d.ts:10

___

### normalizeInput

▸ **normalizeInput**<`T`\>(`input`): (`app`: [`Framework`](Framework.md)) => `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `T` \| (`app`: [`Framework`](Framework.md)) => `T` |

#### Returns

`fn`

▸ (`app`): `T`

##### Parameters

| Name | Type |
| :------ | :------ |
| `app` | [`Framework`](Framework.md) |

##### Returns

`T`

#### Inherited from

Base.normalizeInput

#### Defined in

packages/@roots/bud-build/types/shared/Base.d.ts:3

___

### setLoader

▸ **setLoader**(`loader`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `loader` | `Loader` \| `LoaderFn` |

#### Returns

`void`

#### Implementation of

Build.Item.setLoader

#### Defined in

packages/@roots/bud-build/types/Item/index.d.ts:8

___

### setOptions

▸ **setOptions**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `OptionsFn` \| `Options` |

#### Returns

`void`

#### Implementation of

Build.Item.setOptions

#### Defined in

packages/@roots/bud-build/types/Item/index.d.ts:9