import type { Celebration } from "../../types";
import CelebrationCard from "../celebrations/CelebrationCard";

type DayCelebrationsProps = {
    title: string;                 // למשל "ט״ו חשוון"
    celebrations: Celebration[];
};

export default function DayCelebrations({ title, celebrations }: DayCelebrationsProps) {
    return (
        <section aria-live="polite">
            <h3>שמחות ב־{title}</h3>

            {celebrations.length === 0 ? (
                <p>אין שמחות ביום הזה.</p>
            ) : (
                <ul>
                    {celebrations.map((celebration) => (
                        <li key={celebration.id}>
                            <CelebrationCard celebration={celebration} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}