import { useNavigate } from "react-router-dom";
import { useProfile } from "../ProfileContext";
import { useEffect, useState } from "react";

function Profile() {
    const navigate = useNavigate();
    const { getSessionProfile, isSignedIn } = useProfile();

    const [ render, setRender ] = useState(false);

    useEffect(() => {
        isSignedIn().then((signedIn) => {
            if (!signedIn) {
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
            <title>Dashboard - Profile</title>

            <div className="flex flex-col items-center justify-center h-screen">
                {getSessionProfile().fetched && getSessionProfile().data && (
                    <>
                        <h3 className="text-4xl font-bold mb-4">Hello, {getSessionProfile().data?.username}!</h3>
                        {getSessionProfile().fetched ? getSessionProfile().data ? (
                            <>
                                <img src={
                                    getSessionProfile().data?.avatar.startsWith("https://") ?
                                        getSessionProfile().data?.avatar :
                                        `https://cdn.discordapp.com/avatars/${getSessionProfile().data?.discord_id}/${getSessionProfile().data?.avatar}.png`} alt="Avatar" className="w-32 h-32 rounded-full mb-4" />
                                <p className="text-lg">{getSessionProfile().data?.username}</p>
                            </>
                        ) : (
                            <p className="text-lg">No profile data available.</p>
                        ) : (
                            <p className="text-lg">Loading...</p>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default Profile;
