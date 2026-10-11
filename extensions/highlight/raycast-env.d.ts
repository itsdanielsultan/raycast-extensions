/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Highlight App Path - Path to Highlight AI's Highlight.app. Highlights and Black Highlighter are different apps. */
  "appPath": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `control-highlight` command */
  export type ControlHighlight = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `control-highlight` command */
  export type ControlHighlight = {}
}

