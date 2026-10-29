import { useTodayCelebrationsQuery } from "../../hooks/useCelebrations";
import CelebrationCard from "./CelebrationCard";

export default function TodayCelebration() {
  const { data } = useTodayCelebrationsQuery();

  if (!data || data.length === 0) return null;

  return (
    <section>
      <h2>השמחות של היום</h2>
      <ul>
        {data.map((celebration) => (
          <li key={celebration.id}>
            <CelebrationCard celebration={celebration} />
          </li>
        ))}
      </ul>
    </section>
  );
}