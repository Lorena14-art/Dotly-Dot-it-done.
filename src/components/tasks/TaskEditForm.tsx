import { useState, type FormEvent } from "react";
import type { Recurrence, Task, TaskChanges } from "../../types";
import {
  cleanDescription,
  cleanTags,
  cleanTitle,
  MAX_DESCRIPTION,
} from "../../lib/validate";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { ChecklistEditor } from "./ChecklistEditor";
import { Select } from "../ui/Select";

interface TaskEditFormProps {
  task: Task;
  onSave: (changes: TaskChanges) => void;
  onCancel: () => void;
}

export function TaskEditForm({ task, onSave, onCancel }: TaskEditFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [tags, setTags] = useState((task.tags ?? []).join(", "));
  const [checklist, setChecklist] = useState(task.checklist ?? []);
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");
  const [recurrence, setRecurrence] = useState<Recurrence | "never">(
    task.recurrence ?? "never",
  );
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleanT = cleanTitle(title);
    const cleanD = cleanDescription(description);
    if (!cleanT || cleanD === null) {
      setError("Check the title and description length.");
      return;
    }
    onSave({
      title: cleanT,
      description: cleanD || undefined,
      dueDate: dueDate || undefined,
      tags: cleanTags(tags),
      checklist: checklist.length > 0 ? checklist : undefined,
      recurrence: recurrence === "never" ? undefined : recurrence,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
      }}
      className="min-w-0 flex-1 space-y-2"
    >
      <Field label="Task title">
        <Input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Task title"
          className="w-full"
        />
      </Field>
      <Field label="Description">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          aria-label="Description"
          maxLength={MAX_DESCRIPTION}
          rows={2}
          className="w-full"
        />
      </Field>
      <Field label="Tags (comma-separated)">
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. work, personal"
          aria-label="Tags, comma-separated"
          className="w-full"
        />
      </Field>
      <Field label="Checklist">
        <ChecklistEditor items={checklist} onChange={setChecklist} />
      </Field>
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Due date" className="min-w-0">
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label="Due date"
            className="w-full dark:[color-scheme:dark]"
          />
        </Field>
        <Field label="Repeat" className="min-w-0">
          <Select
            value={recurrence}
            onChange={(event) =>
              setRecurrence(event.target.value as Recurrence | "never")
            }
            className="w-full"
          >
            <option value="never">Does not repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Select>
        </Field>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </div>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
