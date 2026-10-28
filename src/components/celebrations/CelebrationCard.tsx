
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Celebration } from "../../types";

interface CelebrationCardProps {
  celebration: Celebration;
  children?: ReactNode;
}

export default function CelebrationCard({
  celebration,
  children,
}: CelebrationCardProps) {
  return (
    <article>
      {celebration.imageUrl && (
        <img
          src={celebration.imageUrl}
          alt=""
          width={120}
        />
      )}

      <h3>
        <Link to={`/celebrations/${celebration.id}`}>
          {celebration.title}
        </Link>
      </h3>

      <p>סוג: {celebration.typeLabel}</p>

      <p>תאריך עברי: {celebration.hebrewDate.text}</p>

      <p>
        תאריך: {celebration.date}, שעה: {celebration.time}
      </p>

      <p>מקום: {celebration.venueName}</p>

      <p>הועלה על ידי: {celebration.owner.fullName}</p>

      {celebration.isToday && <strong>היום! 🎉</strong>}

      {children && <div>{children}</div>}
    </article>
  );
}
