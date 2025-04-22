import { useEffect, useState } from "react";
import { apiPath } from "../public.config.json";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../ProfileContext";

function Auth() {
    const navigate = useNavigate();
    const { fetchProfile } = useProfile();

    const [auth, setAuth] = useState({
        authenticated: false,
        error: null
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        const signout = urlParams.get("signout");
        const platform = urlParams.get("platform");

        if (signout) {
            // Send the code and state to the server
            fetch(apiPath + "/api/v1/auth/discord", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    auth: localStorage.getItem("auth"),
                    token: localStorage.getItem("token")
                })
            })
                .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            setAuth({
                                authenticated: false,
                                error: data.error
                            });
                            fetchProfile();
                            return;
                        }
    
                        localStorage.removeItem("auth");
                        localStorage.removeItem("token");
                        setAuth({
                            authenticated: false,
                            error: null
                        });
                        fetchProfile();
                        navigate("/");
                    });
            return;
        }
        
        if (!auth.error && !auth.authenticated && ((!localStorage.getItem("auth") && !localStorage.getItem("token")) || (code && state))) {
            var url = "";
            switch (platform) {
                case "gumroad":
                    url = "/api/v1/auth/gumroad";
                    break;
                case "discord":
                default:
                    url = "/api/v1/auth/discord";
                break;
            }

            // Send the code and state to the server
            fetch(apiPath + url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: code,
                    state: state
                })
            })
                .then((response) => response.json())
                    .then((data) => {
                        if (data.error) {
                            setAuth({
                                authenticated: false,
                                error: data.error
                            });
                            fetchProfile();
                            return;
                        }

                        // Save the token to the local storage
                        localStorage.setItem("auth", data.auth);
                        localStorage.setItem("token", data.token);
                        // Redirect to the library
                        setAuth({
                            authenticated: true,
                            error: null
                        });
                        fetchProfile();
                        navigate("/");
                    });
            return;
        }

        // Fetch profile data once
        fetch(apiPath + "/api/v1/profile/discord", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                auth: localStorage.getItem("auth"),
                token: localStorage.getItem("token"),
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error(data.error);
                    return;
                } else {
                    if ((data.profile as any).userId !== null) {
                        const auth = localStorage.getItem("auth");
                        const token = localStorage.getItem("token");
                
                        if (!auth || !token) {
                            console.error("No auth or token found");
                            return;
                        } else {
                            if (data.profile) {
                                switch (platform) {
                                    case "gumroad":
                                        if ((data.profile as any).gumroad_id !== null) {
                                            console.log("Already connected to Gumroad");
                                            navigate("/");
                                        }
                                        else {
                                            fetch(apiPath + "/api/v1/connect/gumroad", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({
                                                    auth: localStorage.getItem("auth"),
                                                    token: localStorage.getItem("token"),
                                                    code: code,
                                                    state: state
                                                })
                                            })
                                                .then((response) => response.json())
                                                    .then((data) => {
                                                        if (data.error) {
                                                            setAuth({
                                                                authenticated: false,
                                                                error: data.error
                                                            });
                                                            return;
                                                        }
                    
                                                        // Redirect to the library
                                                        setAuth({
                                                            authenticated: true,
                                                            error: null
                                                        });
                                                        fetchProfile();
                                                        navigate("/settings");
                                                    });
                                        }
                                        break;
                                    case "discord":
                                    default:
                                        if ((data.profile as any).discord_id !== null) {
                                            console.log("Already connected to Discord");
                                            navigate("/");
                                        }
                                        else {
                                            console.log("Not connected to Discord");
                                            fetch(apiPath + "/api/v1/connect/discord", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({
                                                    auth: localStorage.getItem("auth"),
                                                    token: localStorage.getItem("token"),
                                                    code: code,
                                                    state: state
                                                })
                                            })
                                                .then((response) => response.json())
                                                    .then((data) => {
                                                        if (data.error) {
                                                            setAuth({
                                                                authenticated: false,
                                                                error: data.error
                                                            });
                                                            fetchProfile();
                                                            return;
                                                        }
                    
                                                        // Redirect to the library
                                                        setAuth({
                                                            authenticated: true,
                                                            error: null
                                                        });
                                                        fetchProfile();
                                                        navigate("/settings");
                                                    });
                                        }
                                        break;
                                }
                            }
                        }
                    }
                    else {
                        navigate("/");
                    }
                }
            })
            .catch(() => {
                console.error("Failed to fetch profile");
                return;
            });
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
