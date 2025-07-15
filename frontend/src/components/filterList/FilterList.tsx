import React from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DateRangeSelector } from "../ui/dateRangeSelector";
import { Label } from "../ui/label";

interface CategoryFilterProps {
  activities?: any[];
  selectedActivities?: number[];
  setSelectedActivities?: React.Dispatch<React.SetStateAction<number[]>>;

  categories?: any[];
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
}

const FilterList = ({
  activities,
  selectedActivities,
  setSelectedActivities,
  categories,
  selectedCategories,
  setSelectedCategories,
  handleFilter,
  selectedStartingDate,
  setSelectedStartingDate,
  selectedEndingDate,
  setSelectedEndingDate,
}: CategoryFilterProps) => {
  const handleCategoriesCheckboxAction = (categoryId: any) => {
    if (!setSelectedCategories) return;

    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleActivitiesCheckboxAction = (activityId: any) => {
    if (!setSelectedActivities) return;

    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  return (
    <>
      <DateRangeSelector
        selectedStartingDate={selectedStartingDate}
        selectedEndingDate={selectedEndingDate}
        setSelectedEndingDate={setSelectedEndingDate}
        setSelectedStartingDate={setSelectedStartingDate}
      />
      {activities && (
        <div className="space-y-2">
          <h2>Activités :</h2>
          {activities?.map((activity) => (
            <Label
              key={activity.id}
              htmlFor={`activity-${activity.id}`}
              className="flex items-center gap-2"
            >
              <Checkbox
                id={`activity-${activity.id}`}
                checked={selectedActivities?.includes(Number(activity.id))}
                onCheckedChange={() =>
                  handleActivitiesCheckboxAction(Number(activity.id))
                }
              />
              {activity.name}
            </Label>
          ))}
        </div>
      )}
      {categories && (
        <div className="space-y-2">
          <h2>Categories :</h2>
          {categories?.map((category) => (
            <Label
              key={category.id}
              htmlFor={`category-${category.id}`}
              className="flex items-center gap-2"
            >
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories?.includes(Number(category.id))}
                onCheckedChange={() =>
                  handleCategoriesCheckboxAction(Number(category.id))
                }
              />
              {category.name}
            </Label>
          ))}
        </div>
      )}
      <div className="flex justify-center space-y-2">
        <Button onClick={handleFilter}>Filtrer</Button>
      </div>
    </>
  );
};

export default FilterList;
