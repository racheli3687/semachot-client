import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useConvertDateQuery, useHebrewMonthsQuery, useHebrewTodayQuery } from "../../hooks/useHebrewCalendar";
import type { CelebrationFormValues } from "../../utils/celebrationForm";

type HebrewDatePickerProps = {
    minYear: number;
};

export default function HebrewDatePicker({ minYear }: HebrewDatePickerProps) {
    const {
        register,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useFormContext<CelebrationFormValues>();

    const year = watch("hebrewYear");
    const month = watch("hebrewMonth");

    // רשימת השנים: מ-minYear ועד 5 שנים אחרי השנה הנוכחית
    const currentYear = useHebrewTodayQuery().data?.hebrewDate.year;
    const years = currentYear
        ? Array.from({ length: currentYear + 5 - minYear + 1 }, (_, i) => minYear + i)
        : [];

    // החודשים של השנה שנבחרה (בשנה מעוברת: אדר א׳ ואדר ב׳)
    const { data: monthsData } = useHebrewMonthsQuery(year ? Number(year) : undefined);
    const months = monthsData?.months ?? [];

    // מספר הימים בחודש שנבחר
    const days = months.find((m) => m.month === month)?.days ?? 30;
    const daysArr = Array.from({ length: days }, (_, i) => i + 1);


    // תצוגה מקדימה של התאריך הלועזי - רק כשהבחירה תקינה
    const day = watch("hebrewDay");
    const dayNumber = day ? Number(day) : undefined;
    const isMonthValid = months.some((m) => m.month === month);

    const { data: converted } = useConvertDateQuery(
        dayNumber !== undefined && dayNumber <= days ? dayNumber : undefined,
        isMonthValid && month ? month : undefined,
        year ? Number(year) : undefined
    );

    const gregorianText = converted
        ? `${new Date(`${converted.date}T12:00:00`).toLocaleDateString("he-IL", { weekday: "long" })}, ${converted.date.split("-").reverse().join("/")}`
        : null;
    // תיקון אוטומטי כשהשנה או החודש משתנים


    useEffect(() => {
        const list = monthsData?.months;
        if (!list || list.length === 0) return;

        // 1. החודש שנבחר לא קיים בשנה הזו - עוברים לחודש הראשון
        if (month && !list.some((m) => m.month === month)) {
            setValue("hebrewMonth", list[0].month, { shouldValidate: true });
            return;
        }

        // 2. החודשים הגיעו מהשרת - מסנכרנים את הבחירה שכבר הייתה בטופס (חשוב בעריכה)
        if (month) {
            setValue("hebrewMonth", month);
        }

        // 3. היום גדול ממספר הימים בחודש - עוברים ליום האחרון
        if (Number(getValues("hebrewDay")) > days) {
            setValue("hebrewDay", String(days), { shouldValidate: true });
        }
    }, [monthsData, month, days, setValue, getValues]);

    const hasError = errors.hebrewYear || errors.hebrewMonth || errors.hebrewDay;

    return (
        <fieldset>
            <legend>תאריך עברי</legend>

            <div>
                <label htmlFor="hebrewYear">שנה</label>
                <select
                    id="hebrewYear"
                    {...register("hebrewYear", { required: true })}
                >
                    {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
                {monthsData?.yearText && <span> {monthsData.yearText}</span>}
            </div>

            <div>
                <label htmlFor="hebrewMonth">חודש</label>
                <select
                    id="hebrewMonth"
                    disabled={months.length === 0}
                    {...register("hebrewMonth", { required: true })}
                >
                    <option value="">בחרי חודש</option>
                    {months.map((m) => (
                        <option key={m.month} value={m.month}>{m.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="hebrewDay">יום</label>
                <select
                    id="hebrewDay"
                    {...register("hebrewDay", { required: true })}
                >
                    {daysArr.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>
            {gregorianText && (
                <p>יוצא ב{gregorianText}</p>
            )}

            {hasError && (
                <p role="alert">
                    {errors.hebrewDay?.message || "יש לבחור תאריך מלא"}
                </p>
            )}
        </fieldset>
    );
}