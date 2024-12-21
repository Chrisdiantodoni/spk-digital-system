type SearchProps = {
  value: string;
  onChange: (value: string) => void;
  className: string;
};

function SearchUnit({ value, onChange, className }: SearchProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onChange(value);
  };

  return (
    <div className={`flex relative items-center ${className}`}>
      <input
        type="text"
        placeholder="Cari Nomor Rangka"
        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        value={value}
        onChange={handleChange}
      ></input>
      <span className="absolute right-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-search"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </span>
    </div>
  );
}

export default SearchUnit;
