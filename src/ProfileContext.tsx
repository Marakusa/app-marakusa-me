import React, { createContext, useContext, useEffect } from "react";
import { useSession } from "./SessionContext";
import { ProfileType, SessionProfileType, useApi } from "./ApiContext";

// Create a Profile context
const ProfileContext = createContext({
    getSessionProfile: () => ({ fetched: false, data: null } as SessionProfileType),
    fetchProfile: () => { },
    isSignedIn: async () => ({} as boolean),
    signOut: () => { },
});

export const useProfile = () => {
    return useContext(ProfileContext);
};

// ProfileContext provider to manage profile fetching
export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const { api } = useApi();
    const { sessionCheck, clearSession, profile, setProfile } = useSession();

    // Function to manually fetch the profile
    const fetchProfile = () => {
        const auth = localStorage.getItem("auth");
        const token = localStorage.getItem("token");

        if (!auth || !token) {
            setProfile({
                fetched: true,
                data: null,
            });
        } else {
            // Fetch profile data
            api.profileDiscord(auth, token)
                .then((response) => {
                    if (response.error) {
                        if (response.error === "Invalid session") {
                            clearSession();
                        }

                        setProfile({
                            fetched: true,
                            data: null,
                        });
                    } else {
                        if (response.data) {
                            setProfile({
                                fetched: true,
                                data: (response.data as ProfileType),
                            });
                        }
                        else {
                            setProfile({
                                fetched: true,
                                data: null,
                            });
                        }
                    }
                })
                .catch(() => {
                    setProfile({
                        fetched: true,
                        data: null,
                    });
                }
                );
        }
    };

    // Function to manually fetch the profile
    async function fetchProfileAsync() {
        const auth = localStorage.getItem("auth");
        const token = localStorage.getItem("token");

        if (!auth || !token) {
            const profileData = {
                fetched: true,
                data: null,
            };
            setProfile(profileData);
            return profileData;
        } else {
            // Fetch profile data
            try {
                const response = await api.profileDiscord(auth, token);
                if (response.error) {
                    if (response.error === "Invalid session") {
                        clearSession();
                    }

                    const profileData = {
                        fetched: true,
                        data: null,
                    };
                    setProfile(profileData);
                    return profileData;
                } else {
                    if (response.data) {
                        const profileData = {
                            fetched: true,
                            data: response.data as ProfileType,
                        };
                        setProfile(profileData);
                        return profileData;
                    } else {
                        const profileData = {
                            fetched: true,
                            data: null,
                        };
                        setProfile(profileData);
                        return profileData;
                    }
                }
            } catch {
                const profileData = {
                    fetched: true,
                    data: null,
                };
                setProfile(profileData);
                return profileData;
            }
        }
    }

    const getSessionProfile = () => {
        return profile;
    }

    const isSignedIn = async (): Promise<boolean> => {
        const auth = localStorage.getItem("auth");
        const token = localStorage.getItem("token");
        const profileData = await fetchProfileAsync();
        if (profileData.fetched && !profileData.data) {
            if (auth && token) {
                clearSession();
            }
            setProfile({
                fetched: false,
                data: null,
            });
            return false;
        }
        return true;
    }

    const signOut = () => {
        api.signOutSession(localStorage.getItem("auth"), localStorage.getItem("token"), null);
        clearSession();
        setProfile({
            fetched: false,
            data: null,
        });
    }

    // Fetch profile once at the start if there’s an auth token and session is valid
    useEffect(() => {
        if (sessionCheck && !profile.fetched) {
            fetchProfile();
        }
    }, [sessionCheck, profile.fetched]);

    return (
        <ProfileContext.Provider value={{ getSessionProfile, fetchProfile, isSignedIn, signOut }}>
            {children}
        </ProfileContext.Provider>
    );
};
