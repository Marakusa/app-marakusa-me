import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../ProfileContext";

function Admin() {
    const navigate = useNavigate();
    const { isSignedIn, getSessionProfile } = useProfile();

    const [render, setRender] = useState(false);
    const [adminData, setAdminData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

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
        });
    }, []);

    if (!render) {
        return <></>;
    }

    return (
        <>
            <title>Dashboard - Admin</title>
            <div className="max-w-5xl mx-auto p-5 mt-27">
                <h2 className="text-4xl font-bold mb-6">Admin Dashboard</h2>
                {error && (
                    <div className="bg-red-500 text-white rounded-2xl p-4 mb-4">
                        {error}
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    <div className="bg-zinc-900 text-white rounded-3xl shadow-lg shadow-black/20 p-6 space-y-8">
                        <div className="flex flex-row gap-6 justify-center">
                            <div 
                                onClick={() => navigate("/admin/sales")}
                                className="bg-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center select-none cursor-pointer">
                                <span className="text-3xl font-bold">Sales Data</span>
                            </div>
                            <div 
                                onClick={() => navigate("/admin/licenses")}
                                className="bg-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center select-none cursor-pointer">
                                <span className="text-3xl font-bold">License Keys</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Admin;