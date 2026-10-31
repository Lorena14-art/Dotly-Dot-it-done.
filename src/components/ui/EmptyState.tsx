export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-muted">
      <span className="size-4 animate-pulse rounded-full bg-accent" />
      <p>{message}</p>
    </div>
  );
}
