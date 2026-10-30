import type { ReactNode } from "react";
import Icon from "./ui/Icon";

type EmptyStateProps = {
  message: string;
  children?: ReactNode;
};

export default function EmptyState({
  message,
  children,
}: EmptyStateProps) {
  return (
    <div className="state-box">
      <span className="mesh mb-1 grid size-16 place-items-center rounded-[1.25rem] text-ink" aria-hidden="true">
        <Icon name="calendar" className="size-7" />
      </span>
      <p className="max-w-sm text-[1.05rem]">{message}</p>
      {children}
    </div>
  );
}
