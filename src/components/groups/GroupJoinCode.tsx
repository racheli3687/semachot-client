

import { useState } from "react";
import { useRegenerateJoinCode } from "../../hooks/useGroups";
import ErrorMessage from "../ErrorMessage";

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

  async function handleCopy() {
     if (!currentCode) return;
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("לא הצלחנו להעתיק. אפשר לסמן ולהעתיק ידנית.");
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
    <section>
      <h2>קוד הצטרפות</h2>

      <p>
        {currentCode || "עדיין לא מוצג קוד הצטרפות"}
      </p>
      <button type="button" onClick={handleCopy}>
        {copied ? "הועתק ✓" : "העתקה"}
      </button>
      <button
        type="button"
        onClick={handleRegenerate}
        disabled={regenerateMutation.isPending}
      >
        {regenerateMutation.isPending
          ? "יוצר קוד חדש..."
          : "יצירת קוד חדש"}
      </button>

      {regenerateMutation.isError && (
        <ErrorMessage error={regenerateMutation.error} />
      )}
    </section>
  );
}
