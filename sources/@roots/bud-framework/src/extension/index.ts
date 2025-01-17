import type {Bud} from '@roots/bud-framework'
import type {Modules} from '@roots/bud-framework'
import type {Compiler} from '@roots/bud-framework/config'
import type {ApplyPluginConstructor} from '@roots/bud-framework/extension/decorators/plugin'

import {bind} from '@roots/bud-support/decorators/bind'
import {BudError, ExtensionError} from '@roots/bud-support/errors'
import get from '@roots/bud-support/lodash/get'
import isFunction from '@roots/bud-support/lodash/isFunction'
import isObject from '@roots/bud-support/lodash/isObject'
import isUndefined from '@roots/bud-support/lodash/isUndefined'
import set from '@roots/bud-support/lodash/set'
import logger from '@roots/bud-support/logger'
import DynamicOption from '@roots/bud-support/value'

export type Options<T = Record<string, any>> = {
  [K in keyof T as `${K & string}`]?: T[K]
}

export type InternalOptionsValues<T extends Options> = {
  [K in keyof T as `${K & string}`]:
    | DynamicOption<(app: Bud) => T[K]>
    | T[K]
}

export type OptionCallback<
  T extends Options,
  K extends `${keyof Options & string}`,
> = ((value: T[K]) => T[K]) | T[K]

export type OptionCallbackValue<
  T extends Options,
  K extends `${keyof Options & string}`,
> = ((value: T[K]) => T[K]) | InternalOptionsValues<T>[K]

export type OptionSetter<
  Extension,
  Options,
  Property extends `${keyof Options & string}`,
> = (value: OptionCallbackValue<Options, Property>) => Extension

export type OptionGetter<
  Options extends Record<string, any>,
  Property extends `${keyof Options & string}`,
> = () => Options[Property]

export type OptionAccessor<
  Options extends Record<string, any>,
  Property extends `${keyof Options & string}`,
> = Options[Property]

export type Option<
  Extension,
  Options extends Record<string, any>,
  Property extends `${keyof Options & string}`,
> = {
  get: OptionGetter<Options, Property>
  set: OptionSetter<Extension, Options, Property>
  value: OptionAccessor<Options, Property>
}

export interface Meta {
  boot: boolean
  buildAfter: boolean
  buildBefore: boolean
  configAfter: boolean
  register: boolean
}

/**
 * Webpack plugin.
 */
export interface ApplyPlugin {
  /**
   * @see {@link https://webpack.js.org/contribute/writing-a-plugin/#basic-plugin-architecture}
   */
  apply?(...args: any[]): unknown
}

export interface Constructor {
  new (...args: any[]): Extension
}

export type WithOptions<Context, Options> = {
  [Prop in keyof Options as `get${Capitalize<
    Prop & string
  >}`]: () => Options[Prop]
} & {
  [Prop in keyof Options as `set${Capitalize<Prop & string>}`]: (
    value: OptionCallbackValue<Options, `${Prop & string}`>,
  ) => Context
} & {
  [K in keyof Options as `${K & string}`]: Options[K]
}

export type StrictPublicExtensionApi<Context, Opts extends Options> = {
  app: Bud
  enable: (boolean?: boolean) => Context
  enabled: boolean
  get: <K extends `${keyof Opts & string}`>(key: K) => Opts[K]
  getOptions: () => Opts
  logger: typeof logger
  options: Opts
  set: <K extends `${keyof Opts & string}`>(
    key: K,
    value: ((value: Opts[K]) => Opts[K]) | Opts[K],
  ) => Context
  setOptions: (O: Partial<InternalOptionsValues<Opts>>) => Context
} & WithOptions<Context, Opts>

export type PublicExtensionApi<E extends Extension = Extension> = {
  app: E[`app`]
  enable: E['enable']
  enabled: E['enabled']
  get: E[`getOption`]
  getOption: E[`getOption`]
  getOptions: E[`getOptions`]
  options: E['options']
  set: E[`set`]
  setOption: E[`setOption`]
  setOptions: E[`setOptions`]
}

export type ExtensionLiteral = Partial<Extension>

export type * as Logger from '@roots/bud-support/logger'

/**
 * Bud extension
 */
