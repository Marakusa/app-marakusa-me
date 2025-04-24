import React from 'react';
import { FaLink } from 'react-icons/fa';

const Resources: React.FC = () => {
    const dependencies = [
        {
            name: "VRChat SDK",
            documentation: "https://creators.vrchat.com/avatars",
            download: "https://vrchat.com/home/download",
        },
        {
            name: "Unity 2022.3.22f1",
            documentation: "https://docs.unity.com",
            download: "https://unity.com/releases/editor/whats-new/2022.3.22",
        },
        {
            name: "Poiyomi Toon Shader",
            documentation: "https://www.poiyomi.com/intro",
            download: "vcc://vpm/addRepo?url=https%3A%2F%2Fpoiyomi.github.io%2Fvpm%2Findex.json",
        },
        {
            name: "VRCFury",
            documentation: "https://vrcfury.com/tutorials",
            download: "vcc://vpm/addRepo?url=https%3A%2F%2Fvcc.vrcfury.com",
        },
    ];
    const optionalDependencies = [
        {
            name: "GoGo Loco",
            documentation: "https://teeth-fetch-gdl.craft.me/CxY701Ne9Ng5Ev/b/CE0624FE-CB3A-43BD-BD90-1380EB17D067/Add-Emotes",
            documentationDisplay: "https://teeth-fetch-gdl.craft.me",
            download: "vcc://vpm/addRepo?url=https%3A%2F%2FSpokeek.github.io%2Fgoloco%2Findex.json",
        },
        {
            name: "UniVRM v0.99.0",
            documentation: "https://vrm.dev/en/univrm",
            download: "https://github.com/vrm-c/UniVRM/releases/tag/v0.99.0",
        },
    ];

    return (
        <div>
            <div className="md:max-w-4xl mx-auto py-5 md:px-5 my-27">
                <div className="bg-zinc-900 text-white w-full sm:rounded-3xl shadow-lg shadow-black/20 p-8 md:px-16 md:pb-16 text-left">

                    <h2 className="text-2xl text-center font-bold mb-4">VRChat Resources</h2>

                    <p>These packages are required for uploading the avatar.</p>
                    <p className="mt-4">Make sure to download the latest versions of these packages. The links below will take you to the official documentation and download pages.</p>
                    <table className="w-full border-collapse mt-4 rounded-3xl overflow-hidden">
                        <thead>
                            <tr className="bg-zinc-950 text-white font-bold border-b-2 border-zinc-900">
                                <th className="p-2 px-4">Dependency</th>
                                <th className="p-2 px-4">Docs</th>
                                <th className="p-2 px-4">Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dependencies.map((dependency, index) => (
                                <tr
                                    key={index}
                                    className="odd:bg-zinc-800 even:bg-zinc-800/50 text-white font-thin"
                                >
                                    <td className="p-2 px-4">
                                        <strong>{dependency.name}</strong>
                                    </td>
                                    <td className="p-2 px-4">
                                        <a
                                            href={dependency.documentation}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:underline flex items-center gap-1 font-bold"
                                        >
                                            <FaLink className="w-5 h-5 min-w-5" /> <span className="hidden md:block">{dependency.documentation}</span><span className="block md:hidden">Link</span>
                                        </a>
                                    </td>
                                    <td className="p-2 px-4">
                                        <a
                                            href={dependency.download}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:underline flex items-center gap-1 font-bold"
                                        >
                                            <FaLink className="w-5 h-5 min-w-5" /> <span className="hidden sm:block">{dependency.download.includes("vcc://") ? "Add to VCC" : "Download"}</span><span className="block sm:hidden">Link</span>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <p className="text-2xl text-start font-bold mt-8 mb-4">Optional</p>

                    <p>These packages are optional and include additional features.</p>
                    <table className="w-full border-collapse mt-4 rounded-3xl overflow-hidden">
                        <thead>
                            <tr className="bg-zinc-950 text-white font-bold border-b-2 border-zinc-900">
                                <th className="p-2 px-4">Package</th>
                                <th className="p-2 px-4">Docs</th>
                                <th className="p-2 px-4">Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {optionalDependencies.map((dependency, index) => (
                                <tr
                                    key={index}
                                    className="odd:bg-zinc-800 even:bg-zinc-800/50 text-white font-thin"
                                >
                                    <td className="p-2 px-4">
                                        <strong>{dependency.name}</strong>
                                    </td>
                                    <td className="p-2 px-4">
                                        <a
                                            href={dependency.documentation}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:underline flex items-center gap-1 font-bold"
                                        >
                                            <FaLink className="w-5 h-5 min-w-5" /> <span className="hidden md:block">{dependency.documentationDisplay ?? dependency.documentation}</span><span className="block md:hidden">Link</span>
                                        </a>
                                    </td>
                                    <td className="p-2 px-4">
                                        <a
                                            href={dependency.download}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:underline flex items-center gap-1 font-bold"
                                        >
                                            <FaLink className="w-5 h-5 min-w-5" /> <span className="hidden sm:block">{dependency.download.includes("vcc://") ? "Add to VCC" : "Download"}</span><span className="block sm:hidden">Link</span>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Resources;
