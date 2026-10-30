
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Celebration } from "../../types";
import { formatGregorianDate } from "../../utils/dates";
import { HEBREW_DAY_LETTERS } from "../../utils/hebrewCalendar";
import { MONTH_NAMES, TYPE_BG, TYPE_TEXT } from "../../utils/celebrationVisuals";
import { countdownText, daysBetween } from "../../utils/countdown";
import { useHebrewTodayQuery } from "../../hooks/useHebrewCalendar";
import Icon from "../ui/Icon";

interface CelebrationCardProps {
  celebration: Celebration;
  children?: ReactNode;
}

// שמחה אחת כשורה ברשימה (בסגנון הרשימות של אייפון).
// "בעוד X ימים" מחושב מול התאריך של היום שמגיע מהשרת (מהמטמון).
export default function CelebrationCard({
  celebration,
  children,
}: CelebrationCardProps) {
  const { data: today } = useHebrewTodayQuery();
  const days = today ? daysBetween(today.date, celebration.date) : null;

  return (
    <article className="group relative flex items-center gap-3.5 px-4 py-3.5 transition-colors duration-200 hover:bg-surface-2/70 sm:gap-4 sm:px-5 sm:py-4">
      {/* "דף לוח שנה" עם התאריך העברי */}
      <div className="date-tile">
        <span className={`text-[0.7rem] font-semibold ${TYPE_TEXT[celebration.type]}`}>
          {MONTH_NAMES[celebration.hebrewDate.month]}
        </span>
        <span className="text-[1.4rem] leading-tight font-bold">
          {HEBREW_DAY_LETTERS[celebration.hebrewDate.day - 1]}
        </span>
      </div>

      {celebration.imageUrl && (
        <img
          src={celebration.imageUrl}
          alt=""
          loading="lazy"
          className="hidden size-14 shrink-0 rounded-2xl object-cover sm:block"
        />
      )}

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[1.1rem] font-semibold tracking-[-0.01em]">
          {/* הקישור "נמתח" על כל השורה - לחיצה בכל מקום פותחת את השמחה */}
          <Link
            to={`/celebrations/${celebration.id}`}
            className="text-ink no-underline after:absolute after:inset-0 after:content-[''] hover:no-underline focus-visible:outline-none"
          >
            {celebration.title}
          </Link>
        </h3>
        <dl className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-sm text-muted">
          <dt className="sr-only">סוג</dt>
          <dd className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${TYPE_BG[celebration.type]}`} aria-hidden="true" />
            {celebration.typeLabel}
          </dd>
          <span aria-hidden="true">·</span>
          <dt className="sr-only">מקום</dt>
          <dd className="max-w-[12rem] truncate">{celebration.venueName}</dd>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <dt className="sr-only">תאריך ושעה</dt>
          <dd className="hidden sm:block">{celebration.hebrewDate.text} · {formatGregorianDate(celebration.date)} · {celebration.time}</dd>
        </dl>
        <p className="mt-0.5 text-xs text-muted/80">שותף על ידי {celebration.owner.fullName}</p>
      </div>

      {/* בעוד X ימים */}
      {celebration.isToday ? (
        <strong className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">היום</strong>
      ) : (
        days !== null && (
          <span className="hidden shrink-0 rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted min-[420px]:inline">
            {countdownText(days)}
          </span>
        )
      )}

      {/* כפתורים נוספים (למשל "הסרה מהקבוצה") - מעל הקישור הנמתח, כדי שיהיה אפשר ללחוץ עליהם */}
      {children && <div className="relative z-10 flex shrink-0 flex-wrap gap-2">{children}</div>}

      <Icon name="chevronLeft" className="size-4 shrink-0 text-muted/60 transition-transform group-hover:-translate-x-0.5" />
    </article>
  );
}
