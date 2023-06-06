import { createContext, useContext, useMemo } from "react";
import { useCookie } from "../hooks/useCookie";
import useLocalStorage from "../hooks/useLocalStorage";
import React from "react";

type AuthProviderProps = {
  children: React.ReactNode;
};

type Profile = {
  username: string;
  avatar: string;
};

interface AppContextInterface {
  profile: Profile | null;
  isLogged: boolean;
  login: (token: any, profile: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AppContextInterface>({
  profile: {
    username: "...",
    avatar:
      "https://avatars.dicebear.com/api/jdenticon/formshet.svg?background=%230000ff",
  },
  isLogged: false,
  login: () => {},
  logout: () => {},
});
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userToken, setUserToken] = useCookie("db_token");
  const [localProfile, setLocalProfile] = useLocalStorage("db_profile", null);

  const [profile, setProfile] = React.useState<Profile | null>(null);

  React.useEffect(() => {
    if (localProfile) {
      setProfile({
        username: localProfile?.username,
        avatar: `https://api.dicebear.com/5.x/fun-emoji/svg?seed=${localProfile?.username}`,
      });
    }
  }, [localProfile]);

  const login = async (data: string, profile: any) => {
    setUserToken(data);
    setLocalProfile(profile);
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUserToken(null);
  };

  const value = useMemo(
    () => ({
      isLogged: !!userToken,
      profile,
      login,
      logout,
    }),
    [userToken, profile]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
