import { useState } from "react";
import type { ChangeEvent } from "react";
import type { Celebration } from "../../types";
import { useDeleteCelebrationImage, useUploadCelebrationImage } from "../../hooks/useCelebrations";
import { validateImage } from "../../utils/celebrationForm";
import ErrorMessage from "../ErrorMessage";
import Icon from "../ui/Icon";

type CelebrationImageEditorProps = {
    celebration: Celebration;
};

export default function CelebrationImageEditor({ celebration }: CelebrationImageEditorProps) {
    const uploadMutation = useUploadCelebrationImage();
    const deleteImageMutation = useDeleteCelebrationImage();

    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState("");
    // שינוי ה-key מאפס את שדה הקובץ אחרי העלאה מוצלחת
    const [inputKey, setInputKey] = useState(0);

    const hasImage = celebration.imageUrl !== null;
    const isBusy = uploadMutation.isPending || deleteImageMutation.isPending;

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const files = event.target.files ?? undefined;
        const result = validateImage(files);

        if (result !== true) {
            setFile(null);
            setFileError(result);
            return;
        }

        setFileError("");
        setFile(files?.[0] ?? null);
    }

    async function handleUpload() {
        if (!file) return;

        try {
            await uploadMutation.mutateAsync({ id: celebration.id, file });
            setFile(null);
            setInputKey((key) => key + 1);
        } catch {
            // השגיאה מוצגת למטה
        }
    }

    async function handleRemove() {
        if (!window.confirm("להסיר את התמונה?")) return;

        try {
            await deleteImageMutation.mutateAsync(celebration.id);
        } catch {
            // השגיאה מוצגת למטה
        }
    }

    return (
        <section aria-label="תמונת השמחה" className="panel flex flex-col gap-4">
            <h2 className="card-title">תמונה</h2>

            <div className="field">
                <label htmlFor="celebration-image" className="hint">
                    {hasImage ? "החלפת התמונה" : "הוספת תמונה"} (JPG, PNG או WEBP, עד 2MB)
                </label>
                <input
                    key={inputKey}
                    id="celebration-image"
                    type="file"
                    className="input"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    disabled={isBusy}
                />
                {fileError && <p role="alert" className="field-error">{fileError}</p>}
            </div>

            <div className="flex flex-wrap gap-3">
                <button type="button" className="btn btn-secondary" onClick={handleUpload} disabled={!file || isBusy}>
                    <Icon name="image" /> {uploadMutation.isPending ? "מעלה..." : "העלאה"}
                </button>

                {hasImage && (
                    <button type="button" className="btn btn-danger" onClick={handleRemove} disabled={isBusy}>
                        {deleteImageMutation.isPending ? "מסירה..." : "הסרת התמונה"}
                    </button>
                )}
            </div>

            {uploadMutation.isError && <ErrorMessage error={uploadMutation.error} />}
            {deleteImageMutation.isError && <ErrorMessage error={deleteImageMutation.error} />}
        </section>
    );
}
