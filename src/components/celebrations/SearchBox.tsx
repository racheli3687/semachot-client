import { useState } from "react";
import type { FormEvent } from "react";

type SearchBoxProps = {
  initialValue: string;
  onSearch: (text: string | undefined) => void;
};

export default function SearchBox({ initialValue, onSearch }: SearchBoxProps) {
  const [text, setText] = useState(initialValue);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearch(text.trim() || undefined);
  }

  function handleClear() {
    setText("");
    onSearch(undefined);
  }

  return (
    <form role="search" onSubmit={handleSubmit}>
      <label htmlFor="celebration-search">חיפוש</label>
      <input
        id="celebration-search"
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="הקלד כאן כדי לחפש"
      />
      <button type="submit">חיפוש</button>
      {text && (
        <button type="button" onClick={handleClear} aria-label="ניקוי החיפוש">
          ×
        </button>
      )}
    </form>
  );
}