export type CelebrationType =
    | "ENGAGEMENT"
    | "WEDDING"
    | "SHEVA_BRACHOT"
    | "BRIT_MILAH"
    | "PIDYON_HABEN"
    | "KIDDUSH"
    | "UPSHERIN"
    | "BAR_MITZVAH"
    | "BAT_MITZVAH"
    | "SIYUM"
    | "CHANUKAT_BAYIT"
    | "OTHER"
    ;

// HebrewMonth
export type HebrewMonth =
    | "TISHREI"
    | "CHESHVAN"
    | "KISLEV"
    | "TEVET"
    | "SHEVAT"
    | "ADAR"
    | "ADAR_I"
    | "ADAR_II"
    | "NISAN"
    | "IYAR"
    | "SIVAN"
    | "TAMMUZ"
    | "AV"
    | "ELUL";

// 6. HebrewDate
export interface HebrewDate {
    day: number;
    month: HebrewMonth;
    year: number;
    text: string;
}

// 7. Celebration - טיפוסים פנימיים
export interface CelebrationOwner {
    id: number;
    fullName: string;
}

export interface CelebrationGroup {
    id: number;
    name: string;
}

export interface CelebrationPermissions {
    canEdit: boolean;
    canRemoveFromGroupIds: number[];
}

// Celebration
export interface Celebration {
    id: number;
    title: string;
    type: CelebrationType;
    typeLabel: string;

    date: string;
    time: string;

    hebrewDate: HebrewDate;

    venueName: string;
    address: string | null;
    description: string | null;

    imageUrl: string | null;

    isToday: boolean;

    owner: CelebrationOwner;
    groups: CelebrationGroup[];
    permissions: CelebrationPermissions;

    createdAt: string;
    updatedAt: string;
}


export type CelebrationWhen = "upcoming" | "past" | "all";

export type CelebrationSort =
  | "date_asc"
  | "date_desc"
  | "created_desc";

export interface GetCelebrationsParams {
  groupId?: number;
  type?: CelebrationType;
  when?: CelebrationWhen;
  hebrewYear?: number;
  hebrewMonth?: HebrewMonth;
  search?: string;
  mine?: boolean;
  sort?: CelebrationSort;
  page?: number;
  pageSize?: number;
}


export interface CelebrationInput {
  title: string;
  type: CelebrationType;
  hebrewDate: {
    day: number;
    month: HebrewMonth;
    year: number;
  };
  time: string;
  venueName: string;
  address: string | null;
  description: string | null;
  groupIds: number[];
}


export interface CelebrationTypeOption {
  value: CelebrationType;
  label: string;
}

