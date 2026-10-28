
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useJoinGroup } from "../../hooks/useGroups";
import type { JoinGroupRequest } from "../../types";

export default function JoinGroupForm() {
  const navigate = useNavigate();
  const joinGroup = useJoinGroup();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<JoinGroupRequest>();

  async function onSubmit(data: JoinGroupRequest) {
    try {
      const group = await joinGroup.mutateAsync({
        joinCode: data.joinCode.trim().toUpperCase(),
      });

      navigate(`/groups/${group.id}`);
    } catch (error) {
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "אירעה שגיאה בהצטרפות לקבוצה",
      });
    }
  }

  return (
    <section>
      <h2>הצטרפות לקבוצה</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="join-code">קוד הצטרפות</label>

        <input
          id="join-code"
          autoComplete="off"
          maxLength={8}
          {...register("joinCode", {
            required: "יש להזין קוד הצטרפות",
            validate: (value) =>
              value.trim().length === 8 ||
              "קוד ההצטרפות חייב להכיל 8 תווים",
          })}
        />

        {errors.joinCode && (
          <p role="alert">{errors.joinCode.message}</p>
        )}

        {errors.root && (
          <p role="alert">{errors.root.message}</p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "מצטרפת..." : "הצטרפות"}
        </button>
      </form>
    </section>
  );
}
