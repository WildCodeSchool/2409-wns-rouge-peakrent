import { Badge, BadgeVariantType } from "@/components/ui/badge";
import { RoleType } from "@/types/types";
/**
 * Returns the badge color corresponding to the role.
 *
 * @param {RoleType} role - The role
 * @returns {BadgeVariantType} The corresponding badge color
 */
export const getColorForRole = (role: RoleType): BadgeVariantType => {
  switch (role) {
    case RoleType.ADMIN:
      return "blue";
    case RoleType.USER:
      return "yellow";
    case RoleType.SUPER_ADMIN:
      return "orange";
    default:
      return "red";
  }
};

/**
 * Returns the available role options with their labels and associated badge components.
 *
 * @returns {Array<{value: string, label: JSX.Element}>} An array of objects containing the value and label for each role option.
 */

export const getRoleOptionsLabels = () => {
  const BadgeRole = ({ value, text }: { value: RoleType; text: string }) => {
    return (
      <Badge
        variant={getColorForRole(value)}
        className="text-md mx-auto flex w-fit rounded-lg px-1 capitalize"
      >
        {text}
      </Badge>
    );
  };

  return [
    {
      value: RoleType.ADMIN,
      label: <BadgeRole text="Admin" value={RoleType.ADMIN} />,
    },
    {
      value: RoleType.USER,
      label: <BadgeRole text="User" value={RoleType.USER} />,
    },
    {
      value: RoleType.SUPER_ADMIN,
      label: <BadgeRole text="Super Admin" value={RoleType.SUPER_ADMIN} />,
    },
  ];
};
