
import { useCelebrationsQuery } from "../../hooks/useCelebrations";
import type { GetCelebrationsParams } from "../../types";
import Pagination from "../Pagination";
import CelebrationList from "./CelebrationList";

type CelebrationListViewProps = {
  params: GetCelebrationsParams;
  onPageChange: (page: number) => void;
};

export default function CelebrationListView({ params, onPageChange }: CelebrationListViewProps) {
  const query = useCelebrationsQuery(params);

  return (
    <>
      <CelebrationList
        data={query.data}
        isPending={query.isPending}
        isError={query.isError}
        error={query.error}
        isPlaceholderData={query.isPlaceholderData}
      />

      {query.data && (
        <Pagination
          page={query.data.page}
          totalPages={query.data.totalPages}
          onChange={onPageChange}
        />
      )}
    </>
  );
}