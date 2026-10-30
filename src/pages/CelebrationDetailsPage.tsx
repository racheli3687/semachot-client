import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useCelebrationQuery, useRemoveCelebrationFromGroup } from "../hooks/useCelebrations";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import CelebrationOwnerActions from "../components/celebrations/CelebrationOwnerActions";
import CelebrationImageEditor from "../components/celebrations/CelebrationImageEditor";
import { ApiError } from "../api/api";
import { formatGregorianDate } from "../utils/dates";

type LocationState = { imageFailed?: boolean } | null;

export default function CelebrationDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const celebrationId = Number(id);

    const navigate = useNavigate();
    const location = useLocation();
    const imageFailed = (location.state as LocationState)?.imageFailed === true;

    const celebrationQuery = useCelebrationQuery(celebrationId);
    const removeFromGroup = useRemoveCelebrationFromGroup();

    // חזרה: אם הגיעו מתוך האתר - אחורה (שומר על הסינון בלוח). אם נכנסו ישר מקישור - ללוח.
    function goBack() {
        if (location.key !== "default") {
            navigate(-1);
        } else {
            navigate("/");
        }
    }

    const notFound = (
        <section>
            <p>השמחה לא נמצאה</p>
            <Link to="/">חזרה ללוח</Link>
        </section>
    );

    // 1. מזהה לא תקין בכתובת
    if (!Number.isInteger(celebrationId) || celebrationId <= 0) {
        return notFound;
    }

    // 2. שגיאה (404 = לא קיימת, או שאין לי גישה אליה)
    if (celebrationQuery.isError) {
        const error = celebrationQuery.error;
        if (error instanceof ApiError && error.status === 404) {
            return notFound;
        }
        return <ErrorMessage error={error} />;
    }

    // 3. טעינה
    const celebration = celebrationQuery.data;
    if (!celebration) {
        return <Loading message="טוען את פרטי השמחה..." />;
    }

    const { permissions } = celebration;

    async function handleRemoveFromGroup(groupId: number, groupName: string) {
        const confirmed = window.confirm(
            `להסיר את השמחה מהקבוצה "${groupName}"? השמחה עצמה לא תימחק.`
        );
        if (!confirmed) return;

        try {
            await removeFromGroup.mutateAsync({ groupId, celebrationId });

            // מי שאינה בעלת השמחה כנראה כבר לא רואה אותה - חוזרים לדף הקבוצה
            if (!permissions.canEdit) {
                navigate(`/groups/${groupId}`, { replace: true });
            }
        } catch {
            // השגיאה מוצגת למטה
        }
    }

    return (
        <article>
            <button type="button" onClick={goBack}>→ חזרה</button>

            {imageFailed && !celebration.imageUrl && (
                <p role="alert">
                    השמחה נשמרה, אבל התמונה לא הועלתה. אפשר להעלות אותה כאן למטה.
                </p>
            )}

            {celebration.imageUrl && (
                <img
                    src={celebration.imageUrl}
                    alt={celebration.title}
                    style={{ maxWidth: "100%", height: "auto" }}
                />
            )}

            <h1>{celebration.title}</h1>
            {celebration.isToday && <p><strong>השמחה היום! 🎉</strong></p>}

            <dl>
                <dt>סוג</dt>
                <dd>{celebration.typeLabel}</dd>

                <dt>תאריך</dt>
                <dd>
                    {celebration.hebrewDate.text} ({formatGregorianDate(celebration.date)})
                </dd>

                <dt>שעה</dt>
                <dd>{celebration.time}</dd>

                <dt>מקום</dt>
                <dd>{celebration.venueName}</dd>

                {celebration.address && (
                    <>
                        <dt>כתובת</dt>
                        <dd>{celebration.address}</dd>
                    </>
                )}

                <dt>הועלה על ידי</dt>
                <dd>{celebration.owner.fullName}</dd>
            </dl>

            {celebration.description && (
                <p style={{ whiteSpace: "pre-line" }}>{celebration.description}</p>
            )}

            <section aria-label="קבוצות">
                <h2>משותפת בקבוצות</h2>

                {celebration.groups.length === 0 ? (
                    <p>השמחה לא משותפת כרגע באף קבוצה שלך.</p>
                ) : (
                    <ul>
                        {celebration.groups.map((group) => (
                            <li key={group.id}>
                                <Link to={`/groups/${group.id}`}>{group.name}</Link>

                                {permissions.canRemoveFromGroupIds.includes(group.id) && (
                                    <button
                                        type="button"
                                        disabled={removeFromGroup.isPending}
                                        onClick={() => handleRemoveFromGroup(group.id, group.name)}
                                    >
                                        {removeFromGroup.isPending &&
                                        removeFromGroup.variables?.groupId === group.id
                                            ? "מסירה..."
                                            : "הסרה מהקבוצה"}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {removeFromGroup.isError && <ErrorMessage error={removeFromGroup.error} />}
            </section>

            {permissions.canEdit && (
                <>
                    <CelebrationOwnerActions
                        celebrationId={celebration.id}
                        title={celebration.title}
                    />
                    <CelebrationImageEditor celebration={celebration} />
                </>
            )}
        </article>
    );
}