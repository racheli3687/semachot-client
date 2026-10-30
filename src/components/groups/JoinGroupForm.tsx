
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";
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
    <section className="panel flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-[0.9rem] bg-gradient-to-br from-[#ff9f6b] to-[#ff6fa8] text-white shadow-float"><Icon name="key" className="size-6" /></span>
        <div>
          <h2 className="card-title">הצטרפות לקבוצה</h2>
          <p className="hint">קיבלת קוד הצטרפות? הדביקי אותו כאן.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <label htmlFor="join-code" className="label">קוד הצטרפות</label>

        <input
          id="join-code"
          className="input text-center font-mono text-xl tracking-[0.35em] uppercase"
          placeholder="ABCD1234"
          dir="ltr"
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
          <p role="alert" className="field-error">{errors.joinCode.message}</p>
        )}

        {errors.root && (
          <p role="alert" className="form-alert">{errors.root.message}</p>
        )}

        <button type="submit" className="btn btn-primary self-start" disabled={isSubmitting}>
          {isSubmitting ? "מצטרפת..." : "הצטרפות"}
        </button>
      </form>
    </section>
  );
}
