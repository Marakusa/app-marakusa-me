import React from 'react';
import { cdnPath } from '../public.config.json';
import { IoWarningOutline } from "react-icons/io5";

const RedeemTutorial: React.FC = () => {
    return (
        <div>
            <div className="max-w-4xl mx-auto p-5 my-27">
                <div className="bg-zinc-900 text-white w-full rounded-3xl shadow-lg shadow-black/20 p-8 px-16 pb-16 text-left">

                    <h2 className="text-2xl text-center font-bold mb-4">How do I redeem my purchase?</h2>

                    <div className="bg-zinc-800/50 p-6 rounded-3xl mb-4 w-fit">
                        <p>Table of contents</p>
                        <ul className="list-disc list-inside ml-4">
                            <li><a href="#jinxxy" className="text-blue-400 hover:underline">Jinxxy</a></li>
                            <li><a href="#gumroad" className="text-blue-400 hover:underline">Gumroad</a></li>
                            <li><a href="#lemon" className="text-blue-400 hover:underline">Lemon Squeezy</a></li>
                        </ul>
                    </div>

                    <p>This is a guide on how you can redeem your purchases from my stores to access its latest/archived files.</p>

                    <div id="jinxxy" className="pt-8">
                        <p className="text-3xl font-semibold mt-6 mb-3">Jinxxy</p>
                        
                        <div className="text-left flex flex-col gap-2">
                            <p>Log into your Jinxxy account.</p>
                            <p>Navigate to the "Purchases" page. Or click the link: <a href="https://jinxxy.com/my/inventory" target="_blank" className="text-blue-400 hover:underline font-bold">https://jinxxy.com/my/inventory</a></p>
                            <img src={`${cdnPath}/public/tutorial-jinxxy-purchases.jpg`}
                                    className="bg-cover bg-no-repeat bg-center w-full h-auto rounded-2xl border border-zinc-700/30 shadow-lg shadow-black/20 my-4"
                                    draggable={false}></img>
                            <p>Choose the product you want to redeem on the list.</p>
                            <img src={`${cdnPath}/public/tutorial-jinxxy-key.jpg`}
                                    className="bg-cover bg-no-repeat bg-center w-full h-auto rounded-2xl border border-zinc-700/30 shadow-lg shadow-black/20 my-4"
                                    draggable={false}></img>
                            <p>Scroll down the products page until you see the "Product License" section. Copy the license key.</p>
                            <img src={`${cdnPath}/public/tutorial-redeem-jinxxy.jpg`}
                                    className="bg-cover bg-no-repeat bg-center w-full h-auto rounded-2xl border border-zinc-700/30 shadow-lg shadow-black/20 my-4"
                                    draggable={false}></img>
                            <p>Paste the key to the "License Key" field. Choose "Jinxxy" from the first dropdown menu, and from the second one the product you want to redeem.</p>
                            <p>And thats it! You now have successfully redeemed a product from Jinxxy.</p>
                        </div>
                    </div>

                    <div id="gumroad" className="pt-8">
                        <p className="text-3xl font-semibold mt-6 mb-3">Gumroad</p>
                        
                        <div className="text-left flex flex-col gap-2">
                            <p>Log into your Gumroad account.</p>
                            <p>Navigate to the "Library" page. Or click the link: <a href="https://gumroad.com/library" target="_blank" className="text-blue-400 hover:underline font-bold">https://gumroad.com/library</a></p>
                            <img src={`${cdnPath}/public/tutorial-gumroad-library.jpg`}
                                    className="bg-cover bg-no-repeat bg-center w-full h-auto rounded-2xl border border-zinc-700/30 shadow-lg shadow-black/20 my-4"
                                    draggable={false}></img>
                            <p>Choose the product you want to redeem on the list.</p>
                            <img src={`${cdnPath}/public/tutorial-gumroad-key.jpg`}
                                    className="bg-cover bg-no-repeat bg-center w-full h-auto rounded-2xl border border-zinc-700/30 shadow-lg shadow-black/20 my-4"
                                    draggable={false}></img>
                            <p>Scroll down the products page until you see the "License Key" section. Copy the license key manually or by clicking the "Copy" button.</p>
                            <img src={`${cdnPath}/public/tutorial-redeem-gumroad.jpg`}
                                    className="bg-cover bg-no-repeat bg-center w-full h-auto rounded-2xl border border-zinc-700/30 shadow-lg shadow-black/20 my-4"
                                    draggable={false}></img>
                            <p>Paste the key to the "License Key" field. Choose "Gumroad" from the first dropdown menu, and from the second one the product you want to redeem.</p>
                            <div className="bg-yellow-950 border border-yellow-500 p-2 px-3 my-4 rounded-xl font-bold flex flex-row items-center"><IoWarningOutline className="w-10 h-10 mr-3 text-yellow-300" /><p>If you are redeeming bundles, choose the bundle from the list and not the included products of the bundle!</p></div>
                            <p>And thats it! You now have successfully redeemed a product from Gumroad.</p>
                        </div>
                    </div>

                    <div id="lemon" className="pt-8">
                        <p className="text-3xl font-semibold mt-6 mb-3">Lemon Squeezy</p>
                        
                        <div className="text-left flex flex-col gap-2">
                            <p>Log into your Lemon Squeezy account.</p>
                            <p>Navigate to the "My Orders" page. Or click the link: <a href="https://app.lemonsqueezy.com/my-orders" target="_blank" className="text-blue-400 hover:underline font-bold">https://app.lemonsqueezy.com/my-orders</a></p>
                            <img src={`${cdnPath}/public/tutorial-lemon-myorders.jpg`}
                                    className="bg-cover bg-no-repeat bg-center w-full h-auto rounded-2xl border border-zinc-700/30 shadow-lg shadow-black/20 my-4"
                                    draggable={false}></img>
                            <p>Choose the product you want to redeem on the list.</p>
                            <img src={`${cdnPath}/public/tutorial-lemon-key.jpg`}
                                    className="bg-cover bg-no-repeat bg-center w-full h-auto rounded-2xl border border-zinc-700/30 shadow-lg shadow-black/20 my-4"
                                    draggable={false}></img>
                            <p>Scroll down the products page until you see the "License Key" section. Copy the license key manually or by clicking the "Copy" button.</p>
                            <img src={`${cdnPath}/public/tutorial-redeem-lemon.jpg`}
                                    className="bg-cover bg-no-repeat bg-center w-full h-auto rounded-2xl border border-zinc-700/30 shadow-lg shadow-black/20 my-4"
                                    draggable={false}></img>
                            <p>Paste the key to the "License Key" field. Choose "Lemon Squeezy" from the first dropdown menu, and from the second one the product you want to redeem.</p>
                            <div className="bg-yellow-950 border border-yellow-500 p-2 px-3 my-4 rounded-xl font-bold flex flex-row items-center"><IoWarningOutline className="w-10 h-10 mr-3 text-yellow-300" /><p>If you are redeeming bundles, choose the bundle from the list and not the included products of the bundle!</p></div>
                            <p>And thats it! You now have successfully redeemed a product from Lemon Squeezy.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RedeemTutorial;