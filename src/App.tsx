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
import { PinLock } from "./components/ui/PinLock";
import { Button } from "./components/ui/Button";

export default function App() {
  const t = useTasks();
  const { theme, toggleTheme } = useTheme();

  return (
    <PinLock>
      {({ onChangePin }) => (
        <main className="mx-auto max-w-6xl space-y-5 px-3 py-6 sm:px-4 sm:py-10">
          <header className="flex items-center justify-between gap-3">
            <h1>
              <Logo />
            </h1>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onChangePin}
                aria-label="Change PIN"
                title="Change PIN"
                className="px-3 py-2"
              >
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.0667 5C21.6586 5.95805 22 7.08604 22 8.29344C22 11.7692 19.1708 14.5869 15.6807 14.5869C15.0439 14.5869 13.5939 14.4405 12.8885 13.8551L12.0067 14.7333C11.272 15.465 11.8598 15.465 12.1537 16.0505C12.1537 16.0505 12.8885 17.075 12.1537 18.0995C11.7128 18.6849 10.4783 19.5045 9.06754 18.0995L8.77362 18.3922C8.77362 18.3922 9.65538 19.4167 8.92058 20.4412C8.4797 21.0267 7.30403 21.6121 6.27531 20.5876C6.22633 20.6364 5.952 20.9096 5.2466 21.6121C4.54119 22.3146 3.67905 21.9048 3.33616 21.6121L2.45441 20.7339C1.63143 19.9143 2.1115 19.0264 2.45441 18.6849L10.0963 11.0743C10.0963 11.0743 9.3615 9.90338 9.3615 8.29344C9.3615 4.81767 12.1907 2 15.6807 2C16.4995 2 17.282 2.15509 18 2.43738"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.8851 8.29353C17.8851 9.50601 16.8982 10.4889 15.6807 10.4889C14.4633 10.4889 13.4763 9.50601 13.4763 8.29353C13.4763 7.08105 14.4633 6.09814 15.6807 6.09814C16.8982 6.09814 17.8851 7.08105 17.8851 8.29353Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </Button>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </header>

          <div className="grid min-w-0 items-start gap-4 sm:gap-6 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
            <section aria-label="Add a task" className="min-w-0">
              <TaskForm onAdd={t.addTask} />
            </section>

            <section aria-label="Your tasks" className="min-w-0 space-y-5">
              <div className="space-y-3">
                <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                  <Input
                    type="search"
                    value={t.searchTerm}
                    onChange={(event) => t.setSearchTerm(event.target.value)}
                    placeholder="Search by title"
                    aria-label="Search tasks by title"
                    className="col-span-2 w-full sm:col-span-1"
                  />
                  <Select
                    value={t.tagFilter}
                    onChange={(event) => t.setTagFilter(event.target.value)}
                    aria-label="Filter tasks by tag"
                    className="w-full sm:w-32"
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
                    className="w-full sm:w-32"
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
                      : t.filter === "today"
                        ? "No overdue or due-today tasks."
                        : t.filter === "upcoming"
                          ? "No tasks due in the next 7 days."
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
      )}
    </PinLock>
  );
}
