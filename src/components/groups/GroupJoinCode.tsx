

import { useState } from "react";
import { useRegenerateJoinCode } from "../../hooks/useGroups";
import ErrorMessage from "../ErrorMessage";
import { useToast } from "../../hooks/useToast";
import { AnimatePresence, motion } from "motion/react";
import Icon from "../ui/Icon";

interface GroupJoinCodeProps {
  groupId: number;
  currentCode?: string;
}

export default function GroupJoinCode({
  groupId,
  currentCode,
}: GroupJoinCodeProps) {
  const regenerateMutation = useRegenerateJoinCode();
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  async function handleCopy() {
     if (!currentCode) return;
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("לא הצלחנו להעתיק. אפשר לסמן ולהעתיק ידנית.", "error");
    }
  }




  async function handleRegenerate() {
    const confirmed = window.confirm("הקוד הנוכחי יפסיק לעבוד. ליצור קוד חדש?");
    if (!confirmed) {
      return;
    }
    try {
      await regenerateMutation.mutateAsync(groupId);

    } catch {

    }
  }

  return (
    <section className="panel relative overflow-hidden">
      <h2 className="card-title">קוד הצטרפות</h2>
      <p className="hint mb-4">שלחי את הקוד למי שתרצי להזמין לקבוצה.</p>

      <AnimatePresence mode="wait">
        <motion.p
          key={currentCode ?? "none"}
          initial={{ opacity: 0, rotateX: 90 }}
          animate={{ opacity: 1, rotateX: 0 }}
          exit={{ opacity: 0, rotateX: -90 }}
          transition={{ duration: 0.3 }}
          dir="ltr"
          className="mb-4 rounded-2xl bg-gradient-to-br from-[#ff9f6b] via-[#ff6fa8] to-[#4fb6ff] p-[2px]"
        >
          <span className="block rounded-[0.9rem] bg-surface py-4 text-center font-mono text-2xl font-bold tracking-[0.3em] text-ink select-all">
            {currentCode || "עדיין לא מוצג קוד הצטרפות"}
          </span>
        </motion.p>
      </AnimatePresence>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={`btn flex-1 ${copied ? "bg-sys-green text-white" : "btn-primary"}`} onClick={handleCopy}>
          <Icon name={copied ? "check" : "copy"} /> {copied ? "הועתק" : "העתקה"}
        </button>
        <button
          type="button"
          className="btn btn-secondary flex-1"
          onClick={handleRegenerate}
          disabled={regenerateMutation.isPending}
        >
          {regenerateMutation.isPending
            ? "יוצרת קוד חדש..."
            : <><Icon name="refresh" /> קוד חדש</>}
        </button>
      </div>

      {regenerateMutation.isError && (
        <div className="mt-3"><ErrorMessage error={regenerateMutation.error} /></div>
      )}
    </section>
  );
}
