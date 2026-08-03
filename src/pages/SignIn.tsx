import { discordClientId, discordRedirectUri } from "../public.config.json";
import { FaDiscord } from "react-icons/fa";
import { useProfile } from "../ProfileContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function SignIn() {
    const { isSignedIn } = useProfile();
    const navigate = useNavigate();

    const [render, setRender] = useState(false);

    // If profile is already fetched and contains data, navigate to library
    useEffect(() => {
        isSignedIn().then((signedIn) => {
            if (signedIn) {
                navigate("/");
                return;
            }

            setRender(true);
        });
    }, []);

    if (!render) {
        return (<></>);
    }

    return (
        <>
            <title>Dashboard - Sign In</title>

            <div className="flex flex-col gap-8 justify-center items-center w-10/12 max-w-150 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-lg shadow-black/20 p-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-3xl">Sign In</div>
                <p>If you want to access all of the files, you have to connect your Discord account to link your avatar licenses.</p>

                <div className="flex flex-col gap-2 justify-center items-center bg-blue-300/30 font-bold rounded-3xl shadow-lg shadow-black/20 border border-blue-300 p-4 text-left">
                    ℹ️ We do not collect any passwords or personal information other than your Discord user ID, username, and avatar picture. Your data is only used to verify your licenses and will not be shared with any third parties.
                </div>

                <p>Your licenses here are synced with <a href="https://discord.com/invite/47SrTE3Spw" target="_blank" className="text-blue-400">Mara's Frosty Lodge</a> Discord server.</p>
                <div className="flex flex-row gap-4">
                    <a
                        className="flex flex-row items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-full w-fit cursor-pointer border border-blue-500 hover:bg-blue-700 shadow-lg shadow-black/40"
                        href={`https://discord.com/oauth2/authorize?response_type=code&client_id=${discordClientId}&scope=identify&redirect_uri=${encodeURIComponent(discordRedirectUri)}`}>
                        <FaDiscord /> Continue with Discord
                    </a>
                </div>
            </div>
        </>
    );
}

export default SignIn;
