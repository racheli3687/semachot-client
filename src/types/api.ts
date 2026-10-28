export type ApiErrorCode =
    | "VALIDATION_ERROR"
    | "INVALID_JSON"
    | "UNAUTHORIZED"
    | "INVALID_TOKEN"
    | "TOKEN_EXPIRED"
    | "INVALID_CREDENTIALS"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "FILE_TOO_LARGE"
    | "UNSUPPORTED_MEDIA_TYPE"
    | "TOO_MANY_REQUESTS"
    | "INTERNAL_ERROR";



export interface ApiErrorDetail {
    field: string;
    message: string;
}

export interface ApiErrorResponse {
    error: {
        code: ApiErrorCode;
        message: string;
        details?: ApiErrorDetail[];
    };
}


export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}