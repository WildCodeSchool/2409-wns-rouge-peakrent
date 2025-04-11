import { Profile, User } from "@/gql/graphql";
import { GET_PROFILE_BY_USER_ID } from "@/GraphQL/profile";
import { WHOAMI } from "@/GraphQL/whoami";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { createContext, ReactNode, useContext, useEffect } from "react";

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

  const [
    getProfileByUserId,
    { data: profileData, loading: profileLoading, error: profileError },
  ] = useLazyQuery(gql(GET_PROFILE_BY_USER_ID));

  useEffect(() => {
    if (whoamiData?.whoami?.id) {
      getProfileByUserId({
        variables: { userId: Number(whoamiData.whoami.id) },
      });
    }
  }, [whoamiData, getProfileByUserId]);

  const value: UserContextType = {
    user: whoamiData?.whoami || null,
    profile: profileData?.getProfileByUserId,
    loading: whoamiLoading || profileLoading,
    error: whoamiError || profileError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
