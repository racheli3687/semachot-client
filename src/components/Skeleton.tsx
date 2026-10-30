// "שלד" בזמן טעינה - במקום הטקסט "טוען..."
type SkeletonProps = {
  count?: number;
  label?: string;
};

// שורות של רשימה (כמו רשימת השמחות)
export function CardSkeletonGrid({ count = 5, label = "טוען..." }: SkeletonProps) {
  return (
    <div role="status" aria-label={label}>
      <ul className="list">
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="flex items-center gap-4 px-5 py-4" aria-hidden="true">
            <div className="skeleton h-14 w-14 shrink-0 rounded-2xl" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="skeleton h-4 w-2/5" />
              <div className="skeleton h-3 w-3/5" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// שורות עם עיגול (כמו רשימת חברים או קבוצות)
export function RowSkeletonList({ count = 3, label = "טוען..." }: SkeletonProps) {
  return (
    <div role="status" aria-label={label} className="list">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-line p-4 [&+&]:border-t" aria-hidden="true">
          <div className="skeleton size-11 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
