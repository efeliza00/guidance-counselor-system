import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
const SearchComplaint = ({ search, setSearch }) => {
  const [text, setText] = useState(search || "");
  const [debouncedText] = useDebounce(text, 400);

  useEffect(() => {
    setSearch(debouncedText);
  }, [debouncedText, setSearch]);

  return (
    <IconField iconPosition="left">
      <InputIcon className="pi pi-search" />
      <InputText
        type="text"
        value={text}
        placeholder="Search"
        onChange={(e) => setText(e.target.value)}
      />
    </IconField>
  );
};

export default SearchComplaint;
