import {Bud, factory} from '@repo/test-kit'
import {beforeEach, describe, expect, it} from 'vitest'

import {Server} from './index.js'

describe(`@roots/bud-server`, () => {
  let bud: Bud
  let instance: Server

  beforeEach(async () => {
    bud = await factory({mode: `development`})

    expect(bud.context.dry).toBe(true)
    expect(bud.mode).toBe(`development`)

    try {
      instance = new Server(() => bud)
      if (instance.register) await instance.register(bud)
      if (instance.serverBefore) await instance.serverBefore(bud)
    } catch (e) {}
  })

  it(`should be an instance of Server`, () => {
    expect(instance).toBeInstanceOf(Server)
  })

  it(`should have run method`, () => {
    expect(instance.run).toBeInstanceOf(Function)
  })

  it(`should have availableMiddleware property`, async () => {
    expect(instance.availableMiddleware).toMatchSnapshot()
  })

  it(`should have enabledMiddleware property`, async () => {
    expect(instance.enabledMiddleware).toMatchSnapshot()
  })

  it(`should have an application property that is an express application`, async () => {
    expect(instance.application).toHaveProperty(`set`)
    expect(instance.application).toHaveProperty(`get`)
    expect(instance.application).toHaveProperty(`listen`)
  })

  it(`should have a watcher property`, async () => {
    expect(instance.watcher).toBeInstanceOf(
      await import(`@roots/bud-server/server/watcher`).then(
        ({Watcher}) => Watcher,
      ),
    )
  })
})
