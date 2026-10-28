type LoadingProps = {
  message?: string;
};

export default function Loading({
  message = "טוען...",
}: LoadingProps) {
  return <p role="status">{message}</p>;
}