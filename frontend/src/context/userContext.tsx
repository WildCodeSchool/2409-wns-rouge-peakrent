import { createContext, useContext, ReactNode, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { WHOAMI } from "@/GraphQL/whoami";
import { GET_PROFILE_BY_USER_ID } from "@/GraphQL/profile";

type UserType = {
  id: number;
  email: string;
  role: string;
};

type ProfileType = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
};

type UserContextType = {
  user: UserType | null;
  profile: ProfileType | null;
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
  } = useQuery(WHOAMI);

  const [
    getProfileByUserId,
    { data: profileData, loading: profileLoading, error: profileError },
  ] = useLazyQuery(GET_PROFILE_BY_USER_ID);

  useEffect(() => {
    if (whoamiData?.whoami?.id) {
      getProfileByUserId({
        variables: { userId: Number(whoamiData.whoami.id) },
      });
    }
  }, [whoamiData, getProfileByUserId]);

  // console.log(whoamiData.whoami.id)

  const value: UserContextType = {
    user: whoamiData?.whoami || null,
    profile: profileData?.getProfileByUserId,
    loading: whoamiLoading || profileLoading,
    error: whoamiError || profileError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
