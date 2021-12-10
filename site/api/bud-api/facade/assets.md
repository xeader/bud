---
id: bud-api.facade.assets
title: assets property
sidebar_label: assets property
hide_title: true
sidebar: "api"
slug: assets
---

## Facade.assets property

Copy static assets during compilation.

Signature:

```typescript
assets: assets.facade;
```

## Remarks

You may specify paths with a string literal or glob pattern.

## Example

Copy \*\*src/images\*\* to \*\*dist/images\*\*

```js
app.assets(["src/images"]);
```