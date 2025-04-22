import { useEffect } from "react";
import { discordClientId, discordRedirectUri, gumroadClientId, gumroadRedirectUri } from "../public.config.json";
import { FaDiscord } from "react-icons/fa";
import { SiGumroad } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../ProfileContext";

function SignIn() {
    const navigate = useNavigate();
    const { profile } = useProfile();

    // If profile is already fetched and contains data, navigate to library
    useEffect(() => {
        console.log(profile);
        if (profile.fetched && profile.data) {
            navigate("/");
        }
    }, [profile.fetched, profile.data, navigate]);
    
    return (
        <>
            <title>Naali - Sign In</title>

            <div className="flex flex-col gap-8 justify-center items-center w-150 mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl shadow-lg shadow-black/20 p-8">
                <div className="text-3xl">Sign In</div>
                <p>If you want to access all of the files, you have to connect your Discord account to link your avatar licenses.</p>
                <div className="flex flex-row gap-4">
                    <a 
                        className="flex flex-row items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-full w-fit cursor-pointer border border-blue-500 hover:bg-blue-700 shadow-lg shadow-black/40"
                        href={`https://discord.com/oauth2/authorize?response_type=code&client_id=${discordClientId}&scope=email+identify&redirect_uri=${encodeURIComponent(discordRedirectUri)}`}>
                        <FaDiscord /> Continue with Discord
                    </a>
                    <a 
                        className="flex flex-row items-center gap-2 px-3 py-2 bg-pink-400 text-white rounded-full w-fit cursor-pointer border border-pink-300 hover:bg-pink-500 shadow-lg shadow-black/40"
                        href={`https://gumroad.com/oauth/authorize?client_id=${gumroadClientId}&response_type=code&scope=view_profile&redirect_uri=${encodeURIComponent(gumroadRedirectUri)}`}>
                        <SiGumroad /> Continue with Gumroad
                    </a>
                </div>
            </div>
        </>
    );
}

export default SignIn;
