
type ErrorMessageProps = {
  error: unknown;
};

export default function ErrorMessage({ error }: ErrorMessageProps) {
  const message =
    error instanceof Error
      ? error.message
      : "אירעה שגיאה";

  return <p role="alert">{message}</p>;
}
