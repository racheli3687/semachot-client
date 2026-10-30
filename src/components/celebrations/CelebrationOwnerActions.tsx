import { Link, useNavigate } from "react-router-dom";
import { useDeleteCelebration } from "../../hooks/useCelebrations";
import ErrorMessage from "../ErrorMessage";
import Icon from "../ui/Icon";

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
        <section aria-label="ניהול השמחה" className="panel flex flex-col gap-4">
            <h2 className="card-title">ניהול השמחה</h2>
            <p className="hint">השמחה שלך - אפשר לעדכן פרטים או למחוק אותה.</p>
            <div className="mt-auto flex flex-wrap gap-3">
                <Link to={`/celebrations/${celebrationId}/edit`} className="btn btn-dark"><Icon name="pencil" /> עריכה</Link>

                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                >
                    <Icon name="trash" /> {deleteMutation.isPending ? "מוחקת..." : "מחיקת השמחה"}
                </button>
            </div>

            {deleteMutation.isError && <ErrorMessage error={deleteMutation.error} />}
        </section>
    );
}
