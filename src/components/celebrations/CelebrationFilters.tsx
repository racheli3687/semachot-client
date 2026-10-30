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
        <section aria-label="סינון שמחות">
            <SearchBox
                key={values.get("search") ?? ""}
                initialValue={values.get("search") ?? ""}
                onSearch={(text) => onChange("search", text)}
            />

            {/* קבוצה */}
            <div>
                <label htmlFor="group-filter">קבוצה</label>
                <select
                    id="group-filter"
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
            </div>

            {/* סוג */}
            <div>
                <label htmlFor="type-filter">סוג שמחה</label>
                <select
                    id="type-filter"
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
            </div>

            {/* רק שלי */}
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={values.get("mine") === "true"}
                        onChange={(event) =>
                            onChange("mine", event.target.checked ? "true" : undefined)
                        }
                    />
                    השמחות שלי בלבד
                </label>
            </div>

            {/* שדות שמתאימים רק לתצוגת רשימה */}
            {view === "list" && (
                <>
                    {/* מועד */}
                    <fieldset>
                        <legend>מועד השמחה</legend>
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
                    </fieldset>

                    {/* מיון */}
                    <div>
                        <label htmlFor="sort-filter">מיון</label>
                        <select
                            id="sort-filter"
                            value={values.get("sort") ?? ""}
                            onChange={(event) => onChange("sort", event.target.value || undefined)}
                        >
                            <option value="">מיון ברירת מחדל</option>
                            {CELEBRATION_SORTS.map((sort) => (
                                <option key={sort} value={sort}>
                                    {SORT_LABELS[sort]}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* שנה עברית */}
                    <div>
                        <label htmlFor="year-filter">שנה</label>
                        <select
                            id="year-filter"
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
                        {monthsData?.yearText && <span> {monthsData.yearText}</span>}
                    </div>

                    {/* חודש עברי */}
                    <div>
                        <label htmlFor="month-filter">חודש</label>
                        <select
                            id="month-filter"
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

                        {selectedYear && !values.get("hebrewMonth") && (
                            <small>בחרי גם חודש כדי לסנן</small>
                        )}
                    </div>
                </>
            )}

            <button type="button" disabled={!hasFilters} onClick={onClear}>
                ניקוי סינונים
            </button>
        </section>
    );
}