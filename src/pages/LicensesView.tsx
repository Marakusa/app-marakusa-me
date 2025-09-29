import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../ProfileContext";
import { apiPath } from "../public.config.json";
import { gumroadProducts, lemonSqueezyProducts, jinxxyProducts } from "../public.config.json";
import { LicenseType } from '../ApiContext';
import Admin from "./Admin";

interface LicenseProfileData {
    id: string;
    discordId: string;
    username: string;
    avatar: string;
    email: string;
}
interface LicenseList {
    fetched: boolean;
    data: LicenseType[];
    error: string | null;
}

function LicensesView() {
    const navigate = useNavigate();
    const { isSignedIn, getSessionProfile } = useProfile();

    const [render, setRender] = useState(false);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [userLookingUp, setUserLookingUp] = useState(false);
    const [userLookUp, setUserLookUp] = useState<string | null>(null);
    const [profile, setProfile] = useState<LicenseProfileData | null>(null);
    const [profiles, setProfiles] = useState<LicenseProfileData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [licenseList, setLicenseList] = useState<LicenseList>();

    async function fetchProfiles(append: boolean = false) {
        if (loading || userLookingUp) {
            return;
        }

        try {
            setLoading(true);
            if (!append) {
                setProfiles([]);
            }
            const auth = localStorage.getItem("auth");
            const token = localStorage.getItem("token");

            const profilesRes = await fetch(apiPath + "/api/v1/admin/profiles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    auth: auth,
                    token: token,
                    offset: offset
                })
            });

            const profilesData = await profilesRes.json();
            if (!append) {
                setProfiles(profilesData.profiles);
            } else {
                setProfiles(prevProfiles => [...prevProfiles, ...profilesData.profiles]);
            }
            setLoading(false);
            setOffset(offset + 10);
        } catch (err: any) {
            if (!append) {
                setProfiles([]);
            }
            setLoading(false);
            setError("Failed to fetch profiles.");
        }
    }

    async function fetchUserProfile(discordId: string) {
        console.log("p");
        console.log(loading);
        console.log(userLookingUp);
        if (loading) {
            return;
        }

        try {
            setLoading(true);
            setProfile(null);
            const auth = localStorage.getItem("auth");
            const token = localStorage.getItem("token");

            const profilesRes = await fetch(apiPath + "/api/v1/admin/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    auth: auth,
                    token: token,
                    discordId: discordId
                })
            });

            const profileData = await profilesRes.json();
            setProfile(profileData.profile);
            setLicenseList({
                fetched: true,
                data: profileData.licenses ?? [],
                error: null
            });
            setLoading(false);
        } catch (err: any) {
            setProfile(null);
            setLoading(false);
            setError("Failed to fetch profile.");
        }
    }

    function lookUpUser() {
        if (userLookUp == "" || !userLookUp) {
            setUserLookingUp(false);
            return;
        }
        setUserLookingUp(true);
        fetchUserProfile(userLookUp);
    }

    function loadMore() {
        fetchProfiles(true);
    }

    useEffect(() => {
        isSignedIn().then((signedIn) => {
            if (!signedIn) {
                navigate("/signin");
                return;
            }
            // Only allow admin users
            if (getSessionProfile().data?.discord_id != "376425306975895573") {
                navigate("/");
                return;
            }
            setRender(true);
            fetchProfiles();
        });
    }, []);

    if (!render) {
        return <></>;
    }

    /* Convert past date to a readable format i.e. 10 minutes ago */
    function convertDateToReadable(dateTime: Date) {
        let now = new Date();
        let diff = Math.abs(now.getTime() - dateTime.getTime());
        let minutes = Math.floor(diff / (1000 * 60));
        let hours = Math.floor(diff / (1000 * 60 * 60));
        let days = Math.floor(diff / (1000 * 60 * 60 * 24));

        let lastActivityString = "";
        if (minutes < 1) {
            lastActivityString = `now`;
        }
        else if (minutes < 60) {
            lastActivityString = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        }
        else if (hours < 24) {
            lastActivityString = `${hours} hour${hours > 1 ? "s" : ""} ago`;
        }
        else {
            lastActivityString = `${days} day${days > 1 ? "s" : ""} ago`;
        }

        return lastActivityString;
    }

    return (
        <>
            <title>Dashboard - Licenses</title>
            <Admin />
            <div className="max-w-5xl mx-auto p-5 my-8">
                {error && (
                    <div className="bg-red-500 text-white rounded-2xl p-4 mb-4">
                        {error}
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    <div className="bg-zinc-900 text-white rounded-3xl shadow-lg shadow-black/20 p-6 space-y-8">
                        <div className="flex items-center space-x-4">
                            <label htmlFor="discord-id" className="font-semibold text-lg text-nowrap">Discord ID:</label>
                            <input
                                id="discord-id"
                                type="text"
                                value={userLookUp ?? ""}
                                onChange={(event) => setUserLookUp(event.target.value)}
                                className="bg-zinc-800 text-white rounded-xl p-2 w-full"
                            />
                            <div onClick={() => { lookUpUser(); }} className="flex flex-col gap-2 justify-center items-center bg-zinc-800 text-zinc-300 p-2 px-4 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors text-nowrap select-none">
                                <p>Look Up</p>
                            </div>
                        </div>
                    </div>

                    {userLookingUp && (
                        <>
                            <div className="bg-zinc-900 text-white rounded-3xl shadow-lg shadow-black/20 p-6 space-y-8">
                                <div className="flex flex-wrap gap-2 p-6">
                                    {loading && (<p>Loading...</p>)}
                                    {!loading && profile && (
                                        <>
                                            <div className="flex flex-row gap-12">
                                                <img src={profile.avatar + "?size=512"} alt="Avatar" className="w-48 h-48 rounded-full" />
                                                <div className="flex flex-col text-left gap-6 justify-center">
                                                    <p className="text-6xl font-bold">{profile.username}</p>
                                                    {profile.email && (<p className="text-xl">{profile.email}</p>)}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            {!loading && profile && (
                                <div className="bg-zinc-900 text-white rounded-3xl shadow-lg shadow-black/20 p-6 space-y-8">
                                    <div className="flex flex-wrap gap-2 p-6">
                                        <p className="text-4xl font-bold">Licenses</p>
                                        <table className="w-full">
                                            <thead>
                                                <tr>
                                                    <th className="p-2 px-4">Product</th>
                                                    <th className="p-2 px-4">License Key</th>
                                                    <th className="p-2 px-4">Redeemed</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {licenseList && licenseList.error ? (
                                                    <tr>
                                                        <td colSpan={3} className="p-2 px-4 text-red-400">{licenseList.error}</td>
                                                    </tr>
                                                ) : licenseList && licenseList.fetched ? (
                                                    licenseList.data && licenseList.data.length > 0 ? (
                                                        licenseList.data.map((license: LicenseType) => (
                                                            <tr key={license.license_key}>
                                                                <td className="p-2 px-4">
                                                                    {license.product_id.split(',').map((id) => (
                                                                        gumroadProducts[id as keyof typeof gumroadProducts] ??
                                                                        lemonSqueezyProducts[id as keyof typeof lemonSqueezyProducts] ??
                                                                        jinxxyProducts[id as keyof typeof jinxxyProducts]
                                                                    )).join(', ')}
                                                                </td>
                                                                <td className="sm:hidden p-2 px-4">{license.license_key}</td>
                                                                <td className="hidden sm:block p-2 px-4">{license.license_key}</td>
                                                                <td className="p-2 px-4">{convertDateToReadable(new Date(license.createdAt))}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={3} className="p-2 px-4 text-zinc-400 italic">No licenses found...</td>
                                                        </tr>
                                                    )
                                                ) : (
                                                    /* Skeleton loader */
                                                    Array.from({ length: 4 }).map((_, index) => (
                                                        <tr key={index} className="animate-pulse">
                                                            <td className="p-2 px-4">
                                                                <div className="h-5 bg-zinc-700 rounded w-3/4"></div>
                                                            </td>
                                                            <td className="p-2 px-4">
                                                                <div className="h-5 bg-zinc-700 rounded w-3/4"></div>
                                                            </td>
                                                            <td className="p-2 px-4">
                                                                <div className="h-5 bg-zinc-700 rounded w-1/2"></div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <div className="bg-zinc-900 text-white rounded-3xl shadow-lg shadow-black/20 p-6 space-y-8">
                        <div className="flex flex-wrap gap-2">
                            {profiles.map((profile) => (
                                <div key={profile.id} id="profile-button" onClick={() => {
                                    setUserLookUp(profile.discordId);
                                    lookUpUser();
                                }} className="flex items-center cursor-pointer select-none p-2 rounded-3xl hover:bg-zinc-950/50 border border-transparent hover:border-zinc-900">
                                    <p className="text-white mx-3 hidden lg:block">{profile.discordId}</p>
                                </div>
                            ))}
                            {loading ? (<p>Loading...</p>) : (
                                <div id="profile-button" onClick={loadMore} className="flex items-center cursor-pointer select-none p-2 rounded-3xl bg-blue-900 hover:bg-zinc-950/50 border border-transparent hover:border-zinc-900">
                                    <p className="text-white mx-3 hidden lg:block">Load More</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LicensesView;
