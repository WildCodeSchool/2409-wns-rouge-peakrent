import React from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

interface CategoryFilterProps {
  activities?: any[];
  selectedActivities?: number[];
  setSelectedActivities?: React.Dispatch<React.SetStateAction<number[]>>;

  categories?: any[];
  selectedCategories?: number[];
  setSelectedCategories?: React.Dispatch<React.SetStateAction<number[]>>;

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
