## API Report File for "@roots/bud"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { Api as Api_2 } from '@roots/bud-api';
import { Build as Build_2 } from '@roots/bud-build';
import { Cache as Cache_3 } from '@roots/bud-cache';
import { Compiler as Compiler_2 } from '@roots/bud-compiler';
import { CompilerPlugin } from '@roots/bud-framework/types/Extensions/Extension';
import type { Configuration } from '@roots/bud-framework';
import { Container } from '@roots/container';
import { Dashboard as Dashboard_2 } from '@roots/bud-dashboard';
import { Dependencies as Dependencies_2 } from '@roots/dependencies';
import type { Env as Env_2 } from '@roots/bud-framework';
import { Extension } from '@roots/bud-framework';
import { Extensions as Extensions_2 } from '@roots/bud-extensions';
import { Framework } from '@roots/bud-framework';
import * as Framework_2 from '@roots/bud-framework';
import { Hooks as Hooks_2 } from '@roots/bud-hooks';
import { Hooks as Hooks_3 } from '@roots/bud-framework';
import type { Peers as Peers_2 } from '@roots/bud-framework';
import { Server as Server_2 } from '@roots/bud-server';
import { Service as Service_2 } from '@roots/bud-framework';

// @public
class Api extends Api_2 {
    ident: string;
}

// @public
export class Bud extends Framework {
    // Warning: (ae-forgotten-export) The symbol "Service" needs to be exported by the entry point index.d.ts
    api: Service.Api;
    build: Service.Build;
    cache: Service.Cache;
    children: Container<Record<string, Bud>>;
    dashboard: Service.Dashboard;
    dependencies: Service.Dependencies;
    env: Service.Env;
    extensions: Service.Extensions;
    get hasChildren(): boolean;
    // @internal
    implementation: Framework_2.Constructor;
    get isChild(): boolean;
    get isRoot(): boolean;
    project: Service.Project;
    root: Bud | null;
}

// @public (undocumented)
export namespace Bud {
    export type Options = Framework_2.Options;
}

// @public
class Build extends Build_2 {
    ident: string;
}

// @public (undocumented)
class Cache_2 extends Cache_3 implements Service_2 {
    ident: string;
}

// @public (undocumented)
class Compiler extends Compiler_2 {
    ident: string;
}

// @public
export const config: Configuration;

// @public (undocumented)
class Dashboard extends Dashboard_2 {
    ident: string;
}

// @public
class Dependencies extends Framework_2.Service implements Framework_2.Dependencies {
    client: Dependencies_2['client'];
    ident: string;
    install(dependencies: {
        name: string;
        version: string;
    }[]): Promise<void>;
    installed: Array<[string, string]>;
    // (undocumented)
    register(): Promise<void>;
}

// @public
class Env extends Service_2<Record<string, any>> implements Env_2 {
    bootstrap(): Promise<void>;
    get envPath(): string;
    getParsedEnv(): Record<string, any>;
    getPublicEnv(): Record<string, any>;
    ident: string;
}

// @public
class Extensions extends Extensions_2 {
    ident: string;
    // (undocumented)
    repository: Record<string, CompilerPlugin<any, Record<string, any>>>;
}

// @public
export function extensions(): Record<string, Extension.CompilerPlugin>;

// @public
export function factory(overrides?: Bud.Options): Promise<Bud>;

export { Framework }

// @public
class Hooks extends Hooks_2 implements Hooks_3, Service_2 {
    bootstrap({ store }: {
        store: any;
    }): Promise<void>;
    ident: string;
}

// @public
class Project extends Framework_2.Service implements Framework_2.Project.Interface {
    boot(): Promise<void>;
    // @internal
    bootstrap(): Promise<void>;
    // (undocumented)
    buildProfile(): Promise<void>;
    hasPeerDependency(pkg: string): boolean;
    ident: string;
    loadManifest(): Promise<void>;
    // Warning: (ae-forgotten-export) The symbol "Peers" needs to be exported by the entry point index.d.ts
    peers: Peers;
    // (undocumented)
    get profilePath(): string;
    // (undocumented)
    readProfile(): Promise<any>;
    // @internal
    register(): Promise<void>;
    // Warning: (ae-forgotten-export) The symbol "repository" needs to be exported by the entry point index.d.ts
    //
    // (undocumented)
    repository: repository;
    resolvePeers(): Promise<void>;
    // (undocumented)
    searchConfigs(): Promise<void>;
    // (undocumented)
    writeProfile(): Promise<void>;
}

// @public
class Server extends Server_2 {
    bootstrap(): Promise<void>;
    ident: string;
}

// Warning: (ae-internal-missing-underscore) The name "services" should be prefixed with an underscore because the declaration is marked as @internal
//
// @internal
export const services: {
    api: typeof Api;
    hooks: typeof Hooks;
    project: typeof Project;
    env: typeof Env;
    build: typeof Build;
    compiler: typeof Compiler;
    cache: typeof Cache_2;
    dependencies: typeof Dependencies;
    server: typeof Server;
    dashboard: typeof Dashboard;
    extensions: typeof Extensions;
};

```