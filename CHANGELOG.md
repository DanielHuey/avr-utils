# Change Log

All notable changes to the "avr-utils" extension will be documented in this file.

### [0.1.5]
- The previous error had persisted but i have fixed it this time for good!
- A certain function was making the extension fail to start, but it has been fixed too.

### [0.1.4]
- Fix error where commands like "Create New Project" in the command palette claim that they are missing ( Would happen especially on VSCode version < 1.75 ).
- Added a progress bar when downloading the toolchain, so that you (the user) are aware of the process.
- Better error message diagnostics, the extension was really lacking in this area as compilations were not giving useful error messages in case errors existed.
- Added necessary configurations to allow VSCode's keybinds `Ctrl+/` and `Alt+Shift+A` to quickly comment and uncomment lines and blocks of code respectively.
- There was also a (slightly annoying) visual bug where the compile button would render at ALL times. This has also been fixed.
- Changed the quick action for compiling from `F5` to `F4` because F5 is usually used for debugging.
- Moving from manual builds of minified js file to a CI based workflow (Thank you, GitHub Actions!)

### [0.1.2]

-   Refactored Code to get the proper list of devices directly from `io.h` file in the avr toolchain. [#3](https://github.com/DanielHuey/avr-utils/issues/3)
-   Find the list of devices and their files from `out/storage/device_and_file.json`. It's generated using the python script from `src/storage/getDevices.py` (you may need to check it from the `dev` branch)

### [0.1.1]

-   Added an icon

### [0.0.3]

-   Readme now uses GIFs so it's compatible with Marketplace

### [0.0.2]

-   Added a language "`avr-c`" to the `contributes.languages` section of the package.json file, so that the extension does not conflict with "`ms-vscode.cpptools`".
-   Added a language "`asm`" to the `contributes.languages` section of the package.json file, so that the language can be recognized by the extension.
-   Updated the code such that the providers in `./src/providers` handle avr-c instead of c.
-   Updated the code to work better with assembly files (`.s` and `.asm`)
-   Added `.h` files as an alias to `avr-c` as well, to prevent logging errors from `ms-vscode.cpptools`
-   Created syntax highlighting for both `asm` and `avr-c` to present code better to a user.
-   Added a setting (_user can change it from VSCode settings_) that always pops up the terminal during each build. This is especially useful to check for build errors since the terminal output is inaccessible to extensions.

### [0.0.1]

-   Initial release
