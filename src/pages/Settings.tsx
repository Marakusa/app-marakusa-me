import { apiPath, discordClientId, discordRedirectUri } from "../public.config.json";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { useProfile } from "../ProfileContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaDesktop, FaMobile, FaTablet, FaTv, FaQuestion } from "react-icons/fa";
import { GiConsoleController } from "react-icons/gi";
import { BiSolidWatchAlt } from "react-icons/bi";

function Settings() {
    const navigate = useNavigate();
    const { profile, fetchProfile } = useProfile();
    const [showConfirmDisconnect, setShowConfirmDisconnect] = useState<string | null>(null);
    const [sessions, setSessions] = useState<any[]>([]);

    if (profile.fetched === false) {
        fetchProfile();
    }

    function confirmDisconnect(platform: string) {
        setShowConfirmDisconnect(platform);
    }

    async function disconnectConnection(platform: string) {
        // Fetch disconnect API
        const response = await fetch(apiPath + `/api/v1/disconnect/${platform}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                auth: localStorage.getItem("auth"),
                token: localStorage.getItem("token")
            })
        });
        const data = await response.json();
        if (data.error) {
            console.error(data.error);
            return;
        }

        if ((profile as any).auth_method === platform) {
            window.location.href = "/auth?signout=1";
            localStorage.removeItem("auth");
            localStorage.removeItem("token");
        }

        fetchProfile();
    }

    async function connectConnection(platform: string) {
        switch (platform) {
            case "discord":
                window.location.href = `https://discord.com/oauth2/authorize?response_type=code&client_id=${discordClientId}&scope=email+identify&redirect_uri=${encodeURIComponent(discordRedirectUri)}`;
                break;
            default:
                console.error("Unknown platform");
                break;
        }
    }

    if (profile.fetched && !profile.data) {
        navigate("/signin");
        return;
    }

    useEffect(() => {
        if (sessions.length === 0) {
            fetch(apiPath + `/api/v1/sessions/list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    auth: localStorage.getItem("auth"),
                    token: localStorage.getItem("token")
                })
            }).then((response) => {
                response.json().then((data) => {
                    if (data.error) {
                        console.error(data.error);
                        return;
                    }
                    setSessions(data.sessions);
                });
            }).catch((error) => {
                console.error(error);
            });
        }
    }, []);

    function getDeviceType(session: string) {
        if (!session) return <FaQuestion className="inline w-8 h-8" />;

        if (session.includes("Windows")) {
            return <FaDesktop className="inline w-8 h-8" />;
        }
        else if (session.includes("Linux")) {
            return <FaDesktop className="inline w-8 h-8" />;
        }
        else if (session.includes("Mac")) {
            return <FaDesktop className="inline w-8 h-8" />;
        }
        else if (session.includes("Mobile")) {
            return <FaMobile className="inline w-8 h-8" />;
        }
        else if (session.includes("Tablet")) {
            return <FaTablet className="inline w-8 h-8" />;
        }
        else if (session.includes("Desktop")) {
            return <FaDesktop className="inline w-8 h-8" />;
        }
        else if (session.includes("TV")) {
            return <FaTv className="inline w-8 h-8" />;
        }
        else if (session.includes("Console")) {
            return <GiConsoleController className="inline w-8 h-8" />;
        }
        else if (session.includes("Wearable")) {
            return <BiSolidWatchAlt className="inline w-8 h-8" />;
        }
        else if (session.includes("Other")) {
            return <FaQuestion className="inline w-8 h-8" />;
        }
        else if (session.includes("Unknown")) {
            return <FaQuestion className="inline w-8 h-8" />;
        }
        return <FaQuestion className="inline w-8 h-8" />;
    }

    function parseSession(session: string) {
        if (!session) return "Unknown";

        let os = "Unknown";

        if (session.includes("Windows")) {
            os = "Windows";
        }
        else if (session.includes("Linux")) {
            os = "Linux";
        }
        else if (session.includes("Mac")) {
            os = "Mac";
        }
        else if (session.includes("iOS")) {
            os = "iOS";
        }
        else if (session.includes("Android")) {
            os = "Android";
        }

        let browser = "Unknown";

        if (session.includes("Chrome")) {
            browser = "Chrome";
        }
        else if (session.includes("Firefox")) {
            browser = "Firefox";
        }
        else if (session.includes("Safari")) {
            browser = "Safari";
        }
        else if (session.includes("Edge")) {
            browser = "Edge";
        }
        else if (session.includes("Opera")) {
            browser = "Opera";
        }
        else if (session.includes("Brave")) {
            browser = "Brave";
        }
        else if (session.includes("Other")) {
            browser = "Other";
        }
        else if (session.includes("Unknown")) {
            browser = "Unknown";
        }

        return `${os} • ${browser}`;
    }

    function signOutSession(sessionId: string) {
        fetch(apiPath + `/api/v1/sessions/signout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                auth: localStorage.getItem("auth"),
                token: localStorage.getItem("token"),
                session_id: sessionId
            })
        }).then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    console.error(data.error);
                    return;
                }

                setSessions((prevSessions) => {
                    return prevSessions.filter((session) => session.id !== sessionId);
                });
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    return (
        <>
            <title>Naali - Settings</title>

            {showConfirmDisconnect ? (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => { setShowConfirmDisconnect(null) }}>
                    <div className="absolute flex flex-col gap-8 justify-center items-center w-full mx-8 md:w-150 md:mx-auto bg-zinc-900 rounded-3xl shadow-lg shadow-black/20 p-8 select-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <p className="text-3xl font-bold">Are you sure you want to disconnect?</p>
                        <p className="text-lg">You will be logged out if you are currently signed in with this platform.</p>
                        <p className="text-lg text-red-400">ALL YOUR LICENSES AND DATA WILL BE UNLINKED IF THIS IS THE LAST CONNECTION.</p>
                        <div className="flex flex-row gap-3 mt-4">
                            <div className="text-sm bg-zinc-800 text-zinc-200 p-2 px-4 rounded-xl border border-zinc-700 shadow-lg shadow-black/20 cursor-pointer hover:border-blue-300 transition-colors"
                                onClick={() => { setShowConfirmDisconnect(null) }}>Cancel</div>
                            <div className="text-sm bg-red-600 text-zinc-200 p-2 px-4 rounded-xl border border-red-500 shadow-lg shadow-black/20 cursor-pointer hover:border-red-300 transition-colors"
                                onClick={() => { disconnectConnection(showConfirmDisconnect) }}>Disconnect</div>
                        </div>
                    </div>
                </div>
            ) : (<></>)}

            <div className="flex flex-col gap-8 my-32 justify-start items-start w-full mx-auto px-8 md:px-0">
                <div className="flex flex-col gap-8 justify-start items-start w-full md:w-150 md:mx-auto bg-zinc-900 rounded-3xl shadow-lg shadow-black/20 p-8 select-none">
                    <p className="text-3xl font-bold">Settings</p>
                    <p className="text-lg">Change your profile settings here.</p>
                </div>

                <div className="flex flex-col gap-8 justify-start items-start w-full md:w-150 md:mx-auto bg-zinc-900 rounded-3xl shadow-lg shadow-black/20 p-8 select-none">
                    <p className="text-3xl font-bold">Connected accounts</p>
                    <p className="text-lg text-left">See what accounts you have connected to your profile.<br />To remove <strong>ALL</strong> your data, <i>disconnect all</i> connections from here.</p>
                    <div className="flex flex-col gap-2 mx-auto sm:mx-0">
                        <div className="flex flex-row gap-2 items-center">
                            <div className="flex flex-col sm:flex-row gap-2 items-center w-fit">
                                <img src="/discord.svg" alt="Discord" className="w-8 h-8" draggable="false" />
                                <p className="text-lg ml-1">Discord</p>
                            </div>
                            {profile?.data ? (profile as any).data.discord_id ? (
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 items-center ml-2 text-green-400">
                                    <div className="flex flex-row gap-1 items-center">
                                        <CiCircleCheck className="inline w-5 h-5" />
                                        <p className="text-sm">Connected</p>
                                    </div>
                                    <div className="text-sm bg-zinc-800 text-zinc-300 px-4 py-2 ml-3 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors"
                                        onClick={() => { confirmDisconnect("discord") }}>Disconnect</div>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-1 items-center ml-2 text-red-400">
                                    <div className="flex flex-row gap-1 items-center">
                                        <CiCircleRemove className="inline w-5 h-5" />
                                        <p className="text-sm">Not Connected</p>
                                    </div>
                                    <div className="text-sm bg-zinc-800 text-zinc-300 px-4 py-2 ml-3 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors"
                                        onClick={() => { connectConnection("discord") }}>Connect</div>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-1 items-center ml-2 text-zinc-400">
                                    <p className="text-sm">...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-8 justify-start items-start w-full md:w-150 md:mx-auto bg-zinc-900 rounded-3xl shadow-lg shadow-black/20 p-8 select-none">
                    <p className="text-3xl font-bold">Sessions</p>
                    <p className="text-lg text-left">Check what devices are signed in to your account.</p>
                    <div className="flex flex-col gap-2 w-full">
                        {sessions.length > 0 ? sessions.map((session, index) => {
                            return (
                                <div key={index} className={(session.current_session ? "text-green-400 " : "") + "flex flex-row gap-4 items-center justify-between bg-zinc-950/25 border border-zinc-800 rounded-3xl shadow-lg shadow-black/20 p-3 px-4 select-none"}>
                                    <div className="hidden sm:block">{getDeviceType(session.session_info)}</div>
                                    <div className="flex-1 flex-col text-left px-2">
                                        <p className="text-sm font-bold uppercase">{parseSession(session.session_info)}</p>
                                        <p className={(session.current_session ? "text-zinc-400" : "text-zinc-400") + " text-sm"}>{session.location ?? "Unknown"} • {session.last_activity}</p>
                                    </div>
                                    {session.current_session ? (
                                        <p className="text-sm">Current session</p>
                                    ) : (<div className="text-sm bg-zinc-800 text-zinc-300 px-4 py-2 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors"
                                        onClick={() => { signOutSession(session.id) }}>Sign Out</div>)}
                                </div>
                            );
                        }) : (
                            <p className="text-sm text-zinc-400">No sessions found.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Settings;
