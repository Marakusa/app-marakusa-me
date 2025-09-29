import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../ProfileContext";
import { apiPath } from "../public.config.json";
import Admin from "./Admin";

interface PlatformProduct {
    name: string;
    gumroad_filter: string;
    jinxxy_filter: string;
}

function SalesView() {
    const navigate = useNavigate();
    const { isSignedIn, getSessionProfile } = useProfile();

    const [render, setRender] = useState(false);
    const [adminData, setAdminData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const products: PlatformProduct[] = [
        { name: "Kajo", gumroad_filter: "cdm4XJ7yLTtRP26q8M9p5w==", jinxxy_filter: "Kajo - VRChat (PC + Quest)" },
        { name: "Naali", gumroad_filter: "no4NlOcmRPKu_m5jvOd5Bg==", jinxxy_filter: "Naali - VRChat (PC + Quest) -bundle -pack" },
    ];
    const [selectedProduct, setSelectedProduct] = useState<PlatformProduct>(products[0]);

    function handleProductChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const product = products.find(p => p.name === e.target.value);
        if (product) {
            setSelectedProduct(product);
        }
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
            fetchSales();
        });
    }, []);

    useEffect(() => {
        if (render) {
            fetchSales();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct]);

    async function fetchSales() {
        try {
            setAdminData(null);
            const auth = localStorage.getItem("auth");
            const token = localStorage.getItem("token");

            const jinxxyRes = await fetch(apiPath + "/api/v1/sales/jinxxy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    auth: auth,
                    token: token,
                    filter: selectedProduct.jinxxy_filter
                })
            });
            const gumroadRes = await fetch(apiPath + "/api/v1/sales/gumroad", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    auth: auth,
                    token: token,
                    filter: selectedProduct.gumroad_filter
                })
            });

            const jinxxyData = await jinxxyRes.json();
            const gumroadData = await gumroadRes.json();

            const combinedSales = [
                ...(jinxxyData.sales || []),
                ...(gumroadData.sales || [])
            ].sort((a: any, b: any) => {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateB - dateA;
            });

            setAdminData((prev: any) => ({
                ...prev,
                sales: combinedSales,
                salesCount: (jinxxyData.count || 0) + (gumroadData.count || 0)
            }));
        } catch (err: any) {
            setError("Failed to fetch sales data.");
        }
    }

    if (!render) {
        return <></>;
    }

    return (
        <>
            <title>Dashboard - Sales</title>
            <Admin />
            <div className="max-w-5xl mx-auto p-5">
                {error && (
                    <div className="bg-red-500 text-white rounded-2xl p-4 mb-4">
                        {error}
                    </div>
                )}
                <div className="flex flex-col gap-10">
                    <div className="bg-zinc-900 text-white rounded-3xl shadow-lg shadow-black/20 p-6 space-y-8">
                        <div className="flex items-center space-x-4">
                            <label htmlFor="product-select" className="font-semibold text-lg">Product:</label>
                            <select
                                id="product-select"
                                value={selectedProduct.name}
                                onChange={handleProductChange}
                                className="bg-zinc-800 text-white rounded-xl p-2 w-full"
                            >
                                {products.map((product) => (
                                    <option key={product.name} value={product.name}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="bg-zinc-900 text-white rounded-3xl shadow-lg shadow-black/20 p-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-zinc-800 rounded-2xl p-4 flex flex-col items-center">
                                <span className="text-lg font-semibold mb-2">Total Sales</span>
                                <span className="text-3xl font-bold">{adminData ? (adminData.salesCount ?? 0) : "..."}</span>
                            </div>
                            <div className="bg-zinc-800 rounded-2xl p-4 flex flex-col items-center">
                                <span className="text-lg font-semibold mb-2">Total Earnings</span>
                                <span className="text-3xl font-bold">
                                    {adminData ? (adminData.sales?.reduce((sum: number, sale: any) => sum + (sale.total || 0), 0).toLocaleString("en-US", { style: "currency", currency: "USD" })) : "..."}
                                </span>
                            </div>
                            <div className="bg-zinc-800 rounded-2xl p-4 flex flex-col items-center">
                                <span className="text-lg font-semibold mb-2">Earnings (7 days)</span>
                                <span className="text-3xl font-bold">
                                    {adminData ? (adminData.sales
                                        ?.filter((sale: any) => {
                                            const saleDate = sale.date ? new Date(sale.date) : null;
                                            if (!saleDate) return false;
                                            const sevenDaysAgo = new Date();
                                            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                                            return saleDate >= sevenDaysAgo;
                                        })
                                        .reduce((sum: number, sale: any) => sum + (sale.total || 0), 0)
                                        .toLocaleString("en-US", { style: "currency", currency: "USD" })) : "..."}
                                </span>
                            </div>
                            <div className="bg-zinc-800 rounded-2xl p-4 flex flex-col items-center">
                                <span className="text-lg font-semibold mb-2">Earnings (30 days)</span>
                                <span className="text-3xl font-bold">
                                    {adminData ? (adminData.sales
                                        ?.filter((sale: any) => {
                                            const saleDate = sale.date ? new Date(sale.date) : null;
                                            if (!saleDate) return false;
                                            const sevenDaysAgo = new Date();
                                            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);
                                            return saleDate >= sevenDaysAgo;
                                        })
                                        .reduce((sum: number, sale: any) => sum + (sale.total || 0), 0)
                                        .toLocaleString("en-US", { style: "currency", currency: "USD" })) : "..."}
                                </span>
                            </div>
                        </div>
                        <div>
                            {adminData ? (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-2xl font-semibold mb-4 text-left pb-0 flex items-baseline">Recent Sales</p>
                                        <button className="bg-zinc-800 hover:bg-zinc-700 rounded-2xl p-2 px-4" onClick={
                                        () => {
                                            fetchSales();
                                        }}>Refresh</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-zinc-900 rounded-xl">
                                            <thead className="border-b-2 border-zinc-700">
                                                <tr>
                                                    <th className="px-4 py-2 text-left">Date</th>
                                                    <th className="px-4 py-2 text-left">Customer</th>
                                                    <th className="px-4 py-2 text-left">Total</th>
                                                    <th className="px-4 py-2 text-left">Platform</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {adminData.sales?.length > 0 ? adminData.sales.map((sale: any, idx: number) => (
                                                    <tr key={idx} className="border-b border-zinc-800 text-left">
                                                        <td className="px-4 py-2">{sale.date ? (() => {
                                                            const d = new Date(sale.date);
                                                            return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
                                                        })() : "-"}</td>
                                                        <td className="px-4 py-2">{sale.email}<span className="text-zinc-400 italic pl-4">{sale.username ? sale.username : ""}</span></td>
                                                        <td className="px-4 py-2">
                                                            {(sale.total || 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                                        </td>
                                                        <td className="px-4 py-2">{sale.platform || "-"}</td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={5} className="px-4 py-2 text-center text-zinc-400">No sales found.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-zinc-400">Loading sales data...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SalesView;