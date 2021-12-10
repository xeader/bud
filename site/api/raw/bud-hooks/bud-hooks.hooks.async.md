<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@roots/bud-hooks](./bud-hooks.md) &gt; [Hooks](./bud-hooks.hooks.md) &gt; [async](./bud-hooks.hooks.async.md)

## Hooks.async() method

Register a function to filter a value.

<b>Signature:</b>

```typescript
async<T extends keyof Contract.Map & string>(id: T, callback: Contract.Map[T] | ((value: Contract.Map[T]) => Promise<Contract.Map[T]>)): Framework;
```
<b>Decorators:</b>

`@bind`

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  id | T |  |
|  callback | Contract.Map\[T\] \| ((value: Contract.Map\[T\]) =&gt; Promise&lt;Contract.Map\[T\]&gt;) |  |

<b>Returns:</b>

Framework

## Remarks

If a filter calls for this name the function is then run, passing whatever data along for modification. If more than one hook is registered to a name, they will be called sequentially in the order they were registered, with each hook's output used as the input for the next.

## Example


```js
app.hooks.on(
  'namespace.key',
  value => 'replaced by this string',
)
```