export class Extension<
  ExtensionOptions extends Options = Options,
  Plugin extends ApplyPlugin = ApplyPlugin,
> {
  /**
   * Application
   */
  public _app: () => Bud

  /**
   * Extension options
   */
  public _options: Partial<InternalOptionsValues<ExtensionOptions>>

  /**
   * Depends on
   */
  public dependsOn?: Set<keyof Modules & string>

  /**
   * Depends on (optional)
   */
  public dependsOnOptional?: Set<`${keyof Modules & string}`>

  /**
   * Is extension enabled
   *
   * @remarks
   * The following methods are skipped if `enabled` is false:
   * - {@link Extension.buildBefore}
   * - {@link Extension.make}
   */
  public enabled: boolean = true

  public get = this.getOption

  /**
   * The module name
   */
  public label: `${keyof Modules & string}`

  /**
   * Extension meta
   */
  public meta: Meta = {
    boot: false,
    buildAfter: false,
    buildBefore: false,
    configAfter: false,
    register: false,
  }

  /**
   * Extension options
   *
   * @readonly
   */
  public options: ExtensionOptions

  /**
   * Plugin constructor
   */
  public plugin?: ApplyPluginConstructor

  public set = this.setOption

  /**
   * Class constructor
   */
  public constructor(app: Bud) {
    this._app = () => app

    this._options = this.options ? {...this.options} : {}
    delete this.options

    Object.defineProperty(this, `options`, {
      get: this.getOptions.bind(this),
    })
  }

  /**
   * `boot` callback handler
   */
  @bind
  public async _boot() {
    if (isUndefined(this.boot)) return

    if (this.meta[`boot`] === true) return
    this.meta[`boot`] = true

    await this.boot(this.app).catch(this.catch)
  }

  /**
   * `buildAfter` callback handler
   */
  @bind
  public async _buildAfter() {
    if (isUndefined(this.buildAfter)) return
    if (!this.isEnabled()) return

    if (this.meta[`buildAfter`] === true) return
    this.meta[`buildAfter`] = true

    await this.buildAfter(this.app).catch(this.catch)
  }

  /**
   * `buildBefore` callback handler
   */
  @bind
  public async _buildBefore() {
    if (isUndefined(this.buildBefore)) return
    if (!this.isEnabled()) return

    if (this.meta[`buildBefore`] === true) return
    this.meta[`buildBefore`] = true

    await this.buildBefore(this.app).catch(this.catch)
  }

  /**
   * `configAfter` callback handler
   */
  @bind
  public async _configAfter() {
    if (isUndefined(this.configAfter)) return

    if (this.meta[`configAfter`] === true) return
    this.meta[`configAfter`] = true

    await this.configAfter(this.app).catch(this.catch)
  }

  /**
   * `make` callback handler
   */
  @bind
  public async _make() {
    if (isUndefined(this.make) && isUndefined(this.plugin)) return false
    if (this.isEnabled() === false) return false

    try {
      if (!isUndefined(this.apply)) {
        this.logger.info(`apply prop found. return extension instance`)
        return this
      }

      if (!isUndefined(this.plugin)) {
        const plugin = new this.plugin({...this.options})
        this.logger.success(`produced webpack plugin`)
        return plugin
      }

      if (!isUndefined(this.make)) {
        const plugin = await this.make(this.app, {...this.options})
        this.logger.success(`produced webpack plugin`)
        return plugin
      }
    } catch (error) {
      this.catch(error)
    }
  }

  /**
   * `register` callback handler
   */
  @bind
  public async _register() {
    if (isUndefined(this.register)) return

    if (this.meta[`register`] === true) return
    this.meta[`register`] = true

    await this.register(this.app).catch(this.catch)
  }

  /**
   * Application accessor
   */
  public get app(): Bud {
    return this._app()
  }

  /**
   * {@link ApplyPlugin.apply}
   */
  public apply?(compiler: Compiler): unknown | void

  /**
   * `boot` callback
   */
  public async boot?(app: Bud): Promise<unknown | void>

  /**
   * `buildAfter` callback
   */
  public async buildAfter?(app: Bud): Promise<unknown | void>

  /**
   * `buildBefore` callback
   */
  public async buildBefore?(app: Bud): Promise<unknown | void>

  @bind
  public catch(error: Error | string): never {
    const thrownBy =
      this.label ?? this.constructor?.name ?? `unknown_extension`

    if (error instanceof ExtensionError) {
      error.instance = this.app.label
      error.thrownBy = error.thrownBy ?? thrownBy
      throw error
    }

    throw new ExtensionError(
      typeof error === `string` ? error : error.message,
      {
        docs: new URL(`https://bud.js.org/docs/extensions`),
        issue: new URL(
          `https://github.com/roots/bud/search?q=is:issue+${thrownBy} in:title`,
        ),
        origin: BudError.normalize(error),
        thrownBy,
      },
    )
  }

  /**
   * `configAfter` callback
   */
  public async configAfter?(app: Bud): Promise<unknown | void>

  /**
   * Disable extension
   * @deprecated pass `false` to {@link Extension.enable}
   */
  @bind
  public disable() {
    this.enabled = false
  }

  /**
   * Return to bud instance from extension
   */
  @bind
  public done(): Bud {
    return this.app
  }

  /**
   * Enable extension
   */
  @bind
  public enable(enabled: boolean = true) {
    this.enabled = enabled
    return this
  }

  /**
   * Get extension option
   */
  @bind
  public getOption<K extends string>(key: K): ExtensionOptions[K] {
    return get(this.options, key)
  }

  public getOptions(): ExtensionOptions {
    return Object.entries(this._options).reduce((acc, [key, value]) => {
      if (isUndefined(value)) return acc
      if (!isObject(value)) return {...acc, [key]: value}

      const isDynamicOption = (
        value: any,
      ): value is DynamicOption<any> => {
        return (
          value instanceof DynamicOption ||
          (`isBudValue` in value && value.isBudValue)
        )
      }

      const unwrapped = isDynamicOption(value)
        ? value.get()(this.app)
        : value

      if (isUndefined(unwrapped)) return acc
      return {...acc, [key]: unwrapped}
    }, {} as ExtensionOptions)
  }
  /**
   * Import ESM module
   */
  @bind
  public async import<T = any>(
    signifier: string,
    context?: string,
    options: {bustCache?: boolean; raw?: boolean} = {
      bustCache: false,
      raw: false,
    },
  ): Promise<T | undefined> {
    return await this.app.module
      .import(signifier, context, options)
      .catch(this.catch)
  }

  /**
   * Is extension enabled?
   */
  @bind
  public isEnabled(): boolean {
    return this.when(this.app, this.options)
  }
  /**
   * Logger instance
   */
  public get logger(): any {
    return logger.scope(...[this.app.label, this.label].filter(Boolean))
  }

  /**
   * `make` callback
   */
  public async make?(app: Bud, options?: ExtensionOptions): Promise<Plugin>

  /**
   * {@link Extension.register}
   */
  public async register?(app: Bud): Promise<any>

  /**
   * Resolve module using `import.meta.resolve` api
   */
  @bind
  public async resolve(
    signifier: string,
    context?: string,
  ): Promise<string> {
    try {
      return await this.app.module.resolve(signifier, context)
    } catch (error) {
      this.catch(
        new ExtensionError(`could not resolve ${signifier}`, {
          origin: error,
          thrownBy: this.label,
        }),
      )
    }
  }

  /**
   * Set extension option
   */
  @bind
  public setOption<K extends string>(
    key: K,
    valueOrCallback: OptionCallbackValue<ExtensionOptions, K>,
  ): this {
    if (isFunction(valueOrCallback)) {
      set(this._options, key, valueOrCallback(this.get(key)))
      return this
    }

    set(this._options, key, valueOrCallback)
    return this
  }

  /**
   * Set extension options
   */
  public setOptions(
    value: Partial<InternalOptionsValues<ExtensionOptions>>,
  ): this {
    this._options = value
    return this
  }

  /**
   * Function returning a boolean indicating if the {@link Extension} should be utilized.
   *
   * @remarks
   * By default returns {@link Extension.enabled}
   */
  public when(bud: Bud, options?: ExtensionOptions): boolean {
    return this.enabled
  }
}

export {DynamicOption}
