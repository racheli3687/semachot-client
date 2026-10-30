
import { motion } from "motion/react";
import type { Celebration, PaginatedResponse } from "../../types";
import ErrorMessage from "../ErrorMessage";
import EmptyState from "../EmptyState";
import { CardSkeletonGrid } from "../Skeleton";
import CelebrationCard from "./CelebrationCard";
import { fadeUp, stagger } from "../../utils/motion";


type CelebrationListProps =
    {
        data: PaginatedResponse<Celebration> | undefined,
        isPending: boolean,
        isError: boolean,
        error: unknown,
        isPlaceholderData: boolean
    };

export default function CelebrationList({ data, isPending, isError, error, isPlaceholderData }: CelebrationListProps) {

    if (isPending) {
        return <CardSkeletonGrid label="טוען אירועים..."/>
    }
    if (isError) {
        return <ErrorMessage error={error}/>
    }
    if (!data || data.items.length === 0) {
        return <EmptyState message="לא נמצאו שמחות. נסי לשנות את הסינון."/>
    }
    return (
        <section aria-live="polite">
            <p className="mb-4 text-sm text-muted">נמצאו <strong className="text-ink">{data.total}</strong> שמחות</p>
            <motion.ul
                key={data.items.map((item) => item.id).join("-")}
                initial="hidden"
                animate="show"
                variants={stagger(0.05)}
                className={`list transition-opacity duration-300 ${isPlaceholderData ? "opacity-50" : ""}`}
            >
                {data.items.map(item =>
                    <motion.li key={item.id} variants={fadeUp}>
                        <CelebrationCard celebration={item}></CelebrationCard>
                    </motion.li>
                )}
            </motion.ul>
        </section>
    )




}
