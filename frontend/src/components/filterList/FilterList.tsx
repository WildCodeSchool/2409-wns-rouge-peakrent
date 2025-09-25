import React, { useMemo, useCallback, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DateRangeSelector } from "../ui/dateRangeSelector";
import { Label } from "../ui/label";

interface Category {
  id: string | number;
  name: string;
  parentCategory?: { id: string | number } | null;
}

interface CategoryFilterProps {
  activities?: Array<{ id: string | number; name: string }>;
  selectedActivities?: number[];
  setSelectedActivities?: React.Dispatch<React.SetStateAction<number[]>>;

  categories?: Category[];
  selectedCategories?: number[];
  setSelectedCategories?: React.Dispatch<React.SetStateAction<number[]>>;

  selectedStartingDate?: string | undefined;
  setSelectedStartingDate: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;

  selectedEndingDate?: string | undefined;
  setSelectedEndingDate: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;

  handleFilter: () => void;
  autoFilter?: boolean;
}

const FilterList = ({
  activities = [],
  selectedActivities = [],
  setSelectedActivities,
  categories = [],
  selectedCategories = [],
  setSelectedCategories,
  handleFilter,
  selectedStartingDate,
  setSelectedStartingDate,
  selectedEndingDate,
  setSelectedEndingDate,
  autoFilter = false,
}: CategoryFilterProps) => {
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
    (idNum: number) => selectedCategories.includes(idNum),
    [selectedCategories]
  );

  const toggleActivity = useCallback(
    (idNum: number) => {
      if (!setSelectedActivities) return;
      setSelectedActivities((prev) =>
        prev.includes(idNum)
          ? prev.filter((id) => id !== idNum)
          : [...prev, idNum]
      );
    },
    [setSelectedActivities]
  );

  const toggleParent = useCallback(
    (parentId: number) => {
      if (!setSelectedCategories) return;

      const children = childrenByParent.get(parentId) ?? [];
      const childrenIds = children.map((c) => Number(c.id));

      setSelectedCategories((prev) => {
        const parentSelected = prev.includes(parentId);
        if (parentSelected) {
          return prev.filter(
            (id) => id !== parentId && !childrenIds.includes(id)
          );
        } else {
          return [...prev, parentId];
        }
      });
    },
    [childrenByParent, setSelectedCategories]
  );

  const toggleChild = useCallback(
    (parentId: number, childId: number) => {
      if (!setSelectedCategories) return;

      setSelectedCategories((prev) => {
        const hasChild = prev.includes(childId);
        if (hasChild) {
          return prev.filter((id) => id !== childId);
        }
        if (!prev.includes(parentId)) {
          return [...prev, parentId, childId];
        }
        return [...prev, childId];
      });
    },
    [setSelectedCategories]
  );

  const handleFilterRef = useRef(handleFilter);

  useEffect(() => {
    handleFilterRef.current = handleFilter;
  }, [handleFilter]);

  const activitiesKey = selectedActivities.join(",");
  const categoriesKey = selectedCategories.join(",");

  useEffect(() => {
    if (!autoFilter) return;
    const id = setTimeout(() => {
      handleFilterRef.current();
    }, 150);
    return () => clearTimeout(id);
  }, [
    activitiesKey,
    categoriesKey,
    selectedStartingDate,
    selectedEndingDate,
    autoFilter,
  ]);

  return (
    <>
      <DateRangeSelector
        selectedStartingDate={selectedStartingDate}
        selectedEndingDate={selectedEndingDate}
        setSelectedEndingDate={setSelectedEndingDate}
        setSelectedStartingDate={setSelectedStartingDate}
      />

      {activities.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-semibold">Activités :</h2>
          {activities.map((activity) => {
            const idNum = Number(activity.id);
            return (
              <Label
                key={activity.id}
                htmlFor={`activity-${activity.id}`}
                className="flex items-center gap-2"
              >
                <Checkbox
                  id={`activity-${activity.id}`}
                  checked={selectedActivities.includes(idNum)}
                  onCheckedChange={(next) => {
                    toggleActivity(idNum);
                  }}
                />
                {activity.name}
              </Label>
            );
          })}
        </div>
      )}

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
                  onCheckedChange={(next) => {
                    toggleParent(pid);
                  }}
                />
                {parent.name}
              </Label>

              {parentChecked && children.length > 0 && (
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
                          onCheckedChange={(next) => {
                            toggleChild(pid, cid);
                          }}
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

      {!autoFilter && (
        <div className="flex justify-center pt-2">
          <Button onClick={handleFilter}>Filtrer</Button>
        </div>
      )}
    </>
  );
};

export default FilterList;
