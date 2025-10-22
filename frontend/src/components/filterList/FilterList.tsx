import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DateRangeSelector } from "../ui/dateRangeSelector";
import { Label } from "../ui/label";

interface Category {
  id: string | number;
  name: string;
  parentCategory?: { id: string | number } | null;
}

interface ApplyParams {
  categoryIds: number[];
  startingDate?: string;
  endingDate?: string;
}

interface CategoryFilterProps {
  categories?: Category[];
  selectedCategories?: number[];
  selectedStartingDate?: string | undefined;
  selectedEndingDate?: string | undefined;

  onApply: (params: ApplyParams) => void;
  onClear?: () => void;
}

const FilterList = ({
  categories = [],
  selectedCategories = [],
  selectedStartingDate,
  selectedEndingDate,
  onApply,
  onClear,
}: CategoryFilterProps) => {
  const [localSelectedCategories, setLocalSelectedCategories] = useState<
    number[]
  >(selectedCategories ?? []);
  const [localStartingDate, setLocalStartingDate] = useState<
    string | undefined
  >(selectedStartingDate);
  const [localEndingDate, setLocalEndingDate] = useState<string | undefined>(
    selectedEndingDate
  );

  useEffect(() => {
    setLocalSelectedCategories(selectedCategories ?? []);
  }, [selectedCategories]);
  useEffect(() => {
    setLocalStartingDate(selectedStartingDate);
  }, [selectedStartingDate]);
  useEffect(() => {
    setLocalEndingDate(selectedEndingDate);
  }, [selectedEndingDate]);

  const { parents, childrenByParent } = useMemo(() => {
    const parents = categories.filter(
      (c) => !c.parentCategory || !c.parentCategory.id
    );

    const childrenByParent = new Map<number, Category[]>();
    parents.forEach((p) => childrenByParent.set(Number(p.id), []));
    categories.forEach((c) => {
      const pid = c.parentCategory?.id;
      if (pid != null) {
        const key = Number(pid);
        if (!childrenByParent.has(key)) childrenByParent.set(key, []);
        childrenByParent.get(key)!.push(c);
      }
    });

    parents.sort((a, b) => a.name.localeCompare(b.name));
    for (const arr of childrenByParent.values()) {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    }

    return { parents, childrenByParent };
  }, [categories]);

  const isCatChecked = useCallback(
    (idNum: number) => localSelectedCategories.includes(idNum),
    [localSelectedCategories]
  );

  const toggleParent = useCallback(
    (parentId: number) => {
      const children = childrenByParent.get(parentId) ?? [];
      const childrenIds = children.map((c) => Number(c.id));

      setLocalSelectedCategories((prev) => {
        const parentSelected = prev.includes(parentId);
        if (parentSelected) {
          // Décocher le parent et tous ses enfants
          return prev.filter(
            (id) => id !== parentId && !childrenIds.includes(id)
          );
        } else {
          // Cocher le parent et tous ses enfants
          return [...prev, parentId, ...childrenIds];
        }
      });
    },
    [childrenByParent]
  );

  const toggleChild = useCallback(
    (parentId: number, childId: number) => {
      const children = childrenByParent.get(parentId) ?? [];
      const childrenIds = children.map((c) => Number(c.id));

      setLocalSelectedCategories((prev) => {
        const hasChild = prev.includes(childId);
        let newSelection: number[];

        if (hasChild) {
          // Décocher l'enfant
          newSelection = prev.filter((id) => id !== childId);
          // Décocher aussi le parent si l'enfant était sélectionné
          newSelection = newSelection.filter((id) => id !== parentId);
        } else {
          // Cocher l'enfant
          newSelection = [...prev, childId];

          // Vérifier si tous les enfants sont maintenant sélectionnés
          const allChildrenSelected = childrenIds.every((id) =>
            newSelection.includes(id)
          );
          if (allChildrenSelected && !newSelection.includes(parentId)) {
            // Cocher le parent si tous les enfants sont sélectionnés
            newSelection = [...newSelection, parentId];
          }
        }

        return newSelection;
      });
    },
    [childrenByParent]
  );

  const clearAllFilters = useCallback(() => {
    setLocalSelectedCategories([]);
    setLocalStartingDate(undefined);
    setLocalEndingDate(undefined);
  }, []);

  return (
    <>
      <DateRangeSelector
        selectedStartingDate={localStartingDate}
        selectedEndingDate={localEndingDate}
        setSelectedStartingDate={setLocalStartingDate}
        setSelectedEndingDate={setLocalEndingDate}
      />

      <div className="space-y-2">
        <h2 className="font-semibold">Catégories :</h2>
        {parents.map((parent) => {
          const pid = Number(parent.id);
          const parentChecked = isCatChecked(pid);
          const children = childrenByParent.get(pid) ?? [];

          return (
            <div key={parent.id} className="space-y-1">
              <Label
                htmlFor={`category-${parent.id}`}
                className="flex items-center gap-2"
              >
                <Checkbox
                  id={`category-${parent.id}`}
                  checked={parentChecked}
                  onCheckedChange={() => toggleParent(pid)}
                />
                {parent.name}
              </Label>

              {children.length > 0 && (
                <div className="pl-6 mt-1 space-y-1 border-l border-border">
                  {children.map((child) => {
                    const cid = Number(child.id);
                    return (
                      <Label
                        key={child.id}
                        htmlFor={`category-${child.id}`}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          id={`category-${child.id}`}
                          checked={isCatChecked(cid)}
                          onCheckedChange={() => toggleChild(pid, cid)}
                        />
                        {child.name}
                      </Label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-2 pt-2">
        <Button
          variant="destructive"
          onClick={() => {
            clearAllFilters();
            if (onClear) {
              onClear();
            }
          }}
        >
          Effacer
        </Button>
        <Button
          onClick={() =>
            onApply({
              categoryIds: localSelectedCategories,
              startingDate: localStartingDate,
              endingDate: localEndingDate,
            })
          }
        >
          Filtrer
        </Button>
      </div>
    </>
  );
};

export default memo(FilterList);
