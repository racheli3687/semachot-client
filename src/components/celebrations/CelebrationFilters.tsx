import { useCelebrationTypesQuery } from "../../hooks/useCelebrations";
import { useGroupsQuery } from "../../hooks/useGroups";
import { useHebrewMonthsQuery, useHebrewTodayQuery } from "../../hooks/useHebrewCalendar";
import type { CelebrationSort, CelebrationWhen } from "../../types";
import {
    CELEBRATION_SORTS,
    CELEBRATION_WHEN,
    isOneOf,
    toPositiveInt,
    type DashboardView,
} from "../../utils/celebrationFilters";
import SearchBox from "./SearchBox";
import Icon from "../ui/Icon";

interface CelebrationFiltersProps {
    view: DashboardView;
    values: URLSearchParams;
    onChange: (key: string, value?: string) => void;
    onHebrewYearChange: (year: string | undefined) => void;
    onClear: () => void;
}

const WHEN_LABELS: Record<CelebrationWhen, string> = {
    upcoming: "קרובות",
    past: "שעברו",
    all: "הכל",
};

const SORT_LABELS: Record<CelebrationSort, string> = {
    date_asc: "תאריך: מהקרוב",
    date_desc: "תאריך: מהרחוק",
    created_desc: "נוספו לאחרונה",
};

export default function CelebrationFilters({
    view,
    values,
    onChange,
    onHebrewYearChange,
    onClear,
}: CelebrationFiltersProps) {
    const { data: groups } = useGroupsQuery();
    const { data: types } = useCelebrationTypesQuery();

    // שנה וחודש עבריים (רק בתצוגת רשימה)
    const { data: today } = useHebrewTodayQuery();
    const selectedYear = toPositiveInt(values.get("hebrewYear"));
    const { data: monthsData } = useHebrewMonthsQuery(selectedYear);
    const currentYear = today?.hebrewDate.year;
    const years = currentYear
        ? Array.from({ length: 4 }, (_, i) => currentYear - 1 + i)
        : [];

    // מועד: ברירת המחדל של השרת היא "קרובות"
    const whenParam = values.get("when");
    const currentWhen = isOneOf(CELEBRATION_WHEN, whenParam) ? whenParam : "upcoming";

    // יש סינון פעיל? ("view" הוא סוג התצוגה, לא סינון)
    const hasFilters = [...values.keys()].some((key) => key !== "view");

    return (
        <section aria-label="סינון שמחות" className="mb-6 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
                <SearchBox
                    key={values.get("search") ?? ""}
                    initialValue={values.get("search") ?? ""}
                    onSearch={(text) => onChange("search", text)}
                />

                {/* קבוצה */}
                <label htmlFor="group-filter" className="sr-only">קבוצה</label>
                <select
                    id="group-filter"
                    className="input input-pill w-auto"
                    value={values.get("groupId") ?? ""}
                    onChange={(event) => onChange("groupId", event.target.value || undefined)}
                >
                    <option value="">כל הקבוצות</option>
                    {groups?.map((group) => (
                        <option key={group.id} value={group.id}>
                            {group.name}
                        </option>
                    ))}
                </select>

                {/* סוג */}
                <label htmlFor="type-filter" className="sr-only">סוג שמחה</label>
                <select
                    id="type-filter"
                    className="input input-pill w-auto"
                    value={values.get("type") ?? ""}
                    onChange={(event) => onChange("type", event.target.value || undefined)}
                >
                    <option value="">כל הסוגים</option>
                    {types?.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>

                {/* שדות שמתאימים רק לתצוגת רשימה */}
                {view === "list" && (
                    <>
                        {/* שנה עברית */}
                        <label htmlFor="year-filter" className="sr-only">שנה</label>
                        <select
                            id="year-filter"
                            className="input input-pill w-auto"
                            value={values.get("hebrewYear") ?? ""}
                            disabled={!currentYear}
                            onChange={(event) => onHebrewYearChange(event.target.value || undefined)}
                        >
                            <option value="">כל השנים</option>
                            {years.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>

                        {/* חודש עברי */}
                        <label htmlFor="month-filter" className="sr-only">חודש</label>
                        <select
                            id="month-filter"
                            className="input input-pill w-auto"
                            value={values.get("hebrewMonth") ?? ""}
                            disabled={!selectedYear}
                            onChange={(event) =>
                                onChange("hebrewMonth", event.target.value || undefined)
                            }
                        >
                            <option value="">כל החודשים</option>
                            {monthsData?.months.map((m) => (
                                <option key={m.month} value={m.month}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                    </>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
                {view === "list" && (
                    <>
                        {/* מועד */}
                        <fieldset>
                            <legend className="sr-only">מועד השמחה</legend>
                            <div className="segmented">
                                {CELEBRATION_WHEN.map((when) => (
                                    <button
                                        key={when}
                                        type="button"
                                        aria-pressed={currentWhen === when}
                                        onClick={() =>
                                            onChange("when", when === "upcoming" ? undefined : when)
                                        }
                                    >
                                        {WHEN_LABELS[when]}
                                    </button>
                                ))}
                            </div>
                        </fieldset>

                        {/* מיון */}
                        <label htmlFor="sort-filter" className="sr-only">מיון</label>
                        <select
                            id="sort-filter"
                            className="input input-pill w-auto py-1.5 text-sm"
                            value={values.get("sort") ?? ""}
                            onChange={(event) => onChange("sort", event.target.value || undefined)}
                        >
                            <option value="">מיון: ברירת מחדל</option>
                            {CELEBRATION_SORTS.map((sort) => (
                                <option key={sort} value={sort}>
                                    {SORT_LABELS[sort]}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {/* רק שלי */}
                <label className="flex cursor-pointer items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-sm font-medium ring-1 ring-line transition-colors has-[:checked]:bg-accent-soft has-[:checked]:text-accent has-[:checked]:ring-accent/30">
                    <input
                        type="checkbox"
                        className="checkbox size-4"
                        checked={values.get("mine") === "true"}
                        onChange={(event) =>
                            onChange("mine", event.target.checked ? "true" : undefined)
                        }
                    />
                    השמחות שלי בלבד
                </label>

                {selectedYear && !values.get("hebrewMonth") && view === "list" && (
                    <small className="text-xs font-medium text-sys-orange">בחרי גם חודש כדי לסנן</small>
                )}

                <button type="button" className="btn btn-ghost btn-sm ms-auto" disabled={!hasFilters} onClick={onClear}>
                    <Icon name="reset" /> ניקוי סינונים
                </button>
            </div>
        </section>
    );
}
