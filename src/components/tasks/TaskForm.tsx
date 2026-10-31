import { useState, type FormEvent } from "react";
import type {
  ChecklistItem,
  NewTaskInput,
  Priority,
  Recurrence,
} from "../../types";
import {
  cleanDescription,
  cleanTags,
  cleanTitle,
  MAX_DESCRIPTION,
  MAX_TITLE,
} from "../../lib/validate";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { ChecklistEditor } from "./ChecklistEditor";

interface TaskFormProps {
  onAdd: (input: NewTaskInput) => void;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [recurrence, setRecurrence] = useState<Recurrence | "never">("never");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleanT = cleanTitle(title);
    if (!cleanT) {
      setError(`Enter a task title (up to ${MAX_TITLE} characters).`);
      return;
    }
    const cleanD = cleanDescription(description);
    if (cleanD === null) {
      setError(`Description must be ${MAX_DESCRIPTION} characters or fewer.`);
      return;
    }

    onAdd({
      title: cleanT,
      priority,
      description: cleanD || undefined,
      dueDate: dueDate || undefined,
      tags: cleanTags(tags),
      checklist: checklist.length > 0 ? checklist : undefined,
      recurrence: recurrence === "never" ? undefined : recurrence,
    });

    setTitle("");
    setDescription("");
    setTags("");
    setChecklist([]);
    setDueDate("");
    setRecurrence("never");
    setError("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-border bg-surface p-4"
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs a dot?"
        aria-label="Task title"
        className="w-full"
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description (optional)"
        aria-label="Description"
        maxLength={MAX_DESCRIPTION}
        rows={2}
        className="w-full"
      />
      <Input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
        aria-label="Tags, comma-separated"
        className="w-full"
      />
      <Field label="Checklist">
        <ChecklistEditor items={checklist} onChange={setChecklist} />
      </Field>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <Field label="Due date" className="min-w-0">
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-[calc(100%-1rem)] dark:[color-scheme:dark] sm:w-full"
          />
        </Field>
        <Field label="Priority" className="min-w-0">
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </Field>
        <Field label="Repeat" className="min-w-0">
          <Select
            value={recurrence}
            onChange={(e) =>
              setRecurrence(e.target.value as Recurrence | "never")
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
        <Button
          type="submit"
          className="w-full sm:col-span-2 lg:col-span-1 xl:col-span-2 xl:w-auto xl:justify-self-end"
        >
          Add task
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
