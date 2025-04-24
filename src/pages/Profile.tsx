import { useNavigate } from "react-router-dom";
import { useProfile } from "../ProfileContext";

function Profile() {
    const navigate = useNavigate();
    const { profile, fetchProfile } = useProfile();

    if (profile.fetched === false) {
        fetchProfile();
    }

    if (profile.fetched && !profile.data) {
        navigate("/signin");
        return;
    }

    return (
        <>
            <title>Naali - Profile</title>

            <div className="flex flex-col items-center justify-center h-screen">
                {profile.fetched && profile.data && (
                    <>
                        <h3 className="text-4xl font-bold mb-4">Hello, {(profile.data as any).username}!</h3>
                        {profile.fetched ? profile.data ? (
                            <>
                                <img src={
                                    (profile.data as any).avatar.startsWith("https://") ?
                                        (profile.data as any).avatar :
                                        `https://cdn.discordapp.com/avatars/${(profile.data as any).discord_id}/${(profile.data as any).avatar}.png`} alt="Avatar" className="w-32 h-32 rounded-full mb-4" />
                                <p className="text-lg">{(profile.data as any).username}</p>
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
