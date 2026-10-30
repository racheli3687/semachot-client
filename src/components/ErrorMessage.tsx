import Icon from "./ui/Icon";

type ErrorMessageProps = {
  error: unknown;
};

export default function ErrorMessage({ error }: ErrorMessageProps) {
  const message =
    error instanceof Error
      ? error.message
      : "אירעה שגיאה";

  return (
    <p role="alert" className="form-alert flex items-center gap-2">
      <Icon name="alert" className="size-5 shrink-0" />
      {message}
    </p>
  );
}
