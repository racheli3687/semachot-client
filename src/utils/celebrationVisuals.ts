import type { CelebrationType, HebrewMonth } from "../types";

// צבע לכל סוג שמחה (צבעי מערכת בסגנון Apple) - לעיצוב בלבד
export const TYPE_TEXT: Record<CelebrationType, string> = {
    ENGAGEMENT: "text-sys-pink",
    WEDDING: "text-sys-purple",
    SHEVA_BRACHOT: "text-sys-orange",
    BRIT_MILAH: "text-sys-blue",
    PIDYON_HABEN: "text-sys-yellow",
    KIDDUSH: "text-sys-red",
    UPSHERIN: "text-sys-green",
    BAR_MITZVAH: "text-sys-indigo",
    BAT_MITZVAH: "text-sys-pink",
    SIYUM: "text-sys-teal",
    CHANUKAT_BAYIT: "text-sys-orange",
    OTHER: "text-sys-blue",
};

export const TYPE_BG: Record<CelebrationType, string> = {
    ENGAGEMENT: "bg-sys-pink",
    WEDDING: "bg-sys-purple",
    SHEVA_BRACHOT: "bg-sys-orange",
    BRIT_MILAH: "bg-sys-blue",
    PIDYON_HABEN: "bg-sys-yellow",
    KIDDUSH: "bg-sys-red",
    UPSHERIN: "bg-sys-green",
    BAR_MITZVAH: "bg-sys-indigo",
    BAT_MITZVAH: "bg-sys-pink",
    SIYUM: "bg-sys-teal",
    CHANUKAT_BAYIT: "bg-sys-orange",
    OTHER: "bg-sys-blue",
};

// שמות החודשים - לתצוגת "דף לוח שנה"
export const MONTH_NAMES: Record<HebrewMonth, string> = {
    TISHREI: "תשרי",
    CHESHVAN: "חשוון",
    KISLEV: "כסלו",
    TEVET: "טבת",
    SHEVAT: "שבט",
    ADAR: "אדר",
    ADAR_I: "אדר א׳",
    ADAR_II: "אדר ב׳",
    NISAN: "ניסן",
    IYAR: "אייר",
    SIVAN: "סיוון",
    TAMMUZ: "תמוז",
    AV: "אב",
    ELUL: "אלול",
};

// רקע צבעוני לקבוצה לפי המזהה שלה - כל קבוצה תמיד באותו צבע
const GROUP_GRADIENTS = [
    "from-[#ff9f6b] to-[#ff6fa8]",
    "from-[#8b7bff] to-[#4fb6ff]",
    "from-[#34c759] to-[#30b0c7]",
    "from-[#ff6fa8] to-[#af52de]",
    "from-[#ffcc00] to-[#ff9500]",
    "from-[#4fb6ff] to-[#5856d6]",
];
export function groupGradient(id: number): string {
    return GROUP_GRADIENTS[id % GROUP_GRADIENTS.length];
}

// אות ראשונה מהשם - לעיגול "אווטאר"
export function initials(name: string): string {
    return name.trim().charAt(0) || "?";
}
