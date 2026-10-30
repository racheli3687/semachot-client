import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useConvertDateQuery, useHebrewMonthsQuery, useHebrewTodayQuery } from "../../hooks/useHebrewCalendar";
import type { CelebrationFormValues } from "../../utils/celebrationForm";
import Icon from "../ui/Icon";

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
        <fieldset className="panel grid gap-5 sm:grid-cols-3">
            <legend className="sr-only">תאריך עברי</legend>
            <h2 className="card-title flex items-center gap-3 sm:col-span-3" aria-hidden="true">
                <span className="step">2</span> מתי? <span className="text-sm font-normal text-muted">(תאריך עברי)</span>
            </h2>

            <div className="field">
                <label htmlFor="hebrewYear" className="label">
                    שנה
                    {monthsData?.yearText && <span className="ms-1.5 font-normal text-muted">({monthsData.yearText})</span>}
                </label>
                <select
                    id="hebrewYear"
                    className="input"
                    {...register("hebrewYear", { required: true })}
                >
                    {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            <div className="field">
                <label htmlFor="hebrewMonth" className="label">חודש</label>
                <select
                    id="hebrewMonth"
                    className="input"
                    disabled={months.length === 0}
                    {...register("hebrewMonth", { required: true })}
                >
                    <option value="">בחרי חודש</option>
                    {months.map((m) => (
                        <option key={m.month} value={m.month}>{m.name}</option>
                    ))}
                </select>
            </div>

            <div className="field">
                <label htmlFor="hebrewDay" className="label">יום</label>
                <select
                    id="hebrewDay"
                    className="input"
                    {...register("hebrewDay", { required: true })}
                >
                    {daysArr.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>
            {gregorianText && (
                <p className="flex items-center gap-2 rounded-2xl bg-accent-soft px-4 py-3 text-sm font-medium text-accent sm:col-span-3">
                    <Icon name="sparkle" className="size-4" /> יוצא ב{gregorianText}
                </p>
            )}

            {hasError && (
                <p role="alert" className="field-error sm:col-span-3">
                    {errors.hebrewDay?.message || "יש לבחור תאריך מלא"}
                </p>
            )}
        </fieldset>
    );
}
