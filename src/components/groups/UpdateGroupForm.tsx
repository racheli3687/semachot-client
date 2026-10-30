import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateGroup } from "../../hooks/useGroups";
import type { UpdateGroupRequest } from "../../types";
import Icon from "../ui/Icon";

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
      <button type="button" className="btn btn-secondary justify-start" onClick={() => setIsEditing(true)}>
        <Icon name="pencil" /> שינוי שם הקבוצה
      </button>
    );
  }

  return (
    <section className="rounded-2xl bg-surface-2 p-4">
      <h3 className="mb-3 text-base font-semibold">שינוי שם הקבוצה</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <label htmlFor="group-name" className="label">שם הקבוצה החדש</label>

        <input
          id="group-name"
          className="input"
          autoFocus
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

        <div className="flex gap-2">
        <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
          {isSubmitting ? "שומרת..." : "שמירת השם"}
        </button>

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            reset({ name: currentName });
            setIsEditing(false);
          }}
        >
          ביטול
        </button>
        </div>
      </form>
    </section>
  );
}