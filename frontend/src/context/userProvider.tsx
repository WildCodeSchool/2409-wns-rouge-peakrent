import { Profile, User } from "@/gql/graphql";
import { GET_MY_PROFILE } from "@/GraphQL/profiles";
import { WHOAMI } from "@/GraphQL/whoami";
import { gql, useQuery } from "@apollo/client";
import { createContext, ReactNode, useContext } from "react";

type UserContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: any;
};

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: whoamiData,
    loading: whoamiLoading,
    error: whoamiError,
  } = useQuery(gql(WHOAMI));

  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
  } = useQuery(gql(GET_MY_PROFILE), {
    skip: !whoamiData?.whoami?.id,
  });

  const value: UserContextType = {
    user: whoamiData?.whoami || null,
    profile: profileData?.getMyProfile || null,
    loading: whoamiLoading || profileLoading,
    error: whoamiError || profileError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
