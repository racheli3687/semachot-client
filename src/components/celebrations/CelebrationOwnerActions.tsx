import { Link, useNavigate } from "react-router-dom";
import { useDeleteCelebration } from "../../hooks/useCelebrations";
import ErrorMessage from "../ErrorMessage";

type CelebrationOwnerActionsProps = {
    celebrationId: number;
    title: string;
};

export default function CelebrationOwnerActions({ celebrationId, title }: CelebrationOwnerActionsProps) {
    const navigate = useNavigate();
    const deleteMutation = useDeleteCelebration();

    async function handleDelete() {
        const confirmed = window.confirm(
            `למחוק את "${title}"? השמחה תוסר מכל הקבוצות, ואי אפשר לבטל את המחיקה.`
        );
        if (!confirmed) return;

        try {
            await deleteMutation.mutateAsync(celebrationId);
            navigate("/", { replace: true });
        } catch {
            // השגיאה מוצגת למטה
        }
    }

    return (
        <section aria-label="ניהול השמחה">
            <Link to={`/celebrations/${celebrationId}/edit`}>עריכה</Link>

            <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
            >
                {deleteMutation.isPending ? "מוחקת..." : "מחיקת השמחה"}
            </button>

            {deleteMutation.isError && <ErrorMessage error={deleteMutation.error} />}
        </section>
    );
}