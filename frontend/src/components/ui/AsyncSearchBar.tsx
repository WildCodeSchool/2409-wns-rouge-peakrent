import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import { useDebounce } from "use-debounce";

import { FetchResultsResponse } from "@/components/forms/formField/combobox/search/Search";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "./input";

interface Identifiable {
  id: string | number;
}

interface AsyncSearchBarProps<T extends Identifiable> {
  placeholder?: string;
  fetchResults: (
    query: string,
    signal?: AbortSignal
  ) => Promise<FetchResultsResponse<T[]>>;
  renderItem: (item: T) => JSX.Element;
  skeletonItems?: JSX.Element;
}

export default function AsyncSearchBar<T extends Identifiable>({
  placeholder = "Select...",
  fetchResults,
  renderItem,
  skeletonItems,
}: AsyncSearchBarProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [datas, setDatas] = useState<T[]>([]);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [itemsToShow, setItemsToShow] = useState(30);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!debouncedSearchQuery) {
      setDatas([]);
      setIsOpen(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      setDatas([]);
      setVisibleItems([]);
      setIsOpen(true);
      try {
        const { data } = await fetchResults(debouncedSearchQuery);
        setDatas(data);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearchQuery]);

  const loadMoreItems = useCallback(() => {
    if (datas.length > visibleItems.length) {
      setVisibleItems((prev) => [
        ...prev,
        ...datas.slice(prev.length, prev.length + itemsToShow),
      ]);
    }
  }, [datas.length, visibleItems.length, itemsToShow]);

  useEffect(() => {
    if (!isOpen) {
      setVisibleItems(datas.slice(0, itemsToShow));
    }
  }, [isOpen, datas, itemsToShow]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);

      if (!value.trim()) {
        setIsOpen(false);
      }
    },
    []
  );

  const handleInputFocus = useCallback(() => {
    if (searchQuery.trim() && (datas.length > 0 || isLoading)) {
      setIsOpen(true);
    }
  }, [searchQuery, datas.length, isLoading]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open && inputRef.current === document.activeElement) {
      setTimeout(() => {
        if (inputRef.current === document.activeElement) {
          return;
        }
        setIsOpen(false);
      }, 0);
      return;
    }
    setIsOpen(open);
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          className="relative ml-auto flex-1 md:grow-0"
          aria-label="Rechercher un produit"
          role="combobox"
        >
          <Search className="text-muted-foreground absolute left-2.5 top-2.5 size-4" />
          <Input
            ref={inputRef}
            type="search"
            placeholder={placeholder}
            className="bg-background w-full rounded-lg pl-8 md:w-[300px] lg:w-[336px] text-xs md:text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-full min-w-[336px] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        side="bottom"
        align="start"
        aria-label="Résultats de recherche"
      >
        <Command
          shouldFilter={false}
          className="h-auto rounded-lg border border-b-0 shadow-md"
        >
          {!isLoading && datas.length === 0 && (
            <CommandEmpty>Pas de resultat.</CommandEmpty>
          )}
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
                  <div className="p-4 text-sm">
                    Une erreur s&apos;est produite
                  </div>
                )}

                {visibleItems.map((item) => (
                  <CommandItem
                    key={item.id as string}
                    className="gap-2"
                    role="option"
                  >
                    <div
                      className="flex w-full items-center justify-between gap-2"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      {renderItem(item)}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <InfiniteScroll
                isLoading={isLoading}
                hasMore={visibleItems.length < datas.length}
                next={loadMoreItems}
                threshold={1}
              >
                {visibleItems.length < datas.length && (
                  <Loader className="mx-auto my-2 size-8 animate-spin " />
                )}
              </InfiniteScroll>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
