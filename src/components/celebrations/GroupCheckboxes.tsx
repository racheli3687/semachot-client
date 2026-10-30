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
    <fieldset>
      <legend>באילו קבוצות לשתף?</legend>
      {groups.map((g) => (
        <label key={g.id}>
          <input
            type="checkbox"
            value={String(g.id)}
            {...register("groupIds", {
              validate: (v) => toArray(v).length > 0 || "יש לבחור לפחות קבוצה אחת",
            })}
          />
          {g.name}
        </label>
      ))}
      {errors.groupIds && <p role="alert">{errors.groupIds.message}</p>}
    </fieldset>
  );

}