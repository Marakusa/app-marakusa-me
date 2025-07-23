import { useEffect, useState } from "react";
import { gumroadProducts, lemonSqueezyProducts, jinxxyProducts } from "../public.config.json";
import { IoMdAddCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../ProfileContext";
import { LicensesType, LicenseType, useApi } from '../ApiContext';

function Licenses() {
    interface RedeemedState {
        redeemed: boolean;
        redeeming: boolean;
        error: string | null;
    };
    interface LicenseList {
        fetched: boolean;
        data: LicenseType[];
        error: string | null;
    }
    interface Stores {
        [key: string]: { [key: string]: string };
    }

    const stores: Stores = {
        gumroad: gumroadProducts,
        lemonsqueezy: lemonSqueezyProducts,
        jinxxy: jinxxyProducts
    };

    const navigate = useNavigate();
    const { api } = useApi();
    const { isSignedIn } = useProfile();

    const [newRedeem, setNewRedeem] = useState(false);
    const [marketPlatform, setPlatform] = useState<keyof typeof stores>("gumroad");

    const [licenseList, setLicenseList] = useState<LicenseList>();
    const [redeemed, setRedeemed] = useState<RedeemedState>({
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

    /* If not signed in, go to sign in page */
    useEffect(() => {
        console.log("test");
        isSignedIn().then((signedIn) => {
            console.log(signedIn);
            if (!signedIn) {
                console.log("Not signed in, redirecting to sign in page...");
                navigate("/signin");
                return;
            }

            /* Fetch licenses */
            if (!licenseList || (!licenseList.error && !licenseList.fetched)) {
                fetchLicenses();
            }
        });
    }, []);

    async function redeemLicense() {
        if (redeemed.redeeming) return;

        setRedeemed({
            redeemed: false,
            redeeming: true,
            error: null
        });

        try {
            const response = await api.redeemLicense(
                (document.getElementById("market_platform") as HTMLSelectElement)!.value,
                (document.getElementById("product_id") as HTMLSelectElement)!.value,
                (document.getElementById("license_key") as HTMLInputElement)!.value,
                localStorage.getItem("auth"),
                localStorage.getItem("token"));

            if (response.error) {
                setRedeemed({
                    redeemed: false,
                    redeeming: false,
                    error: response.error
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
        } catch (error) {
            setRedeemed({
                redeemed: false,
                redeeming: false,
                error: "An unexpected error occurred."
            });
        }
    }

    function fetchLicenses() {
        api.listLicenses(
            localStorage.getItem("auth"),
            localStorage.getItem("token")
        )
            .then((response) => {
                if (response.error) {
                    setLicenseList({
                        fetched: true,
                        data: [],
                        error: response.error
                    });
                    return;
                }

                setLicenseList({
                    fetched: true,
                    data: (response.data as LicensesType).licenses ?? [],
                    error: null
                });
            });
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

    /* Cut license keys length to fit for mobile screens */
    function compressLicenseKey(licenseKey: string) {
        if (licenseKey.length > 10) {
            return "..." + licenseKey.substring(licenseKey.length - 4);
        }
        return licenseKey;
    }

    return (
        <>
            <title>Dashboard - Licenses</title>

            <div className="max-w-3xl mx-auto p-5 my-27">

                { /* Header */}
                <div className="flex justify-between select-none">
                    <div className="text-left px-0 py-2 text-4xl">Your licenses</div>
                    <div onClick={() => setNewRedeem(!newRedeem)} className="text-right px-0 py-4 text-3xl cursor-pointer">{
                        newRedeem ? <IoMdCloseCircleOutline /> : <IoMdAddCircleOutline />
                    }</div>
                </div>

                { /* Redeem panel */}
                {newRedeem ? (
                    <div className="bg-zinc-900 text-white w-full rounded-3xl shadow-lg shadow-black/20 mb-5">
                        <div className="flex flex-col p-4 gap-3">

                            <p className="text-left px-2">Redeem a purchased product below. <span onClick={() => navigate("/tutorial/redeem")} className="text-blue-400 hover:underline font-bold cursor-pointer">How do I redeem my purchase?</span></p>

                            <div className="flex flex-row gap-3">
                                {/* Marketplaces */}
                                <select id="market_platform" onChange={(event) => setPlatform(event.target.value)} className="p-2 px-4 w-full rounded-full bg-zinc-950">
                                    <option value="gumroad">Gumroad</option>
                                    <option value="lemonsqueezy">Lemon Squeezy</option>
                                    <option value="jinxxy">Jinxxy</option>
                                </select>

                                {/* Products */}
                                <select id="product_id" className="p-2 px-4 w-full rounded-full bg-zinc-950">
                                    {Object.entries(stores[marketPlatform] || {}).map(([id, name]) => (
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                </select>
                            </div>

                            <input id="license_key" type="text" placeholder="License Key" className="p-2 px-4 w-full rounded-full bg-zinc-950" />
                            <div onClick={() => { redeemLicense(); }} className="flex flex-col gap-2 justify-center items-center bg-zinc-800 text-zinc-300 p-2 px-4 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors w-full select-none">
                                {redeemed.redeeming ? (
                                    <div className="animate-spin rounded-full border-2 border-white border-t-transparent w-6 h-6"></div>
                                ) : (
                                    <p>Redeem</p>
                                )}
                            </div>
                            {redeemed.error ? (
                                <p className="text-red-400">{redeemed.error}</p>
                            ) : redeemed.redeemed ? (
                                <>
                                    <p className="text-zinc-400">License redeemed successfully!</p>
                                    <p className="text-green-400">To get the Discord roles run the <strong>/sync</strong> command anywhere on the <a href="https://discord.com/invite/47SrTE3Spw" target="_blank" className="text-blue-400">Mara's Frosty Lodge</a> server.</p>
                                </>
                            ) : (<></>)}
                        </div>
                    </div>
                ) : (<></>)}

                { /* Licenses list */}
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
                                            <td className="sm:hidden p-2 px-4">{compressLicenseKey(license.license_key)}</td>
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

                    { /* Redeem button */}
                    <div onClick={() => setNewRedeem(true)} className="w-auto text-3xl border-2 border-dashed border-zinc-300 text-zinc-300 rounded-3xl p-2 m-2 flex justify-center items-center cursor-pointer hover:bg-zinc-900 hover:border-blue-300 hover:text-blue-300 hover:transform hover:-translate-y-0.5 transition active:translate-y-0.5 active:bg-zinc-900/50 active:border-blue-500">
                        <IoMdAddCircleOutline /> <span className="text-lg px-3 py-1">Redeem a License</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Licenses;
