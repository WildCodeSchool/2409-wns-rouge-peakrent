import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { useDebounce } from "use-debounce";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";

export type FetchResultsResponse<T> = {
  data: T;
  success: boolean;
  message: string;
};

interface SearchProps<T> {
  fetchResults: (query: string) => Promise<FetchResultsResponse<T[]>>;
  renderItem: (item: T) => JSX.Element;
  selectedResult?: T;
  onSelectResult: (item: T) => void;
  placeholder?: string;
  compareFn: (a: T, b: T) => boolean;
  skeletonItems?: JSX.Element;
}

export function Search<T extends { id: string | number }>({
  fetchResults,
  renderItem,
  selectedResult,
  onSelectResult,
  placeholder = "Search...",
  compareFn,
  skeletonItems,
}: SearchProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!debouncedSearchQuery) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const { data } = await fetchResults(debouncedSearchQuery);
        setData(data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchQuery, fetchResults]);

  return (
    <Command
      shouldFilter={false}
      className="h-auto rounded-lg border border-b-0 shadow-md"
    >
      <div className="relative">
        <CommandInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder={placeholder}
        />
        {searchQuery && (
          <Button
            className="absolute right-2 top-1/2 h-fit -translate-y-1/2 p-0 hover:bg-transparent"
            onClick={() => setSearchQuery("")}
            type="button"
            variant="ghost"
          >
            <XIcon className="text-muted-foreground size-4" />
          </Button>
        )}
      </div>
      {!isLoading && <CommandEmpty>Pas de resultat.</CommandEmpty>}
      <CommandList>
        <ScrollArea className="max-h-72 w-full overflow-y-auto">
          <CommandGroup>
            {isLoading &&
              (skeletonItems ? (
                skeletonItems
              ) : (
                <div className="p-4 text-sm">Recherche...</div>
              ))}
            {isError && (
              <div className="p-4 text-sm">Une erreur s&apos;est produite</div>
            )}

            {data.map((item) => (
              <CommandItem
                key={item.id as string}
                onSelect={() => onSelectResult(item)}
                className={cn(
                  "gap-2",
                  compareFn(item, selectedResult!) && "bg-muted"
                )}
              >
                {renderItem(item)}
              </CommandItem>
            ))}
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </Command>
  );
}
