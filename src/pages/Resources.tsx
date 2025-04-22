import React from 'react';
import { FaLink } from 'react-icons/fa';

const Resources: React.FC = () => {
    return (
        <div>
            <div className="max-w-3xl mx-auto p-5 my-27">
                <div className="bg-zinc-900 text-white w-full rounded-3xl shadow-lg shadow-black/20 p-5">
                    <h1 className="text-2xl font-bold mb-4">VRChat Resources</h1>
                    <p>These packages are required for uploading the avatar.</p>
                    <p className="mt-4">Make sure to download the latest versions of these packages. The links below will take you to the official documentation and download pages.</p>
                    <table className="w-full border-collapse mt-4 rounded-3xl overflow-hidden">
                        <thead>
                            <tr className="bg-zinc-950 text-white font-bold border-b-2 border-zinc-900">
                                <th className="p-2 px-4">Dependency</th>
                                <th className="p-2 px-4">Documentation</th>
                                <th className="p-2 px-4">Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="odd:bg-zinc-800 even:bg-zinc-800/50 text-white font-thin">
                                <td className="p-2 px-4"><strong>VRChat SDK</strong></td>
                                <td className="p-2 px-4">
                                    <a href="https://creators.vrchat.com/avatars" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-bold">
                                        <FaLink className="w-5 h-5 min-w-5" /> https://creators.vrchat.com/avatars
                                    </a>
                                </td>
                                <td className="p-2 px-4">
                                    <a href="https://vrchat.com/home/download" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-bold">
                                        <FaLink className="w-5 h-5 min-w-5" /> Download
                                    </a>
                                </td>
                            </tr>
                            <tr className="odd:bg-zinc-800 even:bg-zinc-800/50 text-white font-thin">
                                <td className="p-2 px-4"><strong>Unity 2022.3.22f1</strong></td>
                                <td className="p-2 px-4">
                                    <a href="https://docs.unity.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-bold">
                                        <FaLink className="w-5 h-5 min-w-5" /> https://docs.unity.com
                                    </a>
                                </td>
                                <td className="p-2 px-4">
                                    <a href="https://unity.com/releases/editor/whats-new/2022.3.22" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-bold">
                                        <FaLink className="w-5 h-5 min-w-5" /> Download
                                    </a>
                                </td>
                            </tr>
                            <tr className="odd:bg-zinc-800 even:bg-zinc-800/50 text-white font-thin">
                                <td className="p-2 px-4"><strong>Poiyomi Toon Shader</strong></td>
                                <td className="p-2 px-4">
                                    <a href="https://www.poiyomi.com/intro" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-bold">
                                        <FaLink className="w-5 h-5 min-w-5" /> https://www.poiyomi.com/intro
                                    </a>
                                </td>
                                <td className="p-2 px-4">
                                    <a href="vcc://vpm/addRepo?url=https%3A%2F%2Fpoiyomi.github.io%2Fvpm%2Findex.json" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-bold">
                                        <FaLink className="w-5 h-5 min-w-5" /> Add to VCC
                                    </a>
                                </td>
                            </tr>
                            <tr className="odd:bg-zinc-800 even:bg-zinc-800/50 text-white font-thin">
                                <td className="p-2 px-4"><strong>VRCFury</strong></td>
                                <td className="p-2 px-4">
                                    <a href="https://vrcfury.com/tutorials" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-bold">
                                        <FaLink className="w-5 h-5 min-w-5" /> https://vrcfury.com/tutorials
                                    </a>
                                </td>
                                <td className="p-2 px-4">
                                    <a href="vcc://vpm/addRepo?url=https%3A%2F%2Fvcc.vrcfury.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-bold">
                                        <FaLink className="w-5 h-5 min-w-5" /> Add to VCC
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h2 className="text-xl font-semibold mt-6 mb-3">Optional</h2>
                    <p>These packages are optional and include additional features.</p>
                    <table className="w-full border-collapse mt-4 rounded-3xl overflow-hidden">
                        <thead>
                            <tr className="bg-zinc-950 text-white font-bold border-b-2 border-zinc-900">
                                <th className="p-2 px-4">Package</th>
                                <th className="p-2 px-4">Documentation</th>
                                <th className="p-2 px-4">Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="odd:bg-zinc-800 even:bg-zinc-800/50 text-white font-thin">
                                <td className="p-2 px-4"><strong>GoGo Loco</strong></td>
                                <td className="p-2 px-4">
                                    <a href="https://teeth-fetch-gdl.craft.me/CxY701Ne9Ng5Ev/b/CE0624FE-CB3A-43BD-BD90-1380EB17D067/Add-Emotes" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-bold">
                                        <FaLink className="w-5 h-5 min-w-5" /> https://teeth-fetch-gdl.craft.me
                                    </a>
                                </td>
                                <td className="p-2 px-4">
                                    <a href="vcc://vpm/addRepo?url=https%3A%2F%2FSpokeek.github.io%2Fgoloco%2Findex.json" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-bold">
                                        <FaLink className="w-5 h-5 min-w-5" /> Add to VCC
                                    </a>
                                </td>
                            </tr>
                            <tr className="odd:bg-zinc-800 even:bg-zinc-800/50 text-white font-thin">
                                <td className="p-2 px-4"><strong>UniVRM v0.99.0</strong></td>
                                <td className="p-2 px-4">
                                    <a href="https://vrm.dev/en/univrm" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-bold">
                                        <FaLink className="w-5 h-5 min-w-5" /> https://vrm.dev/en/univrm
                                    </a>
                                </td>
                                <td className="p-2 px-4">
                                    <a href="https://github.com/vrm-c/UniVRM/releases/tag/v0.99.0" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-bold">
                                        <FaLink className="w-5 h-5 min-w-5" /> Download
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Resources;
