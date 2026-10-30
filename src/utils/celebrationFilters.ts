import type { CelebrationSort, CelebrationType, CelebrationWhen, GetCelebrationsParams, HebrewMonth } from "../types";
export type DashboardView = "list" | "calendar";
export const CELEBRATION_WHEN: readonly CelebrationWhen[] = ["all", "past", "upcoming"]
export const CELEBRATION_SORTS: readonly CelebrationSort[] = ["date_asc", "date_desc", "created_desc"]
export const CELEBRATION_TYPES: readonly CelebrationType[] = [
    "ENGAGEMENT"
    , "WEDDING"
    , "SHEVA_BRACHOT"
    , "BRIT_MILAH"
    , "PIDYON_HABEN"
    , "KIDDUSH"
    , "UPSHERIN"
    , "BAR_MITZVAH"
    , "BAT_MITZVAH"
    , "SIYUM"
    , "CHANUKAT_BAYIT"
    , "OTHER"
]
export const HEBREW_MONTHS: readonly HebrewMonth[] = [
    "TISHREI"
    , "CHESHVAN"
    , "KISLEV"
    , "TEVET"
    , "SHEVAT"
    , "ADAR"
    , "ADAR_I"
    , "ADAR_II"
    , "NISAN"
    , "IYAR"
    , "SIVAN"
    , "TAMMUZ"
    , "AV"
    , "ELUL"]


export function toPositiveInt(value: string | null): number | undefined {
    if (value === null) return undefined;
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? n : undefined;
}

export function isOneOf<T extends string>(
    list: readonly T[],
    value: string | null
): value is T {
    return value !== null && (list as readonly string[]).includes(value);
}
export function celebrationParamsFromSearch(
  sp: URLSearchParams
): GetCelebrationsParams {
  const type = sp.get("type");
  const when = sp.get("when");
  const sort = sp.get("sort");
  const hebrewMonth = sp.get("hebrewMonth");

  const hebrewYear = toPositiveInt(sp.get("hebrewYear"));

  const params: GetCelebrationsParams = {
    groupId: toPositiveInt(sp.get("groupId")),

    type: isOneOf(CELEBRATION_TYPES, type)
      ? type
      : undefined,

    when: isOneOf(CELEBRATION_WHEN, when)
      ? when
      : undefined,

    sort: isOneOf(CELEBRATION_SORTS, sort)
      ? sort
      : undefined,

    search: sp.get("search")?.trim() || undefined,

    mine: sp.get("mine") === "true"
      ? true
      : undefined,

    page: toPositiveInt(sp.get("page")),
  };

  // השנה והחודש העברי חייבים להיות תקינים יחד
  if (
    hebrewYear !== undefined &&
    isOneOf(HEBREW_MONTHS, hebrewMonth)
  ) {
    params.hebrewYear = hebrewYear;
    params.hebrewMonth = hebrewMonth;
  }

  return params;
}
