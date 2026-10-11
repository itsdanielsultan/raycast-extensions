import path from "node:path";

export const controls = [
  {
    id: "search",
    title: "Open Highlight Search",
    subtitle: "Use Highlight's native search",
    shortcut: "⌘ K",
  },
  {
    id: "new-chat",
    title: "Start New Chat",
    subtitle: "Open a new Highlight conversation",
    shortcut: "⌘ N",
  },
  {
    id: "new-task",
    title: "Open Task Capture",
    subtitle: "Open Highlight's task composer for your review",
    shortcut: "⌘ ⇧ Space",
  },
] as const;
export type Control = (typeof controls)[number]["id"];

export function validateAppPath(value: string): string {
  const appPath = value.trim() || "/Applications/Highlight.app";
  if (!path.isAbsolute(appPath) || path.basename(appPath) !== "Highlight.app") {
    throw new Error(
      "Choose the absolute path to Highlight AI's Highlight.app.",
    );
  }
  return appPath;
}

export function helperArguments(
  helper: string,
  appPath: string,
  command: string,
): string[] {
  if (!controls.some((control) => control.id === command))
    throw new Error("Unsupported Highlight command.");
  return ["-l", "JavaScript", helper, validateAppPath(appPath), command];
}
