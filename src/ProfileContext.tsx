import React, { createContext, useContext, useState, useEffect } from "react";
import { apiPath } from "./public.config.json";

// Create a Profile context
const ProfileContext = createContext({
    profile: { fetched: false, data: null },
    fetchProfile: () => {},  // Function to manually fetch the profile
});

export const useProfile = () => {
    return useContext(ProfileContext);
};

// ProfileContext provider to manage profile state and fetching
export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const [profile, setProfile] = useState({ fetched: false, data: null });
    
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
            // Fetch profile data once
            fetch(apiPath + "/api/v1/profile/discord", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    auth,
                    token,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        if (data.error === "Invalid session") {
                            localStorage.removeItem("auth");
                            localStorage.removeItem("token");
                        }

                        setProfile({
                            fetched: true,
                            data: null,
                        });
                    } else {
                        setProfile({
                            fetched: true,
                            data: data.profile,
                        });
                    }
                })
                .catch(() => {
                    setProfile({
                        fetched: true,
                        data: null,
                    });
                });
        }
    };

    // Fetch profile once at the start if there’s an auth token
    useEffect(() => {
        const auth = localStorage.getItem("auth");
        const token = localStorage.getItem("token");

        if (auth && token && !profile.fetched) {
            fetchProfile();
        }
    }, [profile.fetched]); // Run effect only once, when profile hasn't been fetched yet

    return (
        <ProfileContext.Provider value={{ profile, fetchProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};
