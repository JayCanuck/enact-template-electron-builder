# enact-template-electron-builder

A template generator for @enact/cli to create Enact-based Electron applications. Unlike the [official template](https://github.com/enactjs/templates/tree/develop/packages/electron), this alternative uses `electron-builder` with a more customized and specific workflow that may not suit everyone's needs.

## Installation

The Enact CLI itself can install this via NPM or git URI.
```
enact template install enact-template-electron-builder
```

## Usage

Once installed, you can specify the `electron-builder` template during new application creation:
```
enact create -t electron-builder MyApp
```

## Electron Builder Options

In order for the `npm run build` command to work as intended, information about the project will be sourced from both `./package.json` and `./tools/config.json`. Please be sure to keep those files up-to-date and accurate.  The `./tools/config.json` acts as the [configuration options for the `electron-builder`](https://www.electron.build/configuration/configuration) and can be expanded/modified as desired.

Additionally, there is added support for a special `buildDependencies` array option, which can be added to the `./package.json` or added to the `extraMetadata` object in the `./tools/config.json` file (which is the default setup). When used, production dependencies listed in this array will be copied and included,along with their children dependences, during `npm run build`. This is useful for including main thread dependencies but excluding renderer dependencies.

## Automated GitHub Release

A key feature of this template's default configuration is support for automated builds cross-platform for versioned releases.

**Setup**
* Enable (Travis-CI)[https://travis-ci.org] for your project repository.
* Create a new GitHub access token [from here](https://github.com/settings/tokens/new). It can be called anything, but much have the `repo` tree of access checkboxed. This will generate a key value for you.
* On the Travis webpage for your repository, go to the 'Settings' section and set a new environment variable named `GH_TOKEN` with the value of the key you just generated.

Once that's complete, anytime you push a new tag of a versioned release (eg. `1.0.0`), Travis will generate application installers for Window, Mac, and Linux. The application installers will be sent back to your GitHub repository webpage releases section. All that's left is to edit and publish the draft release that's there waiting for you.

## Autoupdate Support

A side effect of the automated release process is that this template can provide automatic in-app updating via `electron-updater`. This has been preconfigured, and as long as automated releases are setup as described above, users will automatically receive and install updates as they're released.  If a custom alternate approach is desired, the main thread can be modified to handle the [`electron-updater` API](https://www.electron.build/auto-update).