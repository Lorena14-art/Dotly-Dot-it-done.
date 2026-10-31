import { useState, type KeyboardEvent } from "react";
import type { ChecklistItem } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface ChecklistEditorProps {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
}

export function ChecklistEditor({ items, onChange }: ChecklistEditorProps) {
  const [draft, setDraft] = useState("");

  function addItem() {
    const text = draft.trim();
    if (!text) return;
    onChange([...items, { id: crypto.randomUUID(), text, completed: false }]);
    setDraft("");
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addItem();
    }
  }

  return (
    <div className="space-y-2">
      {items.length > 0 && (
        <ul className="space-y-1">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <label className="flex min-w-0 items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() =>
                    onChange(
                      items.map((current) =>
                        current.id === item.id
                          ? { ...current, completed: !current.completed }
                          : current,
                      ),
                    )
                  }
                  className="size-4 shrink-0 accent-primary"
                />
                <span className="break-words">{item.text}</span>
              </label>
              <Button
                variant="ghost"
                onClick={() =>
                  onChange(items.filter((current) => current.id !== item.id))
                }
                aria-label={`Remove checklist item "${item.text}"`}
                title="Remove checklist item"
                className="px-2 py-1 text-danger"
              >
                ×
              </Button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Add a checklist item"
          aria-label="New checklist item"
          className="min-w-0 flex-1"
        />
        <Button
          type="button"
          variant="ghost"
          disabled={!draft.trim()}
          onClick={addItem}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
