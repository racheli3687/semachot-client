import type { ReactNode } from "react";

type EmptyStateProps = {
  message: string;
  children?: ReactNode;
};

export default function EmptyState({
  message,
  children,
}: EmptyStateProps) {
  return (
    <div>
      <p>{message}</p>
      {children}
    </div>
  );
}
