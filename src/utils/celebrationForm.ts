import type { Celebration, CelebrationInput, CelebrationType, Group, HebrewDate, HebrewMonth } from "../types"
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export type CelebrationFormValues =
    {
        title: string
        type: CelebrationType | ""
        hebrewYear: string
        hebrewMonth: HebrewMonth | ""
        hebrewDay: string
        time: string
        venueName: string
        address: string
        description: string
        groupIds: string[]
        image: FileList | undefined
    }


export function toArray(
    value: string[] | string | false | undefined
): string[] {
    if (Array.isArray(value)) return value;
    return typeof value === "string" ? [value] : [];
}



export function emptyFormValues(
    today: HebrewDate,
    groups: Group[]
): CelebrationFormValues {
    return {
        title: "",
        type: "",
        hebrewYear: String(today.year),
        hebrewMonth: today.month,
        hebrewDay: String(today.day),
        time: "",
        venueName: "",
        address: "",
        description: "",
        groupIds: groups.length === 1 ? [String(groups[0].id)] : [],
        image: undefined,
    };
}



export function celebrationToFormValues(
  c: Celebration
): CelebrationFormValues {
  return {
    title: c.title,
    type: c.type,
    hebrewYear: String(c.hebrewDate.year),
    hebrewMonth: c.hebrewDate.month,
    hebrewDay: String(c.hebrewDate.day),
    time: c.time,
    venueName: c.venueName,
    address: c.address ?? "",
    description: c.description ?? "",
    groupIds: c.groups.map((g) => String(g.id)),
    image: undefined,
  };
}



export function formValuesToInput(
  v: CelebrationFormValues
): CelebrationInput {
  return {
    title: v.title.trim(),
    type: v.type as CelebrationType,
    hebrewDate: {
      day: Number(v.hebrewDay),
      month: v.hebrewMonth as HebrewMonth,
      year: Number(v.hebrewYear),
    },
    time: v.time.trim(),
    venueName: v.venueName.trim(),
    address: v.address.trim() || null,
    description: v.description.trim() || null,
    groupIds: toArray(v.groupIds).map(Number),
  };
}

export function validateImage(files: FileList | undefined): true | string {
  // התמונה היא רשות - אם לא נבחר קובץ, זה תקין
  if (!files || files.length === 0) {
    return true;
  }

  const file = files[0];

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "אפשר להעלות רק תמונה מסוג JPG, PNG או WEBP";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "התמונה גדולה מ־2MB. בחרי תמונה קטנה יותר";
  }

  return true;
}