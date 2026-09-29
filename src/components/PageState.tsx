export function LoadingState({ label = "Chargement..." }: { label?: string }) {
  return (
    <div className="flex h-screen items-center justify-center text-sm text-text-2">
      {label}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex h-screen items-center justify-center text-sm text-red-600">
      {message}
    </div>
  );
}
