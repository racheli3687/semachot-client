import { FormProvider, useForm } from "react-hook-form"
import type { Group } from "../../types"
import { validateImage, type CelebrationFormValues } from "../../utils/celebrationForm"
import { useCelebrationTypesQuery } from "../../hooks/useCelebrations"
import GroupCheckBoxes from "./GroupCheckboxes"
import HebrewDatePicker from "./HebrewDatePicker"
import { isOneOf } from "../../utils/celebrationFilters"
import { ApiError } from "../../api/api"
import Icon from "../ui/Icon"

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


export default function CelebrationForm({ defaultValues, groups, minYear, submitLabel, showImage, onCancel, onSubmit }: CelebrationFormProps) {


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
            <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-6">
                <div className="panel grid gap-5 sm:grid-cols-2">
                    <h2 className="card-title flex items-center gap-3 sm:col-span-2">
                        <span className="step" aria-hidden="true">1</span> מה חוגגים?
                    </h2>

                    {/* כותרת */}
                    <div className="field sm:col-span-2">
                        <label htmlFor="title" className="label">כותרת השמחה</label>
                        <input
                            id="title"
                            className="input"
                            placeholder="למשל: החתונה של משה ורבקה"
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
                            <p role="alert" className="field-error">{errors.title.message}</p>
                        )}
                    </div>

                    {/* סוג השמחה */}
                    <div className="field">
                        <label htmlFor="type" className="label">סוג השמחה</label>
                        <select
                            id="type"
                            className="input"
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
                            <p role="alert" className="field-error">{errors.type.message}</p>
                        )}
                    </div>

                    {/* שעה */}
                    <div className="field">
                        <label htmlFor="time" className="label">שעה</label>
                        <input
                            id="time"
                            type="time"
                            className="input"
                            {...register("time", {
                                required: "יש לבחור שעה",
                            })}
                        />
                        {errors.time && (
                            <p role="alert" className="field-error">{errors.time.message}</p>
                        )}
                    </div>
                </div>

                <HebrewDatePicker minYear={minYear} />

                <div className="panel grid gap-5 sm:grid-cols-2">
                    <h2 className="card-title flex items-center gap-3 sm:col-span-2">
                        <span className="step" aria-hidden="true">3</span> איפה?
                    </h2>

                    {/* מקום */}
                    <div className="field">
                        <label htmlFor="venueName" className="label">מקום</label>
                        <input
                            id="venueName"
                            className="input"
                            placeholder="שם האולם או הבית"
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
                            <p role="alert" className="field-error">{errors.venueName.message}</p>
                        )}
                    </div>

                    {/* כתובת */}
                    <div className="field">
                        <label htmlFor="address" className="label">כתובת <span className="font-normal text-muted">(רשות)</span></label>
                        <input
                            id="address"
                            className="input"
                            placeholder="רחוב, מספר ועיר"
                            {...register("address", {
                                maxLength: {
                                    value: 200,
                                    message: "עד 200 תווים",
                                },
                            })}
                        />
                        {errors.address && (
                            <p role="alert" className="field-error">{errors.address.message}</p>
                        )}
                    </div>


                    {/* תיאור */}
                    <div className="field sm:col-span-2">
                        <label htmlFor="description" className="label">תיאור <span className="font-normal text-muted">(רשות)</span></label>
                        <textarea
                            id="description"
                            rows={4}
                            className="input resize-y"
                            placeholder="פרטים נוספים, הסעות, קוד לבוש..."
                            {...register("description", {
                                maxLength: {
                                    value: 1000,
                                    message: "עד 1000 תווים",
                                },
                            })}
                        />
                        {errors.description && (
                            <p role="alert" className="field-error">{errors.description.message}</p>
                        )}
                    </div>

                    {/* תמונה - רק בהוספה. בעריכה מנהלים את התמונה בדף פרטי השמחה */}
                    {showImage && (
                    <div className="field sm:col-span-2">
                        <label htmlFor="celebration-form-image" className="label">תמונה <span className="font-normal text-muted">(רשות · JPG, PNG או WEBP, עד 2MB)</span></label>
                        <input id="celebration-form-image" type="file" className="input" accept="image/jpeg,image/png,image/webp" {...register("image", { validate: validateImage })} />
                        {errors.image && <p role="alert" className="field-error">{errors.image.message}</p>}
                    </div>
                    )}
                </div>

                <GroupCheckBoxes groups={groups} />


                {/* שגיאה כללית */}
                {
                    errors.root && (
                        <p role="alert" className="form-alert">{errors.root.message}</p>
                    )
                }

                <div className="sticky bottom-24 z-20 flex gap-2 rounded-full border border-white/80 bg-[var(--glass)] p-2 shadow-float backdrop-blur-2xl md:bottom-4 dark:border-white/10">
                    <button type="submit" className="btn btn-primary btn-lg flex-1" disabled={isSubmitting}>
                        <Icon name="check" /> {isSubmitting ? "שומרת..." : submitLabel}
                    </button>

                    <button type="button" className="btn btn-secondary btn-lg" onClick={onCancel}>
                        ביטול
                    </button>
                </div>

            </form>
        </FormProvider>
    )






}