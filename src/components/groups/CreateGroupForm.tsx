
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";
import { useCreateGroup } from "../../hooks/useGroups";
import type { CreateGroupRequest } from "../../types";

export default function CreateGroupForm() {
  const navigate = useNavigate();
  const createGroup = useCreateGroup();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateGroupRequest>();

  async function onSubmit(data: CreateGroupRequest) {
    try {
      const newGroup = await createGroup.mutateAsync({
        name: data.name.trim(),
      });

      navigate(`/groups/${newGroup.id}`);
    } catch (error) {
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "אירעה שגיאה ביצירת הקבוצה",
      });
    }
  }

  return (
    <section className="panel flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-[0.9rem] bg-gradient-to-br from-[#8b7bff] to-[#4fb6ff] text-white shadow-float"><Icon name="plus" className="size-6" /></span>
        <div>
          <h2 className="card-title">יצירת קבוצה חדשה</h2>
          <p className="hint">פותחים קבוצה ומזמינים אליה עם קוד.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <label htmlFor="group-name" className="label">שם הקבוצה</label>

        <input
          id="group-name"
          className="input"
          placeholder="למשל: משפחת לוי"
          {...register("name", {
            required: "יש להזין שם קבוצה",
            validate: (value) =>
              value.trim().length >= 2 ||
              "שם הקבוצה חייב להכיל לפחות 2 תווים",
            maxLength: {
              value: 50,
              message: "שם הקבוצה יכול להכיל עד 50 תווים",
            },
          })}
        />

        {errors.name && <p role="alert" className="field-error">{errors.name.message}</p>}
        {errors.root && <p role="alert" className="form-alert">{errors.root.message}</p>}

        <button type="submit" className="btn btn-primary self-start" disabled={isSubmitting}>
          {isSubmitting ? "יוצרת קבוצה..." : "יצירת קבוצה"}
        </button>
      </form>
    </section>
  );
}
