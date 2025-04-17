import { Badge, BadgeVariantType } from "@/components/ui/badge";
import { RoleType } from "@/types/types";
import { ShieldCheck, ShieldUser, User } from "lucide-react";
/**
 * Returns the badge color corresponding to the role.
 *
 * @param {RoleType} role - The role
 * @returns {BadgeVariantType} The corresponding badge color
 */
export const getColorForRole = (role: RoleType): BadgeVariantType => {
  switch (role) {
    case RoleType.admin:
      return "yellow";
    case RoleType.user:
      return "green";
    case RoleType.superadmin:
      return "red";
    default:
      return "black";
  }
};

/**
 * Returns the available role options with their labels and associated badge components.
 *
 * @returns {Array<{value: string, label: JSX.Element}>} An array of objects containing the value and label for each role option.
 */

export const getRoleOptionsLabels = () => {
  const BadgeRole = ({
    value,
    text,
    Icon,
  }: {
    value: RoleType;
    text: string;
    Icon: React.ElementType;
  }) => {
    return (
      <Badge
        variant={getColorForRole(value)}
        className="text-md flex gap-2 rounded-lg px-1 capitalize"
      >
        {Icon && <Icon className="size-4" />}
        {text}
      </Badge>
    );
  };

  return [
    {
      value: RoleType.user,
      label: RoleType.user,
      renderLabel: () => (
        <BadgeRole text="User" value={RoleType.user} Icon={User} />
      ),
    },
    {
      value: RoleType.admin,
      label: RoleType.admin,
      renderLabel: () => (
        <BadgeRole text="Admin" value={RoleType.admin} Icon={ShieldUser} />
      ),
    },
    {
      value: RoleType.superadmin,
      label: RoleType.superadmin,
      renderLabel: () => (
        <BadgeRole
          text="Super Admin"
          value={RoleType.superadmin}
          Icon={ShieldCheck}
        />
      ),
    },
  ];
};
