import { FormProvider, useForm } from "react-hook-form"
import type { Group } from "../../types"
import { validateImage, type CelebrationFormValues } from "../../utils/celebrationForm"
import { useCelebrationTypesQuery } from "../../hooks/useCelebrations"
import GroupCheckBoxes from "./GroupCheckboxes"
import HebrewDatePicker from "./HebrewDatePicker"
import { isOneOf } from "../../utils/celebrationFilters"
import { ApiError } from "../../api/api"

type CelebrationFormProps =
    {
        defaultValues: CelebrationFormValues,
        groups: Group[],
        minYear: number,
        submitLabel: string,
        showImage: boolean
        onSubmit: (values: CelebrationFormValues) => Promise<void>,
        onCancel: () => void
    }
// שמות השדות בטופס שהשרת יכול להחזיר עליהם שגיאה
const SERVER_FIELDS: readonly (keyof CelebrationFormValues)[] = [
    "title",
    "type",
    "time",
    "venueName",
    "address",
    "description",
    "groupIds",
    "image",
];


export default function CelebrationForm({ defaultValues, groups, minYear, submitLabel, onCancel, onSubmit }: CelebrationFormProps) {


    const methods = useForm<CelebrationFormValues>({
        defaultValues,
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = methods;

    const { data: celebrationTypes } = useCelebrationTypesQuery();

    async function submit(values: CelebrationFormValues) {
        try {
            await onSubmit(values);
        } catch (err) {
            // שגיאת ולידציה מהשרת - עם פירוט לפי שדות
            if (err instanceof ApiError && err.details && err.details.length > 0) {
                const generalMessages: string[] = [];

                for (const detail of err.details) {
                    // "hebrewDate.day" -> "hebrewDate", "groupIds.0" -> "groupIds"
                    const field = detail.field.split(".")[0];

                    if (field === "hebrewDate" || field === "date") {
                        setError("hebrewDay", { type: "server", message: detail.message });
                    } else if (isOneOf(SERVER_FIELDS, field)) {
                        setError(field, { type: "server", message: detail.message });
                    } else {
                        generalMessages.push(detail.message);
                    }
                }

                if (generalMessages.length > 0) {
                    setError("root", { type: "server", message: generalMessages.join(" ") });
                }
                return;
            }

            // כל שגיאה אחרת: אין חיבור, 403, 500...
            setError("root", {
                type: "server",
                message: err instanceof Error ? err.message : "אירעה שגיאה בשמירה",
            });
        }
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submit)} noValidate>
                {/* כותרת */}
                <div>
                    <label htmlFor="title">כותרת השמחה</label>
                    <input
                        id="title"
                        {...register("title", {
                            required: "יש להזין כותרת",
                            validate: (value) => {
                                const length = value.trim().length;
                                return (
                                    (length >= 2 && length <= 100) ||
                                    "בין 2 ל־100 תווים"
                                );
                            },
                        })}
                    />
                    {errors.title && (
                        <p role="alert">{errors.title.message}</p>
                    )}
                </div>

                {/* סוג השמחה */}
                <div>
                    <label htmlFor="type">סוג השמחה</label>
                    <select
                        id="type"
                        {...register("type", {
                            required: "יש לבחור סוג שמחה",
                        })}
                    >
                        <option value="">בחרי סוג</option>
                        {celebrationTypes?.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                    {errors.type && (
                        <p role="alert">{errors.type.message}</p>
                    )}
                </div>
                <HebrewDatePicker minYear={minYear} />
                {/* שעה */}
                <div>
                    <label htmlFor="time">שעה</label>
                    <input
                        id="time"
                        type="time"
                        {...register("time", {
                            required: "יש לבחור שעה",
                        })}
                    />
                    {errors.time && (
                        <p role="alert">{errors.time.message}</p>
                    )}
                </div>

                {/* מקום */}
                <div>
                    <label htmlFor="venueName">מקום</label>
                    <input
                        id="venueName"
                        {...register("venueName", {
                            required: "יש להזין מקום",
                            validate: (value) => {
                                const length = value.trim().length;
                                return (
                                    (length >= 2 && length <= 100) ||
                                    "בין 2 ל־100 תווים"
                                );
                            },
                        })}
                    />
                    {errors.venueName && (
                        <p role="alert">{errors.venueName.message}</p>
                    )}
                </div>

                {/* כתובת */}
                <div>
                    <label htmlFor="address">כתובת</label>
                    <input
                        id="address"
                        {...register("address", {
                            maxLength: {
                                value: 200,
                                message: "עד 200 תווים",
                            },
                        })}
                    />
                    {errors.address && (
                        <p role="alert">{errors.address.message}</p>
                    )}
                </div>


                {/* תיאור */}
                <div>
                    <label htmlFor="description">תיאור</label>
                    <textarea
                        id="description"
                        rows={4}
                        {...register("description", {
                            maxLength: {
                                value: 1000,
                                message: "עד 1000 תווים",
                            },
                        })}
                    />
                    {errors.description && (
                        <p role="alert">{errors.description.message}</p>
                    )}
                </div>
                <input type="file" accept="image/jpeg,image/png,image/webp" {...register("image", { validate: validateImage })} />
                {errors.image && <p role="alert">{errors.image.message}</p>}
                <GroupCheckBoxes groups={groups} />


                {/* שגיאה כללית */}
                {
                    errors.root && (
                        <p role="alert">{errors.root.message}</p>
                    )
                }

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "שומרת..." : submitLabel}
                </button>

                <button type="button" onClick={onCancel}>
                    ביטול
                </button>

            </form>
        </FormProvider>
    )






}