// "בעוד X ימים": כמה ימים מהיום ועד התאריך של השמחה.
// שני התאריכים בפורמט "YYYY-MM-DD" (לועזי). "היום" מגיע מהשרת, כדי שהחישוב יהיה לפי שעון ישראל.

export function daysBetween(from: string, to: string): number {
    const start = Date.UTC(Number(from.slice(0, 4)), Number(from.slice(5, 7)) - 1, Number(from.slice(8, 10)));
    const end = Date.UTC(Number(to.slice(0, 4)), Number(to.slice(5, 7)) - 1, Number(to.slice(8, 10)));
    return Math.round((end - start) / 86_400_000);
}

export function countdownText(days: number): string {
    if (days === 0) return "היום";
    if (days === 1) return "מחר";
    if (days === 2) return "מחרתיים";
    if (days > 0) return `בעוד ${days} ימים`;
    if (days === -1) return "אתמול";
    return `לפני ${-days} ימים`;
}
