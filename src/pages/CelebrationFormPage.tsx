import { Link, useNavigate, useParams } from "react-router-dom";
import { useGroupsQuery } from "../hooks/useGroups";
import { useHebrewTodayQuery } from "../hooks/useHebrewCalendar";
import { useCelebrationQuery, useCreateCelebration, useUpdateCelebration, useUploadCelebrationImage } from "../hooks/useCelebrations";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { celebrationToFormValues, emptyFormValues, formValuesToInput, type CelebrationFormValues } from "../utils/celebrationForm";
import CelebrationForm from "../components/celebrations/CelebrationForm";
import { ApiError } from "../api/api";
import Icon from "../components/ui/Icon";


export default function CelebrationFormPage() {

   const navigate = useNavigate();
   const createMutation = useCreateCelebration();
   const updateMutation = useUpdateCelebration();
   const uploadMutation = useUploadCelebrationImage();

   async function handleSave(values: CelebrationFormValues) {
      const input = formValuesToInput(values);

      if (isEdit) {
         await updateMutation.mutateAsync({ id: celebrationId, input });
         navigate(`/celebrations/${celebrationId}`);
         return;
      }

      const created = await createMutation.mutateAsync({ input });
      const file = values.image?.[0];
      if (file) {
         try {
            await uploadMutation.mutateAsync({ id: created.id, file });
         } catch {
            navigate(`/celebrations/${created.id}`, { state: { imageFailed: true } });
            return;
         }
      }
      navigate(`/celebrations/${created.id}`);
      
   }
   const { id } = useParams<{ id: string }>();

   const isEdit = id !== undefined;
   const celebrationId = Number(id);

   // קוראים לכל ה-Hooks בכל רינדור, בלי תנאים.
   const groupsQuery = useGroupsQuery();
   const todayQuery = useHebrewTodayQuery();
   const celebrationQuery = useCelebrationQuery(celebrationId);



   // 1. מצב עריכה עם מזהה לא תקין.
   if (
      isEdit &&
      (!Number.isInteger(celebrationId) || celebrationId <= 0)
   ) {
      return <p className="state-box">שמחה לא נמצאה</p>;
   }


   // 3. שגיאה באחד מהנתונים.
   if (
      groupsQuery.isError ||
      todayQuery.isError ||
      (isEdit && celebrationQuery.isError)
   ) {
      const celebrationNotFound =
         isEdit &&
         celebrationQuery.error instanceof ApiError &&
         celebrationQuery.error.status === 404

      if (celebrationNotFound) {
         return <p className="state-box">השמחה לא נמצאה</p>;
      }

      return <ErrorMessage error={groupsQuery.error || celebrationQuery.error || todayQuery.error} />;
   }

   // לאחר בדיקת השגיאות, הנתונים זמינים.
   const groups = groupsQuery.data;
   const today = todayQuery.data;

   const celebration = isEdit
      ? celebrationQuery.data
      : undefined;



   // 2. נתונים שעדיין נטענים.

   if (!groups || !today || (isEdit && !celebration)) {
      return <Loading message="טוען..." />;
   }

   // 4. בדיקת הרשאת עריכה.
   if (isEdit && !celebration?.permissions.canEdit) {
      return (
         <section className="state-box">
            <Icon name="key" className="size-10 text-accent" />
            <p>אין לך הרשאה לערוך שמחה זו</p>
            <Link to={`/celebrations/${celebrationId}`} className="btn btn-secondary">
               חזרה לשמחה
            </Link>
         </section>
      );
   }

   // 5. בדיקה שיש לפחות קבוצה אחת.
   if (groups.length === 0) {
      return (
         <section className="state-box">
            <Icon name="users" className="size-10 text-accent" />
            <p>כדי להוסיף שמחה צריך להיות חברה בקבוצה אחת לפחות</p>
            <Link to="/groups" className="btn btn-primary">מעבר לקבוצות שלי</Link>
         </section>
      );
   }

   // 6. הכנת הערכים הראשוניים לטופס.
   const initialValues = celebration
      ? celebrationToFormValues(celebration)
      : emptyFormValues(today.hebrewDate, groups);

   const minYear = celebration
      ? Math.min(celebration.hebrewDate.year, today.hebrewDate.year)
      : today.hebrewDate.year;
   return (
      <section className="mx-auto max-w-3xl">
         <header className="mb-10">
            <p className="eyebrow">{isEdit ? "עריכה" : "שמחה חדשה"}</p>
            <h1 className="page-title mt-2">{isEdit ? "עריכת שמחה." : "הוספת שמחה."}</h1>
            <p className="mt-4 text-xl text-muted">
               {isEdit ? "מעדכנים פרטים - וכל החברות בקבוצה יראו מיד." : "ממלאים כמה פרטים, וכל הקבוצה יודעת על השמחה."}
            </p>
         </header>
         <CelebrationForm
            defaultValues={initialValues}
            groups={groups}
            minYear={minYear}
            submitLabel={isEdit ? "שמירת שינויים" : "שמירה"}
            showImage={!isEdit}
            onSubmit={handleSave}
            onCancel={() => navigate(-1)}></CelebrationForm>

      </section>
   );
}
