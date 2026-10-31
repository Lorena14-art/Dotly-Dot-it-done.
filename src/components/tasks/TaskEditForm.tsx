import { useState, type FormEvent } from "react";
import type { Task, TaskChanges } from "../../types";
import {
  cleanDescription,
  cleanTags,
  cleanTitle,
  MAX_DESCRIPTION,
} from "../../lib/validate";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

interface TaskEditFormProps {
  task: Task;
  onSave: (changes: TaskChanges) => void;
  onCancel: () => void;
}

export function TaskEditForm({ task, onSave, onCancel }: TaskEditFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [tags, setTags] = useState((task.tags ?? []).join(", "));
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");
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
      <Input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Task title"
        className="w-full"
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
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
      />
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
          className="dark:[color-scheme:dark]"
        />
        <div className="ml-auto flex gap-2">
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
