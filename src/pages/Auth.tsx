import { useEffect, useState } from "react";
import { AuthDiscordType, useApi } from '../ApiContext';
import { useNavigate } from "react-router-dom";
import { useProfile } from "../ProfileContext";

function Auth() {
    const navigate = useNavigate();
    const { api } = useApi();
    const { signOut } = useProfile();

    const [auth, setAuth] = useState<{
        authenticated: boolean;
        error: string | null;
    }>({
        authenticated: false,
        error: null
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        const signout = urlParams.get("signout");

        if (signout) {
            signOut();
            navigate("/");
            return;
        }

        if (!auth.error && !auth.authenticated && ((!localStorage.getItem("auth") && !localStorage.getItem("token")) || (code && state))) {
            api.authenticateDiscord(code, state)
                .then((data) => {
                    if (data.error) {
                        setAuth({
                            authenticated: false,
                            error: data.error
                        });
                        return;
                    }

                    // Save the token to the local storage
                    localStorage.setItem("auth", (data.data as AuthDiscordType).auth ?? "");
                    localStorage.setItem("token", (data.data as AuthDiscordType).token ?? "");
                    
                    // Redirect to the library
                    setAuth({
                        authenticated: true,
                        error: null
                    });
                    navigate("/");
                });
            return;
        }

        navigate("/");
    }, []);

    return (
        <>
            <title>Naali - Please wait...</title>
            {auth.error ? (
                <div>
                    <p className="text-red-400">Authentication failed. Please try again...</p>
                    <p className="text-red-400">{auth.error}</p>
                </div>
            ) : (
                <p>Please wait...</p>
            )}
        </>
    );
}

export default Auth;
