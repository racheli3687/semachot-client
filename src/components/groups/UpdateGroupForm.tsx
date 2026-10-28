import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateGroup } from "../../hooks/useGroups";
import type { UpdateGroupRequest } from "../../types";

interface UpdateGroupFormProps {
  groupId: number;
  currentName: string;
}

export default function UpdateGroupForm({
  groupId,
  currentName,
}: UpdateGroupFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateGroup = useUpdateGroup();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateGroupRequest>({
    defaultValues: { name: currentName },
  });

  async function onSubmit(data: UpdateGroupRequest) {
    try {
      await updateGroup.mutateAsync({
        groupId,
        details: { name: data.name.trim() },
      });

      setIsEditing(false);
      reset({ name: data.name.trim() });
    } catch (error) {
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "אירעה שגיאה בעדכון שם הקבוצה",
      });
    }
  }

  if (!isEditing) {
    return (
      <button type="button" onClick={() => setIsEditing(true)}>
        שינוי שם הקבוצה
      </button>
    );
  }

  return (
    <section>
      <h2>שינוי שם הקבוצה</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="group-name">שם הקבוצה החדש</label>

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
          {isSubmitting ? "שומרת..." : "שמירת השם"}
        </button>

        <button
          type="button"
          onClick={() => {
            reset({ name: currentName });
            setIsEditing(false);
          }}
        >
          ביטול
        </button>
      </form>
    </section>
  );
}