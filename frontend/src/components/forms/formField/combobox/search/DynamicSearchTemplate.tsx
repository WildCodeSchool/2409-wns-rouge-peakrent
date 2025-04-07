import { Button } from "@/components/ui/button";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { cn } from "@/lib/utils";
import { CheckIcon, Loader, XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

import { FetchResultsResponse } from "./Search";

interface Identifiable {
  id: string | number;
}

interface DynamicSearchProps<T extends Identifiable> {
  form: any;
  name: string;
  fetchResults: (query: string) => Promise<FetchResultsResponse<T[]>>;
  renderItem: (item: T) => React.ReactNode;
  skeletonItems?: JSX.Element;
  setSelected: Dispatch<SetStateAction<T | undefined>>;
  selected?: T;
  placeholder?: string;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  compareFn?: (a: T, b: T) => boolean;
  handleSelectItem?: (item: T) => void;
  datas: T[];
  setDatas: Dispatch<SetStateAction<T[]>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

export function DynamicSearchTemplate<T extends Identifiable>({
  form,
  name,
  fetchResults,
  renderItem,
  skeletonItems,
  setSelected,
  selected,
  placeholder = "Search...",
  setIsOpen,
  compareFn = (a, b) => a?.id === b?.id,
  handleSelectItem,
  datas,
  setDatas,
  searchQuery,
  setSearchQuery,
}: DynamicSearchProps<T>) {
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [itemsToShow, setItemsToShow] = useState(30);

  const defaultSelectItem = (item: T) => {
    setSelected(item);
    form.setValue(name, item.id);
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  const onSelectItem = handleSelectItem || defaultSelectItem;

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    if (!debouncedSearchQuery) {
      setDatas([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      setDatas([]);
      setVisibleItems([]);
      try {
        const { data, success, message } =
          await fetchResults(debouncedSearchQuery);
        setDatas(data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearchQuery]);

  const loadMoreItems = () => {
    if (datas.length > visibleItems.length) {
      setVisibleItems((prev) => [
        ...prev,
        ...datas.slice(prev.length, prev.length + itemsToShow),
      ]);
    }
  };

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
            onClick={() => {
              setSearchQuery("");
              setDatas([]);
              setVisibleItems([]);
            }}
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

            {visibleItems.map((item) => (
              <CommandItem
                key={item.id as string}
                onSelect={() => onSelectItem(item)}
                className={cn(
                  "gap-2",
                  compareFn(item, selected!) && "bg-muted"
                )}
              >
                <div
                  className="flex w-full items-center justify-between gap-2"
                  onClick={() => onSelectItem(item)}
                >
                  <CheckIcon
                    className={cn(
                      "size-4",
                      compareFn(item, selected!) ? "opacity-100" : "opacity-0"
                    )}
                  />
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
  );
}
