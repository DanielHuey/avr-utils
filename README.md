# avr-utils README

Welcome to `avr-utils`.

This extension helps users to write and compile code for their avr microcontrollers straight from the comfort of their favourite Code editor, **VScode**

## Features

- **Projects: Creating and importing**
  <!-- ![Projects]assets/projects.png) -->

  You can create a new avr project or import an existing project created from Microchip/Atmel studio. By default, it creates a new project with `main.c` in a src folder.
  <hr>

- **Code Completions**
  <!-- ![Completions]assets/completions.png) -->

  The extension provides basic code completions for the common header files.
  <hr>

- **Selecting and changing target device**
  <!-- ![Selecting]assets/selecting.gif) -->

  You can select and change the build target at any time. Builds complete within seconds and provide you with a `.hex` and `.elf` file inside the Debug folder of the project.<br><br>
  Selecting a target device for the first time will create a `project.json` file in the project directory which has the name of the device such that you dont have to keep selecting a device each time.<br><br>
  Once you select a device, a build button becomes visible to you to compile the code for the selected AVR device.
  <hr>

- **Document Links**
  The extension allows you to go to definitions of header files used in the active `c` file.

<!-- ## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them. -->

## Command Palette Contributions

The extension comes with some settings added to the command palette. Press `Ctrl+Shift+P` or `Cmd+Shift+P` and type "**AVR Utils**" to view them.

- `Open Microchip Project`: You can use this to open a project folder for a project created using Microchip Studio (a.k.a Atmel Studio)
- `Create Project`: This is used to create a new project. This command also creates for you some very minimal boilerplate code in `c` to get you started.

<!-- ## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension. -->

## Release Notes

Release notes section.

### 0.0.1

Initial release of `avr-utils`
