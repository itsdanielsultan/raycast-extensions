/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Local Sync Folder - Choose the exact folder shown in Cleft Settings → Local Sync → Show path. Leave empty to try Cleft's default folders. */
  "syncFolder"?: string,
  /** Start Recording Shortcut - Name of the Apple Shortcut containing Cleft's Start Recording action. */
  "startShortcut": string,
  /** Stop Recording Shortcut - Name of the Apple Shortcut containing Cleft's Stop Recording action. */
  "stopShortcut": string,
  /** Continue Note Shortcut - Name of the Apple Shortcut containing Cleft's Continue Last Note action. */
  "continueShortcut": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `search-notes` command */
  export type SearchNotes = ExtensionPreferences & {}
  /** Preferences accessible in the `latest-transcript` command */
  export type LatestTranscript = ExtensionPreferences & {}
  /** Preferences accessible in the `start-recording` command */
  export type StartRecording = ExtensionPreferences & {}
  /** Preferences accessible in the `stop-recording` command */
  export type StopRecording = ExtensionPreferences & {}
  /** Preferences accessible in the `continue-recording` command */
  export type ContinueRecording = ExtensionPreferences & {}
  /** Preferences accessible in the `setup` command */
  export type Setup = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `search-notes` command */
  export type SearchNotes = {}
  /** Arguments passed to the `latest-transcript` command */
  export type LatestTranscript = {}
  /** Arguments passed to the `start-recording` command */
  export type StartRecording = {}
  /** Arguments passed to the `stop-recording` command */
  export type StopRecording = {}
  /** Arguments passed to the `continue-recording` command */
  export type ContinueRecording = {}
  /** Arguments passed to the `setup` command */
  export type Setup = {}
}

