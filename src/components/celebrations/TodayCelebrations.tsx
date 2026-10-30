import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useTodayCelebrationsQuery } from "../../hooks/useCelebrations";
import { celebrate } from "../../utils/confetti";
import Icon from "../ui/Icon";

// הכרטיס המוביל בלוח: השמחות של היום (או הודעה רגועה כשאין)
export default function TodayCelebration() {
  const { data } = useTodayCelebrationsQuery();
  const hasToday = !!data && data.length > 0;

  // קונפטי - פעם אחת בכל כניסה לאתר (לא בכל חזרה ללוח)
  useEffect(() => {
    if (!hasToday) return;
    try {
      if (sessionStorage.getItem("confetti-shown")) return;
      sessionStorage.setItem("confetti-shown", "1");
    } catch {
      // אין גישה לאחסון - פשוט ממשיכים
    }
    const timer = window.setTimeout(celebrate, 600);
    return () => window.clearTimeout(timer);
  }, [hasToday]);

  // בזמן טעינה
  if (!data) {
    return <div className="skeleton h-full min-h-80 rounded-[var(--radius-card)]" role="status" aria-label="טוען את השמחות של היום" />;
  }

  // אין שמחות היום
  if (data.length === 0) {
    return (
      <section className="mesh-cool relative flex h-full min-h-80 flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-7 text-white sm:p-9">
        <span className="pointer-events-none absolute -top-16 -left-16 size-64 rounded-full bg-white/20 blur-2xl" aria-hidden="true" />
        <p className="relative text-[0.95rem] font-medium text-white/85">השמחות של היום</p>
        <h2 className="relative mt-2 text-4xl leading-[1.05] font-extrabold text-white sm:text-[2.6rem]">היום אין שמחות.<br />יום רגוע.</h2>
        <div className="relative mt-6">
          <Link to="/celebrations/new" className="btn btn-light">
            <Icon name="plus" /> הוספת שמחה
          </Link>
        </div>
      </section>
    );
  }

  const [first, ...rest] = data;

  return (
    <section aria-label="השמחות של היום" className="mesh-vivid group relative flex h-full min-h-80 flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-7 text-white sm:p-9">
      {/* "אורות" שזזים לאט ברקע */}
      <motion.span
        className="pointer-events-none absolute -top-20 -right-10 size-72 rounded-full bg-white/25 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <div className="absolute top-6 right-7 left-7 flex items-center justify-between sm:top-8 sm:right-9 sm:left-9">
        <span className="border border-white/40 bg-white/25 backdrop-blur-xl rounded-full px-3.5 py-1.5 text-[0.8rem] font-semibold text-white">היום · {first.typeLabel}</span>
        <button
          type="button"
          onClick={celebrate}
          className="border border-white/40 bg-white/25 backdrop-blur-xl relative z-10 grid size-10 cursor-pointer place-items-center rounded-full text-white transition hover:scale-110 active:scale-95"
          aria-label="עוד קונפטי!"
          title="עוד קונפטי!"
        >
          <Icon name="sparkle" className="size-5" />
        </button>
      </div>

      <p className="relative text-[0.95rem] font-medium text-white/90">{first.hebrewDate.text} · {first.time}</p>
      <h2 className="relative mt-2 mb-4 text-[2.1rem] leading-[1.05] font-extrabold text-white sm:text-[2.6rem]">
        <Link to={`/celebrations/${first.id}`} className="text-white no-underline after:absolute after:inset-0 after:content-[''] hover:no-underline">
          {first.title}
        </Link>
      </h2>
      <div className="relative flex flex-wrap items-center gap-x-5 gap-y-1 pe-16 text-[0.95rem] text-white/90">
        <span className="flex items-center gap-1.5"><Icon name="pin" className="size-4" /> {first.venueName}</span>
        <span className="flex items-center gap-1.5"><Icon name="user" className="size-4" /> {first.owner.fullName}</span>
      </div>

      {rest.length > 0 && (
        <ul className="relative z-10 mt-5 flex flex-wrap gap-2">
          {rest.map((celebration) => (
            <li key={celebration.id}>
              <Link to={`/celebrations/${celebration.id}`} className="border border-white/40 bg-white/25 backdrop-blur-xl flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-white no-underline hover:no-underline">
                + {celebration.title}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <span className="absolute bottom-7 left-7 grid size-12 place-items-center rounded-full bg-white text-[#1d1d1f] shadow-float transition-transform duration-300 group-hover:-translate-x-1 sm:bottom-9 sm:left-9" aria-hidden="true">
        <Icon name="arrowLeft" />
      </span>
    </section>
  );
}
