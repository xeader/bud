import type {
  CompilationHooks,
  Entrypoints,
  Options,
} from '@roots/entrypoints-webpack-plugin'

import {SyncHook, SyncWaterfallHook} from 'tapable'
import Webpack from 'webpack'

import {HtmlEmitter} from './html.emitter.js'

/**
 * {@link https://webpack.js.org/api/plugins/#custom-hooks}
 */
const hookMap = new WeakMap<Webpack.Compilation, CompilationHooks>()

/**
 * Produces `entrypoints.json` artifact with compiled assets broken down
 * by entrypoint and then filetype.
 *
 * @example
 * ```js
 * import {EntrypointsWebpackPlugin} from '@roots/entrypoints-webpack-plugin'
 *
 * const config = {
 *   plugins: [new EntrypointsWebpackPlugin()]
 * }
 * ```
 */
export class EntrypointsWebpackPlugin {
  /**
   * Collected assets
   */
  public entrypoints: Entrypoints

  /**
   * Plugin compiler ident
   */
  protected plugin = {
    name: `EntrypointsManifestPlugin`,
    stage: Infinity,
  }

  /**
   * Class constructor
   */
  public constructor(public options: Options) {
    if (!this.options.type) {
      this.options.type = `object`
    }

    if (!this.options.publicPath || this.options.publicPath === `auto`) {
      this.options.publicPath = ``
    }

    if (!this.options.name) {
      this.options.name = `entrypoints.json`
    }

    this.entrypoints = new Map()

    this.addToManifest = this.addToManifest.bind(this)
    this.getChunkedFiles = this.getChunkedFiles.bind(this)
    this.apply = this.apply.bind(this)
  }

  /**
   * Compilation hooks
   *
   * @param compilation
   * @returns
   */
  public static getCompilationHooks(
    compilation: Webpack.Compilation,
  ): CompilationHooks {
    let hooks: CompilationHooks = hookMap.get(compilation)

    if (hooks === undefined) {
      hooks = {
        compilation: new SyncHook([`compilation`]),
        entrypoints: new SyncWaterfallHook([`entrypoints`]),
      }
      hookMap.set(compilation, hooks)
    }

    return hooks
  }

  public addToManifest({
    ident,
    path,
    type,
  }: {
    ident: string
    path: string
    type: string
  }) {
    !this.entrypoints.has(ident) && this.entrypoints.set(ident, new Map())

    !this.entrypoints.get(ident).has(type)
      ? this.entrypoints.get(ident).set(type, new Set([path]))
      : this.entrypoints.get(ident).get(type).add(path)
  }

  /**
   * Webpack plugin API's `apply` hook
   */
  public apply(compiler: Webpack.Compiler): void {
    compiler.hooks.thisCompilation.tap(
      this.constructor.name,
      compilation => {
        compilation.hooks.processAssets.tapPromise(
          {
            name: this.constructor.name,
            stage: Webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
          },
          async assets => {
            const hooks =
              EntrypointsWebpackPlugin.getCompilationHooks(compilation)
            hooks.compilation.call(compilation)

            this.entrypoints = new Map()

            for (const entry of compilation.entrypoints.values()) {
              this.getChunkedFiles(entry.chunks).map(({file}) => {
                const ident = entry.name
                const path = this.options.publicPath.concat(file)
                const type = path.split(`.`).pop()

                this.addToManifest({ident, path, type})
              })
            }

            this.entrypoints = hooks.entrypoints.call(this.entrypoints)

            if (this.options.emitHtml) {
              new HtmlEmitter(
                compilation,
                assets,
                this.entrypoints,
                this.options.publicPath,
              ).emit()
            }

            let source = {}
            for (const [name, entry] of this.entrypoints.entries()) {
              if (!source[name]) source[name] = {}

              for (const [type, assets] of entry.entries()) {
                if (!source[name][type]) source[name][type] = []

                source[name][type] = [...assets]
              }
            }

            compilation.emitAsset(
              this.options.name,
              new compiler.webpack.sources.RawSource(
                JSON.stringify(source, null, 2),
              ),
            )
          },
        )
      },
    )
  }

  /**
   * Get assets from an entrypoint
   */
  public getChunkedFiles(chunks: Webpack.Chunk[]) {
    const files = []

    for (const chunk of chunks) {
      Array.from(chunk.files).map(file => {
        files.push({file, ident: chunk.name})
      })
    }

    return files
  }
}
