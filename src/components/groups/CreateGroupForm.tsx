
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
    <section>
      <h2>יצירת קבוצה חדשה</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="group-name">שם הקבוצה</label>

        <input
          id="group-name"
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

        {errors.name && <p role="alert">{errors.name.message}</p>}
        {errors.root && <p role="alert">{errors.root.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "יוצרת קבוצה..." : "יצירת קבוצה"}
        </button>
      </form>
    </section>
  );
}
