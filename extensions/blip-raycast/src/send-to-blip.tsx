import {
  Action,
  ActionPanel,
  Form,
  Icon,
  Toast,
  popToRoot,
  getSelectedFinderItems,
  showHUD,
  showToast,
} from "@raycast/api";
import { useEffect, useRef, useState } from "react";
import { hideRaycastForHandoff, prepareTransfer } from "./lib/blip";

export default function Command() {
  const [paths, setPaths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const submitting = useRef(false);

  useEffect(() => {
    let active = true;
    getSelectedFinderItems()
      .then((items) => {
        if (active) setPaths(items.map((item) => item.path));
      })
      .catch(() => {
        // Finder selection is optional; the file picker remains available.
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function submit(values: { paths: string[] }) {
    if (submitting.current) return;
    if (!values.paths.length) {
      setError("Choose at least one file or folder.");
      return;
    }
    submitting.current = true;
    let toast: Toast | undefined;
    try {
      toast = await showToast({
        style: Toast.Style.Animated,
        title: "Preparing in Blip",
      });
      const count = await prepareTransfer(values.paths, hideRaycastForHandoff);
      await toast.hide();
      await showHUD(
        `Opened Blip with ${count} ${count === 1 ? "item" : "items"} — choose a recipient`,
      );
      await popToRoot();
    } catch (error) {
      if (toast) {
        toast.style = Toast.Style.Failure;
        toast.title = "Could not prepare transfer";
        toast.message = error instanceof Error ? error.message : String(error);
      }
    } finally {
      submitting.current = false;
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Prepare in Blip"
            icon={Icon.Upload}
            onSubmit={submit}
          />
        </ActionPanel>
      }
    >
      <Form.Description text="Choose files and folders together. Blip opens its recipient picker with your selection; you choose who receives it in Blip." />
      <Form.FilePicker
        id="paths"
        title="Files and Folders"
        value={paths}
        onChange={(value) => {
          setPaths(value);
          setError(undefined);
        }}
        error={error}
        allowMultipleSelection
        canChooseFiles
        canChooseDirectories
      />
    </Form>
  );
}
