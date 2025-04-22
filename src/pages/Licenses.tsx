import { useEffect, useState } from "react";
import { apiPath, gumroadProducts, lemonSqueezyProducts, jinxxyProducts } from "../public.config.json";
import { IoMdAddCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../ProfileContext";

function Licenses() {
    const navigate = useNavigate();
    const { profile, fetchProfile } = useProfile();

    const [newRedeem, setNewRedeem] = useState(false);
    const [marketPlatform, setPlatform] = useState("gumroad");
    const [licenseList, setLicenseList] = useState({
        fetched: false,
        data: [],
        error: null
    });

    const [redeemed, setRedeemed] = useState({
        redeemed: false,
        redeeming: false,
        error: null
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("redeem") != undefined) {
            setNewRedeem(true);
        }
    }, []);

    function redeemLicense() {
        if (redeemed.redeeming) return;

        fetchProfile();
        
        setRedeemed({
            redeemed: false,
            redeeming: true,
            error: null
        });

        fetch(apiPath + "/api/v1/license/redeem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                market_platform: (document.getElementById("market_platform") as HTMLSelectElement)!.value,
                product_id: (document.getElementById("product_id") as HTMLSelectElement)!.value,
                license_key: (document.getElementById("license_key") as HTMLInputElement)!.value,
                auth: localStorage.getItem("auth"),
                token: localStorage.getItem("token")
            })
        })
            .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        setRedeemed({
                            redeemed: false,
                            redeeming: false,
                            error: data.error
                        });
                        return;
                    }
    
                    setRedeemed({
                        redeemed: true,
                        redeeming: false,
                        error: null
                    });
                    
                    (document.getElementById("license_key") as HTMLInputElement)!.value = "";

                    fetchLicenses();
                });
    }
    
    function fetchLicenses() {
        fetchProfile();

        fetch(apiPath + "/api/v1/license/list", {
            method: "POST",
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
                        setLicenseList({
                            fetched: true,
                            data: [],
                            error: data.error
                        });
                        return;
                    }

                    setLicenseList({
                        fetched: true,
                        data: data.licenses,
                        error: null
                    });
                });
    }
    
    if (!licenseList.error && !licenseList.fetched) {
        fetchLicenses();
    }

    if (profile.fetched && !profile.data) {
        navigate("/signin");
        return;
    }

    return (
        <>
            <title>Naali - Licenses</title>

            <div className="max-w-3xl mx-auto p-5 my-27">
                <div className="flex justify-between select-none">
                    <div className="text-left px-0 py-2 text-4xl">Your licenses</div>
                    <div onClick={() => setNewRedeem(!newRedeem)} className="text-right px-0 py-4 text-3xl cursor-pointer">{
                        newRedeem ? <IoMdCloseCircleOutline /> : <IoMdAddCircleOutline />
                    }</div>
                </div>
                
                {newRedeem ? (
                    <div className="bg-zinc-900 text-white w-full rounded-3xl shadow-lg shadow-black/20 mb-5">
                        <div className="flex flex-col p-4 gap-3">
                            <p className="text-left px-2">Redeem a purchased product below. <span onClick={() => navigate("/tutorial/redeem")} className="text-blue-400 hover:underline font-bold cursor-pointer">How do I redeem my purchase?</span></p>
                            <div className="flex flex-row gap-3">
                                <select id="market_platform" onChange={(event) => setPlatform(event.target.value)} className="p-2 px-4 w-full rounded-full bg-zinc-950">
                                    <option value="gumroad">Gumroad</option>
                                    <option value="lemonsqueezy">Lemon Squeezy</option>
                                    <option value="jinxxy">Jinxxy</option>
                                </select>
                                
                                {marketPlatform === "gumroad" ? (
                                    <select id="product_id" className="p-2 px-4 w-full rounded-full bg-zinc-950">
                                        {Object.entries(gumroadProducts).map(([id, name]) => (
                                            <option key={id} value={id}>{name}</option>
                                        ))}
                                    </select>
                                ) : marketPlatform === "lemonsqueezy" ? (
                                    <select id="product_id" className="p-2 px-4 w-full rounded-full bg-zinc-950">
                                        {Object.entries(lemonSqueezyProducts).map(([id, name]) => (
                                            <option key={id} value={id}>{name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <select id="product_id" className="p-2 px-4 w-full rounded-full bg-zinc-950">
                                        {Object.entries(jinxxyProducts).map(([id, name]) => (
                                            <option key={id} value={id}>{name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            
                            <input id="license_key" type="text" placeholder="License Key" className="p-2 px-4 w-full rounded-full bg-zinc-950" />
                            <div onClick={redeemLicense} className="flex flex-col gap-2 justify-center items-center bg-zinc-800 text-zinc-300 p-2 px-4 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors w-full select-none">
                                {redeemed.redeeming ? (
                                    <div className="animate-spin rounded-full border-2 border-black border-t-transparent w-6 h-6"></div>
                                ) : (
                                    <p>Redeem</p>
                                )}
                            </div>
                            {redeemed.error ? (
                                <p className="text-red-400">{redeemed.error}</p>
                            ) : redeemed.redeemed ? (
                                <>
                                    <p className="text-zinc-400">License redeemed successfully!</p>
                                    <p className="text-green-400">To get the roles run the <strong>/sync</strong> command anywhere on the <a href="https://discord.com/invite/47SrTE3Spw" target="_blank" className="text-blue-400">Mara's Frosty Lodge</a> server.</p>
                                </>
                            ) : (<></>)}
                        </div>
                    </div>
                ) : (<></>)}
                
                <div className="bg-zinc-900 text-white w-full rounded-3xl shadow-lg shadow-black/20 p-2">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="p-2 px-4">Product</th>
                                <th className="p-2 px-4">License Key</th>
                                <th className="p-2 px-4">Redeemed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {licenseList.error ? (
                                <tr>
                                    <td colSpan={3} className="p-2 px-4 text-red-400">{licenseList.error}</td>
                                </tr>
                            ) : licenseList.fetched ? (
                                licenseList.data && licenseList.data.length > 0 ? (
                                    licenseList.data.map((license: { license_id: string; product_id: string; license_key: string; redeemed: boolean; createdAt: any }) => (
                                        <tr key={license.license_key}>
                                            <td className="p-2 px-4">
                                                {license.product_id.split(',').map((id) => (
                                                    gumroadProducts[id as keyof typeof gumroadProducts] ?? 
                                                    lemonSqueezyProducts[id as keyof typeof lemonSqueezyProducts] ?? 
                                                    jinxxyProducts[id as keyof typeof jinxxyProducts]
                                                )).join(', ')}
                                            </td>
                                            <td className="p-2 px-4">{license.license_key}</td>
                                            <td className="p-2 px-4">{new Date(license.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="p-2 px-4 text-zinc-400 italic">No licenses found...</td>
                                    </tr>
                                )
                            ) : (
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
                    <div onClick={() => setNewRedeem(true)} className="w-auto text-3xl border-2 border-dashed border-zinc-300 text-zinc-300 rounded-3xl p-2 m-2 flex justify-center items-center cursor-pointer hover:bg-zinc-900 hover:border-blue-300 hover:text-blue-300 hover:transform hover:-translate-y-0.5 transition active:translate-y-0.5 active:bg-zinc-900/50 active:border-blue-500">
                            <IoMdAddCircleOutline /> <span className="text-lg px-3 py-1">Redeem a License</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Licenses;
