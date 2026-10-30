# שלב ט: עיצוב "לבן וצלול" (בהשראת Apple) - מה השתנה

## ספריות חדשות (צריך להריץ `npm install` פעם אחת)
| ספרייה | למה |
|---|---|
| `tailwindcss`, `@tailwindcss/vite` | עיצוב (Tailwind 4). מוגדר ב־`vite.config.ts` |
| `motion` | אנימציות ומעברים |
| `canvas-confetti` (+ `@types/canvas-confetti`) | קונפטי לשמחות של היום |

## פונט
**Heebo** - הפונט העברי הכי קרוב לפונט של Apple. מוטמע בפרויקט (`src/assets/fonts/`), לא נטען מ־Google Fonts. רישיון SIL Open Font License (חינמי).

## קבצים חדשים
| קובץ | מה יש בו |
|---|---|
| `src/components/dashboard/DashboardWidgets.tsx` | ארבע ה"ווידג'טים" בלוח: היום, שמחות היום, **השמחה הבאה (בעוד X ימים)**, ולוח החודש |
| `src/utils/countdown.ts` | חישוב "בעוד X ימים" (היום / מחר / מחרתיים / בעוד N ימים) |
| `src/components/ui/Icon.tsx` | אייקונים גרפיים, בלי ספרייה נוספת |
| `src/components/ui/AuthShell.tsx` | מסך התחברות / הרשמה עם כרטיסים מרחפים |
| `src/components/ui/Logo.tsx` | הלוגו |
| `src/components/ui/ThemeToggle.tsx` | מצב כהה / בהיר |
| `src/components/Skeleton.tsx` | "שלד" טעינה |
| `src/context/ToastContext.tsx`, `toastContextObject.ts`, `src/hooks/useToast.ts` | הודעות קופצות (במקום `alert`) |
| `src/hooks/useTheme.ts` | מצב כהה, נשמר בדפדפן |
| `src/utils/motion.ts`, `confetti.ts`, `celebrationVisuals.ts` | אנימציות, קונפטי, צבע לכל סוג שמחה וקבוצה |

## קבצים ששונו - עיצוב
כל הקומפוננטות והדפים: `className`, עטיפות HTML, אנימציות, אייקונים, והסרת `style={{...}}`.
`index.css` (מערכת העיצוב), `index.html` (מצב כהה בלי הבהוב), `public/favicon.svg`.
**לא שונו:** הקבצים הקיימים ב־`api/`, `types/`, `hooks/` ו־`utils/`.

## שינויים שהם יותר מעיצוב (אושרו)
1. **"השמחה הבאה, בעוד X ימים"**: הווידג'ט בלוח הראשי, תווית "בעוד X ימים" בכל שורה, ובדף פרטי השמחה. מחושב מול התאריך של היום מהשרת.
2. `alert` הוחלף בהודעה קופצת: `GroupPage.tsx` (3), `GroupJoinCode.tsx` (1).
3. מצב כהה: `useTheme` ו־`ThemeToggle`, וסקריפט קטן ב־`index.html`.
4. קונפטי: ב־`TodayCelebrations.tsx`, פעם אחת בכל כניסה לאתר, ובלחיצה על כפתור הנצנוץ.
5. `TodayCelebrations.tsx` הפך לכרטיס המוביל בלוח. כשאין שמחות היום מוצגת הודעה "יום רגוע" (קודם לא הוצג כלום).
6. `DashboardPage.tsx`: פתיחה עם שם המשתמשת (`useAuth`), והווידג'טים. כפתור "הוספת שמחה" עבר ל־header (ובטלפון - לכפתור + בסרגל התחתון).
7. `Layout.tsx`: header צף, סרגל תחתון בטלפון, ומעבר בין דפים (`key` לפי הכתובת).
8. `main.tsx`: נוספו `ToastProvider` ו־`MotionConfig`.
9. `GroupCelebrations.tsx`: קישור "לכל השמחות" אל `/?groupId=...`.
10. `CelebrationCard.tsx` ו־`GroupList.tsx`: כל השורה / הכרטיס לחיצים.
11. `RegisterPage.tsx`: הסבר על כללי הסיסמה, כשאין שגיאה.
