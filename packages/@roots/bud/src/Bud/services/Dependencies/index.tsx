import {Service} from '@roots/bud-framework'
import {Ink, React} from '@roots/bud-support'
import {Dependencies as DependenciesManager} from '@roots/dependencies'
import {boundMethod as bind} from 'autobind-decorator'
import {readJsonSync} from 'fs-extra'
import {isEqual} from 'lodash'

class Dependencies extends Service<null> {
  public name = 'dependencies'

  /**
   * Interfaces with package manager
   */
  public manager: DependenciesManager

  @bind
  public register() {
    this.manager = new DependenciesManager(
      this.app.path('project'),
    )
  }

  @bind
  public readProjectJson() {
    return readJsonSync(this.app.path('project', 'package.json'))
  }

  @bind
  public shouldInstall(dep: string): boolean {
    const pkgJson = this.readProjectJson()

    return (
      !pkgJson ||
      !Object.keys({
        ...(pkgJson['dependencies'] ?? {}),
        ...(pkgJson['devDependencies'] ?? {}),
      })?.includes(dep)
    )
  }

  @bind
  public install(
    deps: {
      name: string
      ver: string
      source: string
      type: 'devDependencies' | 'dependencies'
    }[],
  ): void {
    this.app.dashboard.render(
      `Installing required peer dependencies\n`,
    )

    const skipped = deps.filter(
      dep => !this.shouldInstall(dep.name),
    )

    /**
     * Filter out ineligible packages
     */
    const installed = deps
      .filter(dep => this.shouldInstall(dep.name))
      .map(dep => {
        this.manager.client.install(
          isEqual(dep.type, 'devDependencies'),
          `${dep.name}@${dep.ver}`,
        )

        return dep
      })

    this.app.dashboard.render(
      <Ink.Box flexDirection="column">
        <Ink.Box marginBottom={1} flexDirection="column">
          <Ink.Text
            backgroundColor={this.app.store.get(
              'theme.colors.primary',
            )}
            color={this.app.store.get(
              'theme.colors.foreground',
            )}>
            Installation Complete
          </Ink.Text>
        </Ink.Box>

        {installed.length > 0 && (
          <Ink.Box marginBottom={1} flexDirection="column">
            {installed.map(dep => (
              <Ink.Text
                key={`${dep.name}-${dep.ver}`}>{`✓ ${dep.name}@${dep.ver}`}</Ink.Text>
            ))}
          </Ink.Box>
        )}

        {skipped.length > 0 && (
          <Ink.Box marginBottom={1} flexDirection="column">
            {skipped.map(dep => (
              <Ink.Text
                key={`${dep.name}-${dep.ver}`}>{`✓ ${dep.name}@${dep.ver} already installed`}</Ink.Text>
            ))}
          </Ink.Box>
        )}
      </Ink.Box>,
    )
  }
}

export {Dependencies}