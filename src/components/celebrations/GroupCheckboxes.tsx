import { useFormContext } from "react-hook-form";
import type { Group } from "../../types"
import { toArray, type CelebrationFormValues } from "../../utils/celebrationForm";

type GroupCheckBoxesProps=
{
    groups:Group[]
};

export default function GroupCheckBoxes({groups}:GroupCheckBoxesProps)
{
    const { register, formState: { errors } } = useFormContext<CelebrationFormValues>();
    return (
    <fieldset className="panel">
      <legend className="sr-only">באילו קבוצות לשתף?</legend>
      <h2 className="card-title mb-5 flex items-center gap-3" aria-hidden="true">
        <span className="step">4</span> באילו קבוצות לשתף?
      </h2>
      <div className="flex flex-wrap gap-2.5">
        {groups.map((g) => (
          <label
            key={g.id}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-surface-2 px-5 py-2.5 font-medium ring-1 ring-transparent transition-all duration-200 select-none has-[:checked]:bg-accent-soft has-[:checked]:text-accent has-[:checked]:ring-accent/40"
          >
            <input
              type="checkbox"
              className="checkbox"
              value={String(g.id)}
              {...register("groupIds", {
                validate: (v) => toArray(v).length > 0 || "יש לבחור לפחות קבוצה אחת",
              })}
            />
            {g.name}
          </label>
        ))}
      </div>
      {errors.groupIds && <p role="alert" className="field-error mt-3">{errors.groupIds.message}</p>}
    </fieldset>
  );

}
