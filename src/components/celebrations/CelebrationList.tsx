
import type { Celebration, PaginatedResponse } from "../../types";
import Loading from "../Loading";
import ErrorMessage from "../ErrorMessage";
import EmptyState from "../EmptyState";
import CelebrationCard from "./CelebrationCard";


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
        return <Loading message="טוען אירועים..."/>
    }
    if (isError) {
        return <ErrorMessage error={error}/>
    }
    if (!data || data.items.length === 0) {
        return <EmptyState message="לא נמצאו שמחות. נסי לשנות את הסינון."/>
    }
    return (
        <section aria-live="polite">
            <p>נמצאו {data.total}  שמחות</p>
            <ul style={{ opacity: isPlaceholderData ? 0.5 : 1 }}>
                {data.items.map(item =>
                    <li key={item.id}>
                        <CelebrationCard celebration={item}></CelebrationCard>
                    </li>
                )}
            </ul>
        </section>
    )
        

    

}

