import { useState, type FormEvent } from "react";
import type { NewTaskInput, Priority } from "../../types";
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

interface TaskFormProps {
  onAdd: (input: NewTaskInput) => void;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
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
    });

    setTitle("");
    setDescription("");
    setTags("");
    setDueDate("");
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

      <div className="flex flex-wrap items-end gap-3">
        <Field label="Due date">
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="dark:[color-scheme:dark]"
          />
        </Field>
        <Field label="Priority">
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </Field>
        <Button type="submit" className="ml-auto">
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
