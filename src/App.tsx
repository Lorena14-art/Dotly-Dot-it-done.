import { useTasks } from "./hooks/useTasks";
import { useTheme } from "./hooks/useTheme";
import { Toast } from "./components/ui/Toast";
import { TaskForm } from "./components/tasks/TaskForm";
import { FilterBar } from "./components/tasks/FilterBar";
import { TaskList } from "./components/tasks/TaskList";
import { TaskFooter } from "./components/tasks/TaskFooter";
import { Logo } from "./components/ui/Logo";
import { ThemeToggle } from "./components/ThemeToggle";
import { Input } from "./components/ui/Input";
import { Select } from "./components/ui/Select";

export default function App() {
  const t = useTasks();
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-3 py-6 sm:px-4 sm:py-10">
      <header className="flex items-center justify-between">
        <h1>
          <Logo />
        </h1>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <div className="grid min-w-0 items-start gap-4 sm:gap-6 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
        <section aria-label="Add a task" className="min-w-0">
          <TaskForm onAdd={t.addTask} />
        </section>

        <section aria-label="Your tasks" className="min-w-0 space-y-5">
          <div className="space-y-3">
            <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
              <Input
                type="search"
                value={t.searchTerm}
                onChange={(event) => t.setSearchTerm(event.target.value)}
                placeholder="Search by title"
                aria-label="Search tasks by title"
                className="w-full"
              />
              <Select
                value={t.tagFilter}
                onChange={(event) => t.setTagFilter(event.target.value)}
                aria-label="Filter tasks by tag"
                className="w-32"
              >
                <option value="all">All tags</option>
                {t.availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </Select>
              <Select
                value={t.sort}
                onChange={(event) =>
                  t.setSort(event.target.value as typeof t.sort)
                }
                aria-label="Sort tasks"
                className="w-32"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title">A–Z</option>
                <option value="custom">Custom</option>
              </Select>
            </div>
            <FilterBar value={t.filter} onChange={t.setFilter} />
          </div>

          <TaskList
            key={JSON.stringify([
              t.filter,
              t.searchTerm,
              t.tagFilter,
              t.tasks.map((task) => task.id).sort(),
            ])}
            tasks={t.tasks}
            emptyMessage={
              t.totalCount === 0
                ? "No dots yet. Add your first task."
                : t.searchTerm.trim()
                  ? "No tasks match your search."
                : "Nothing in this view."
            }
            onToggle={t.toggleTask}
            onToggleChecklistItem={t.toggleChecklistItem}
            onEdit={t.editTask}
            onDelete={t.deleteTask}
            onReorder={t.reorderTasks}
            onSetCompleted={t.setTasksCompleted}
            onDeleteMany={t.deleteTasks}
          />

          {t.totalCount > 0 && (
            <TaskFooter
              remaining={t.remaining}
              hasCompleted={t.hasCompleted}
              onClearCompleted={t.clearCompleted}
            />
          )}
        </section>
      </div>

      {t.lastDeleted && (
        <Toast
          message="Task deleted"
          actionLabel="Undo"
          onAction={t.undoDelete}
          onDismiss={t.dismissUndo}
        />
      )}
    </main>
  );
}
