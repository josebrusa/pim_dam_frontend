import { Search } from 'lucide-react';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="flex w-full items-center gap-2 rounded-full border border-border bg-white px-4 py-2 shadow-[0_8px_20px_rgba(10,61,98,0.06)]">
      <Search className="h-4 w-4 text-text-muted" />
      <input
        type="search"
        placeholder="Buscar productos, atributos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
      />
    </div>
  );
}
