type LoadingProps = {
  message?: string;
};

export default function Loading({
  message = "טוען...",
}: LoadingProps) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-14 text-muted">
      {/* סמן טעינה עגול בסגנון Apple */}
      <span className="size-7 animate-spin rounded-full border-[2.5px] border-line border-t-accent" aria-hidden="true" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
