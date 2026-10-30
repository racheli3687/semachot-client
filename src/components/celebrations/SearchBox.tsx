import { useState } from "react";
import type { FormEvent } from "react";
import Icon from "../ui/Icon";

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
    <form role="search" onSubmit={handleSubmit} className="relative flex w-full items-center sm:w-80">
      <label htmlFor="celebration-search" className="sr-only">חיפוש</label>
      <span className="pointer-events-none absolute right-3.5 text-muted"><Icon name="search" className="size-[1.1rem]" /></span>
      <input
        id="celebration-search"
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="חיפוש לפי כותרת, מקום או שם"
        className="input input-pill ps-10 pe-20 [&::-webkit-search-cancel-button]:hidden"
      />
      <div className="absolute left-1.5 flex items-center gap-0.5">
        {text && (
          <button type="button" onClick={handleClear} aria-label="ניקוי החיפוש" className="grid size-7 cursor-pointer place-items-center rounded-full text-muted hover:bg-surface-2">
            <Icon name="x" className="size-3.5" />
          </button>
        )}
        <button type="submit" className="btn btn-primary btn-sm py-1.5">חיפוש</button>
      </div>
    </form>
  );
}
