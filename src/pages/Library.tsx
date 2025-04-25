import { cdnPath } from "../public.config.json";
import { useApi } from "../ApiContext";
import { SiAdobe } from "react-icons/si";
import { CiFileOn, CiFolderOn } from "react-icons/ci";
import { GoDownload } from "react-icons/go";
import { BiMoviePlay, BiSolidCollection, BiSubdirectoryRight } from "react-icons/bi";
import { FiArrowUpLeft } from "react-icons/fi";
import { JSX, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaAngleLeft, FaFileZipper, FaKey, FaLink, FaScroll, FaUnity } from "react-icons/fa6";
import { FaArchive, FaPaintBrush } from "react-icons/fa";
import { useProfile } from "../ProfileContext";

function formatFileSize(size: number) {
    if (size >= 1073741824) {
        return (size / 1073741824).toFixed(1) + " GB";
    } else if (size >= 1048576) {
        return (size / 1048576).toFixed(1) + " MB";
    } else if (size >= 1024) {
        return (size / 1024).toFixed(1) + " KB";
    } else {
        return size + " bytes";
    }
}

interface LibraryProps {
    archived?: boolean;
}

interface File {
    files: File[];
    id: string;
    name: string;
    displayName: string;
    size?: number;
    type: string;
    path?: string;
}
interface Content {
    type: string;
    content: string;
}
interface Product {
    id: string;
    name?: string;
    description?: string;
    icon?: string;
    thumbnail?: string;
    content?: Content[];
    files: File[];
    currentDirectory: number[];
}
interface ProductsFetch {
    fetched: boolean;
    error: string | null;
    products: Product[];
    archivedProducts: Product[];
}
interface FileFetch {
    fetched: boolean;
    error: string | null;
    files: File[];
}

function Library({ archived }: LibraryProps) {
    const { currentProductId } = useParams<{ currentProductId: string }>();
    const { api } = useApi();
    const { isSignedIn, fetchProfile } = useProfile();

    const navigate = useNavigate();
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [files, setFiles] = useState<FileFetch>({
        fetched: false,
        error: null,
        files: []
    });
    const [privateFiles, setPrivateFiles] = useState<ProductsFetch>({
        fetched: false,
        error: null,
        products: [],
        archivedProducts: []
    });
    const [currentPublicDirectory, setCurrentPublicDirectory] = useState<string[]>([]);

    function downloadFile(file: string, productId: string) {
        api.generateDownloadToken(productId, file, archived ?? false, localStorage.getItem("auth"), localStorage.getItem("token"))
            .then(async (response) => {
                console.log("Download response:", response);
                if (!response.error) {
                    if (!response.data?.downloadUrl) {
                        setDownloadError("No download URL found in the response.");
                        throw new Error("No download URL found in the response.");
                    }

                    window.location.href = response.data.downloadUrl;
                } else {
                    console.error("Error downloading file:", response.error);
                    throw new Error(response.error);
                }
            });
    }

    if (files.fetched === false) {
        // Fetch files once from cdn /list/public
        fetch(cdnPath + "/list/public")
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setFiles({
                        fetched: true,
                        error: data.error,
                        files: []
                    });
                    return;
                }

                setFiles({
                    fetched: true,
                    error: null,
                    files: data
                });
            });
    }

    if (localStorage.getItem("auth") && localStorage.getItem("token") && privateFiles.fetched === false) {
        const productList = [] as Product[];
        const archivedList = [] as Product[];

        // Fetch latest files
        (async () => {
            try {
                const productsResponse = await fetch(cdnPath + "/list/products/files", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        auth: localStorage.getItem("auth"),
                        token: localStorage.getItem("token"),
                        archived: false
                    })
                });

                const products = await productsResponse.json();

                if (Array.isArray(products)) {
                    for (const product of products) {
                        const data = await product.files;

                        if (data.error) {
                            setPrivateFiles(() => ({
                                fetched: true,
                                error: data.error,
                                products: [],
                                archivedProducts: [...archivedList]
                            }));
                            return;
                        }

                        const productData: Product = {
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            icon: product.icon,
                            thumbnail: product.thumbnail,
                            content: product.content,
                            files: data,
                            currentDirectory: []
                        };

                        productList.push(productData);
                    }

                    setPrivateFiles(() => ({
                        fetched: true,
                        error: null,
                        products: productList,
                        archivedProducts: [...archivedList]
                    }));
                }
            } catch (error) {
                console.error("Error fetching private files:", error);
                setPrivateFiles(() => ({
                    fetched: true,
                    error: "An error occurred while fetching private files.",
                    products: [],
                    archivedProducts: [...archivedList]
                }));
            }
        })();

        // Fetch archived files
        (async () => {
            try {
                const productsResponse = await fetch(cdnPath + "/list/products/files", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        auth: localStorage.getItem("auth"),
                        token: localStorage.getItem("token"),
                        archived: true
                    })
                });

                const products = await productsResponse.json();

                if (Array.isArray(products)) {
                    for (const product of products) {
                        if (product === null || product.files === null) {
                            continue;
                        }

                        const data = await product.files;

                        if (data.error) {
                            setPrivateFiles(() => ({
                                fetched: true,
                                error: data.error,
                                products: [...productList],
                                archivedProducts: []
                            }));
                            return;
                        }

                        const productData: Product = {
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            icon: product.icon,
                            thumbnail: product.thumbnail,
                            files: data,
                            currentDirectory: []
                        };

                        archivedList.push(productData);
                    }

                    setPrivateFiles(() => ({
                        fetched: true,
                        error: null,
                        products: [...productList],
                        archivedProducts: archivedList
                    }));
                }
            } catch (error) {
                console.error("Error fetching private files:", error);
                setPrivateFiles(() => ({
                    fetched: true,
                    error: "An error occurred while fetching private files.",
                    products: [...productList],
                    archivedProducts: []
                }));
            }
        })();
    }

    const fileIcons: Record<string, JSX.Element> = {
        "directory": <CiFolderOn className="w-10 h-10 min-w-10" />,
        "mp4": <BiMoviePlay className="w-10 h-10 min-w-10" />,
        "zip": <FaFileZipper className="w-10 h-10 min-w-10" />,
        "spp": <div className="bg-[url(/adobe-sp.png)] bg-contain bg-no-repeat w-10 h-10 w-min-10" />,
        "unitypackage": <FaUnity className="w-10 h-10 min-w-10" />,
        "default": <CiFileOn className="w-10 h-10 min-w-10" />,
    }

    function getFileIcon(fileType: string) {
        return fileIcons[fileType] ?? fileIcons["default"];
    }

    function scrollToId(id: string) {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }

    useEffect(() => {
        if (archived) {
            isSignedIn().then((signedIn) => {
                if (!signedIn) {
                    navigate("/");
                    return;
                }
            });
        }
        else {
            fetchProfile();
        }
    }, []);

    return (
        <>
            <title>Naali - Library</title>

            <div id="top" className="absolute top-0"></div>
            {downloadError && (
                <div onClick={() => { setDownloadError(null); }} className="fixed top-20 left-1/2 -translate-x-1/2 z-100 flex flex-col gap-2 justify-center items-center w-100 bg-red-500 border border-red-400 rounded-3xl shadow-lg shadow-black/20 p-4">
                    <p className="text-3xl">Error downloading a file</p>
                    <p>{downloadError}</p>
                </div>
            )}
            <div className="mx-8 md:mx-auto md:w-full flex flex-col gap-8 justify-center items-center my-32 select-none">
                {!archived && !currentProductId && (
                    <div className="w-full flex flex-col justify-center items-center bg-gradient-to-tr from-purple-400/90 to-blue-300/90 text-blue-950 font-bold rounded-3xl shadow-lg shadow-black/20 p-8">
                        <h3>Official stores</h3>
                        <p>My products are available on the following stores.</p>
                        <div className="flex flex-col lg:flex-row gap-5 mt-5">
                            <a href="https://jinxxy.com/Marakusa/products" target="_blank" className="bg-[url(/jinxxy-large.png)] bg-cover bg-no-repeat bg-center w-54 h-18 hover:scale-102 rounded-xl border border-purple-950 shadow-lg shadow-black/20"></a>
                            <a href="https://marakusa.gumroad.com" target="_blank" className="bg-[url(/gumroad-large.png)] bg-cover bg-no-repeat bg-center w-54 h-18 hover:scale-102 rounded-xl border border-pink-400 shadow-lg shadow-black/20"></a>
                            <a href="https://marakusa.lemonsqueezy.com" target="_blank" className="bg-[url(/lemonsqueezy-large.png)] bg-cover bg-no-repeat bg-center w-54 h-18 hover:scale-102 rounded-xl border border-blue-900 shadow-lg shadow-black/20"></a>
                        </div>
                    </div>
                )}
                <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-start">
                    <div className="w-full md:w-100 flex flex-col gap-8 justify-center items-center">
                        <div className="w-full flex flex-col gap-4 justify-center items-center bg-zinc-900 rounded-3xl shadow-lg shadow-black/20 px-6 py-8">
                            {!archived ? (
                                <>
                                    {!currentProductId ? (
                                        <>
                                            <div className="text-3xl">Library</div>
                                            <p>Here you can find all of the files you have access to.</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-3xl">Downloads</div>
                                            <p>Download product related files.</p>
                                        </>
                                    )}

                                    <div className="flex flex-col gap-0 w-full">

                                        {!currentProductId ? (
                                            <>
                                                {localStorage.getItem("auth") && localStorage.getItem("token") ? (<div onClick={() => navigate("/licenses")} className="flex flex-row gap-3 text-sm text-zinc-300 px-3 py-2 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors w-full">
                                                    <FaKey className="w-5 h-5 min-w-5" /> Licenses
                                                </div>) : (<div className="flex flex-row gap-3 text-sm text-zinc-500 px-3 py-2 rounded-full transition-colors w-full">
                                                    <FaKey className="w-5 h-5 min-w-5" /> Licenses
                                                </div>)}

                                                <hr className="w-11/12 my-2 m-auto border-zinc-600"></hr>

                                                {localStorage.getItem("auth") && localStorage.getItem("token") ? (<div onClick={() => { navigate("/"), scrollToId("unityFiles") }} className="flex flex-row gap-3 text-sm text-zinc-300 px-3 py-2 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors w-full">
                                                    <FaUnity className="w-5 h-5 min-w-5" /> Latest packages
                                                </div>) : (<div className="flex flex-row gap-3 text-sm text-zinc-500 px-3 py-2 rounded-full transition-colors w-full">
                                                    <FaUnity className="w-5 h-5 min-w-5" /> Latest packages
                                                </div>)}
                                                <div onClick={() => { navigate("/"), scrollToId("sppFiles") }} className="flex flex-row gap-3 text-sm text-zinc-300 px-3 py-2 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors w-full">
                                                    <FaPaintBrush className="w-5 h-5 min-w-5" /> Texturing
                                                </div>
                                                <div onClick={() => navigate("/resources")} className="flex flex-row gap-3 text-sm text-zinc-300 px-3 py-2 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors w-full">
                                                    <BiSolidCollection className="w-5 h-5 min-w-5" /> Resources
                                                </div>

                                                <hr className="w-11/12 my-2 m-auto border-zinc-600"></hr>

                                                {localStorage.getItem("auth") && localStorage.getItem("token") ? (<div onClick={() => navigate("/archived")} className="flex flex-row gap-3 text-sm text-zinc-300 px-3 py-2 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors w-full">
                                                    <FaArchive className="w-5 h-5 min-w-5" /> Archived
                                                </div>) : (<div className="flex flex-row gap-3 text-sm text-zinc-500 px-3 py-2 rounded-full transition-colors w-full">
                                                    <FaArchive className="w-5 h-5 min-w-5" /> Archived
                                                </div>)}

                                                <div onClick={() => navigate("/tos")} className="flex flex-row gap-3 text-sm text-zinc-300 px-3 py-2 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors w-full">
                                                    <FaScroll className="w-5 h-5 min-w-5" /> Terms of Service
                                                </div>
                                            </>
                                        ) : (
                                            <div onClick={() => navigate("/")} className="flex flex-row gap-3 text-sm text-zinc-300 px-3 py-2 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors w-full">
                                                <FaAngleLeft className="w-5 h-5 min-w-5" /> Back to Library
                                            </div>
                                        )}

                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-3xl">Archived</div>
                                    <p>Here you can access product files of their previous versions.</p>
                                    <hr className="w-full border-zinc-600"></hr>
                                    <div className="flex flex-col gap-0 w-full">
                                        <div onClick={() => navigate("/")} className="flex flex-row gap-3 text-sm text-zinc-300 p-2 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors w-full">
                                            <FaAngleLeft className="w-5 h-5 min-w-5" /> Back to Library
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {!archived ? (<></>) : (<div className="flex flex-col gap-2 justify-center items-center bg-gradient-to-tr from-red-400 to-orange-300 text-red-950 font-bold rounded-3xl shadow-lg shadow-black/20 p-8">
                            <p className="text-xl">NOTICE!</p>
                            <p>These files are from the older versions of the assets, and are not supported anymore.</p>
                        </div>)}
                    </div>

                    <div className="w-full flex flex-col gap-8">
                        {!archived && !currentProductId && (<div id="sppFiles" className="flex flex-col gap-4 text-left bg-zinc-900 rounded-3xl shadow-lg shadow-black/20 p-8">
                            <div className="flex gap-3 items-center"><p className="text-3xl flex gap-3"><SiAdobe className="mt-[2px]" /> Substance Painter files</p><span className="bg-green-500 text-green-900 text-lg font-black px-3 py-0 rounded-full">FREE</span></div>
                            <p>These files are free to use if you do commissions, or if you just want to make textures before purchase.</p>
                            <p className="flex gap-2">The Naali's <Link to="/tos" target="_blank" className="text-blue-400 hover:underline flex items-center gap-1 font-bold"><FaLink className="w-5 h-5 min-w-5" /> Terms of Service</Link> apply.</p>
                            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3">
                                {currentPublicDirectory.length > 0 && (
                                    <div
                                        key=".."
                                        className="flex flex-row gap-3 justify-between items-center bg-zinc-800 text-zinc-300 px-5 py-3 rounded-full hover:bg-zinc-800/70 transition-color cursor-pointer"
                                        onClick={() => {
                                            const updatedDirectory = [...currentPublicDirectory];
                                            updatedDirectory.pop();
                                            setCurrentPublicDirectory(updatedDirectory);
                                        }}
                                    >
                                        <CiFolderOn className="w-10 h-10 min-w-10" />
                                        <div className="flex-1 flex-col gap-0.5">
                                            <p className="text-lg w-full break-all">..</p>
                                        </div>
                                        <FiArrowUpLeft className="w-6 h-6 min-w-6" />
                                    </div>
                                )}
                                {currentPublicDirectory.reduce((files, index) => {
                                    return files[Number(index)]?.type === "directory" ? files[Number(index)].files || [] : [];
                                }, files.files).map((file, index) => (
                                    <div
                                        key={file.name}
                                        className="flex flex-row gap-3 justify-between items-center bg-zinc-800 text-zinc-300 px-5 py-3 rounded-full hover:bg-zinc-800/70 transition-color cursor-pointer"
                                        onClick={() => {
                                            if (file.type === "directory") {
                                                setCurrentPublicDirectory([...currentPublicDirectory, index.toString()]);
                                            } else {
                                                window.open(cdnPath + "/public/" + file.path);
                                            }
                                        }}
                                    >
                                        {getFileIcon(file.type)}
                                        <div className="flex-1 flex-col gap-0.5">
                                            <p className="text-lg w-full break-all">{file.type === "directory" ? file.name : file.name.includes('.') ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name}</p>
                                            <p className="text-sm text-zinc-400 uppercase">{file.type === "directory" ? "" : file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.') + 1) + " • " : "file • "}{file.size !== undefined ? formatFileSize(file.size) : file.type === "directory" ? "" : "???"}</p>
                                        </div>
                                        {file.type !== "directory" ?
                                            (<GoDownload className="w-6 h-6 min-w-6" />) :
                                            (<BiSubdirectoryRight className="w-6 h-6 min-w-6" />)}
                                    </div>
                                ))}
                            </div>
                        </div>)}

                        <div id="unityFiles" className="flex flex-col gap-8">

                            {(privateFiles.fetched && localStorage.getItem("auth") && localStorage.getItem("token") && !currentProductId && !archived) ? (
                                <div className="flex flex-col gap-4 text-left bg-zinc-900 rounded-3xl shadow-lg shadow-black/20 p-8">
                                    <p className="text-3xl flex gap-3"><FaUnity className="mt-[2px]" /> Unity packages</p>
                                    <p>These are the latest versions of the packages. View products files by clicking them.</p>
                                    <div className="flex flex-col xl:grid xl:grid-cols-2 gap-8 text-left">
                                        {privateFiles.products.map(product => (
                                            <div key={product.id} onClick={() => {
                                                scrollToId("top"),
                                                    // Set timeout because sometimes the page doesn't scroll to the top
                                                    setTimeout(() => { navigate("/product/" + product.id) }, 50)
                                            }} className="flex flex-col gap-4 text-left cursor-pointer hover:-translate-y-0.5 transition-transform">
                                                {product.thumbnail && (
                                                    <div
                                                        style={{ backgroundImage: `url(${cdnPath + product.thumbnail})` }}
                                                        className="bg-cover bg-no-repeat bg-center w-full h-40 rounded-2xl border border-zinc-700/30 shadow-lg shadow-black/20"
                                                    ></div>
                                                )}
                                                {product.description && <p>{product.description}</p>}
                                            </div>
                                        ))}
                                        <div onClick={() => navigate("/licenses?redeem")} className="w-full h-40 text-3xl border-2 border-dashed border-zinc-300 text-zinc-300 rounded-3xl p-2 flex justify-center items-center cursor-pointer hover:bg-zinc-900 hover:border-blue-300 hover:text-blue-300 hover:transform hover:-translate-y-0.5 transition active:translate-y-0.5 active:bg-zinc-900/50 active:border-blue-500">
                                            <IoMdAddCircleOutline /> <span className="text-lg p-3">Redeem a License</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (<></>)}

                            {privateFiles.fetched || !localStorage.getItem("auth") || !localStorage.getItem("token") ? (
                                !privateFiles.error ? (
                                    (!archived ? privateFiles.products : privateFiles.archivedProducts).map(product => {
                                        if (archived) {
                                            const currentFiles = product.currentDirectory.reduce((files, index) => {
                                                return files[index]?.type === "directory" ? files[index].files || [] : [];
                                            }, product.files);

                                            return (
                                                <div key={product.id} className="flex flex-col gap-8 text-left bg-zinc-900 rounded-3xl shadow-lg shadow-black/20 p-8">
                                                    {product.thumbnail && (<div
                                                        style={{ backgroundImage: `url(${cdnPath + product.thumbnail})` }}
                                                        className="bg-cover bg-no-repeat bg-center w-full h-40 rounded-2xl border border-zinc-700/30 shadow-lg shadow-black/20"></div>)}
                                                    <p className="text-3xl flex gap-3">{product.name ?? product.id}</p>
                                                    {product.description && <p>{product.description}</p>}
                                                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3">
                                                        {product.currentDirectory.length > 0 && (
                                                            <div
                                                                key=".."
                                                                className="flex flex-row gap-3 justify-between items-center bg-zinc-800 text-zinc-300 px-5 py-3 rounded-full hover:bg-zinc-800/70 transition-color cursor-pointer"
                                                                onClick={() => {
                                                                    product.currentDirectory.pop();
                                                                    setPrivateFiles(prev => ({
                                                                        ...prev,
                                                                        products: (!archived ? prev.products : prev.archivedProducts).map(p => p.id === product.id ? { ...p, currentDirectory: product.currentDirectory } : p)
                                                                    }));
                                                                }}
                                                            >
                                                                <CiFolderOn className="w-10 h-10 min-w-10" />
                                                                <div className="flex-1 flex-col gap-0.5">
                                                                    <p className="text-lg w-full break-all">..</p>
                                                                </div>
                                                                <FiArrowUpLeft className="w-6 h-6 min-w-6" />
                                                            </div>
                                                        )}
                                                        {currentFiles.map((file, index) => (
                                                            <div
                                                                key={file.id}
                                                                className="flex flex-row gap-3 justify-between items-center bg-zinc-800 text-zinc-300 px-5 py-3 rounded-full hover:bg-zinc-800/70 transition-color cursor-pointer"
                                                                onClick={() => {
                                                                    if (file.type === "directory") {
                                                                        product.currentDirectory.push(index);
                                                                        setPrivateFiles(prev => ({
                                                                            ...prev,
                                                                            products: (!archived ? prev.products : prev.archivedProducts).map(p => p.id === product.id ? { ...p, currentDirectory: product.currentDirectory } : p)
                                                                        }));
                                                                    } else {
                                                                        downloadFile(file.name, product.id);
                                                                    }
                                                                }}
                                                            >
                                                                {getFileIcon(file.type)}
                                                                <div className="flex-1 flex-col gap-0.5">
                                                                    <p className="text-lg w-full break-all">{file.type === "directory" ? file.displayName : file.displayName.includes('.') ? file.displayName.substring(0, file.displayName.lastIndexOf('.')) : file.displayName}</p>
                                                                    <p className="text-sm text-zinc-300 uppercase">{file.type === "directory" ? "" : file.displayName.includes('.') ? file.displayName.substring(file.displayName.lastIndexOf('.') + 1) + " • " : "file • "}{file.size !== undefined ? formatFileSize(file.size) : file.type === "directory" ? "" : "???"}</p>
                                                                </div>
                                                                {file.type !== "directory" ?
                                                                    (<GoDownload className="w-6 h-6 min-w-6" />) :
                                                                    (<BiSubdirectoryRight className="w-6 h-6 min-w-6" />)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            if (currentProductId == product.id) {
                                                return (
                                                    <div key={product.id} className="flex flex-col gap-4 text-left bg-zinc-900 rounded-3xl shadow-lg shadow-black/20 p-8">
                                                        {product.thumbnail && (<div
                                                            style={{ backgroundImage: `url(${cdnPath + product.thumbnail})` }}
                                                            className="bg-cover bg-no-repeat bg-center w-full h-40 rounded-2xl border border-zinc-700/30 shadow-lg shadow-black/20"></div>)}
                                                        <p className="text-3xl flex gap-3 py-4">{product.name ?? product.id}</p>
                                                        {product.description && <p>{product.description}</p>}
                                                        {product.content?.map((contentItem, index) => {
                                                            if (contentItem.type === "paragraph") {
                                                                return <p key={index}>{contentItem.content}</p>;
                                                            } else if (contentItem.type === "header") {
                                                                return <p key={index} className="text-2xl pt-4">{contentItem.content}</p>;
                                                            } else if (contentItem.type === "filelist") {
                                                                const filePattern = new RegExp(contentItem.content);
                                                                const matchingFiles = product.files.filter(file => filePattern.test(file.name));
                                                                return (
                                                                    <div key={index} className="flex flex-col lg:grid lg:grid-cols-2 gap-3">
                                                                        {matchingFiles.reverse().map(file => (
                                                                            <div
                                                                                key={file.id}
                                                                                className="flex flex-row gap-3 justify-between items-center bg-zinc-800 text-zinc-300 px-5 py-3 rounded-full hover:bg-zinc-800/70 transition-color cursor-pointer"
                                                                                onClick={() => downloadFile(file.name, product.id)}
                                                                            >
                                                                                {getFileIcon(file.type)}
                                                                                <div className="flex-1 flex-col gap-0.5">
                                                                                    <p className="text-lg w-full break-all">{file.name.includes('.') ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name}</p>
                                                                                    <p className="text-sm text-zinc-300 uppercase">{file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.') + 1) + " • " : "file • "}{file.size !== undefined ? formatFileSize(file.size) : "???"}</p>
                                                                                </div>
                                                                                <GoDownload className="w-6 h-6 min-w-6" />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                );
                                                            } else {
                                                                return null;
                                                            }
                                                        })}
                                                    </div>
                                                );
                                            }
                                        }
                                    })
                                ) : (
                                    <div className="flex flex-col gap-8 text-left bg-zinc-900 rounded-3xl shadow-lg shadow-black/20 p-8">
                                        <p className="text-3xl">Error</p>
                                        <p>{privateFiles.error}</p>
                                    </div>
                                )
                            ) : (
                                <div className="flex flex-col gap-8 text-left bg-zinc-900 rounded-3xl shadow-lg shadow-black/20 p-8">
                                    <div className="text-3xl w-50 h-10 bg-zinc-700 rounded-3xl animate-pulse"></div>
                                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3">
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <div key={index} className="flex flex-row gap-3 justify-between items-center bg-zinc-800 text-white p-3 rounded-3xl shadow-lg shadow-black/20 animate-pulse">
                                                <div className="w-10 h-10 min-w-10 bg-zinc-700 rounded"></div>
                                                <div className="flex-1 flex-col gap-0.5">
                                                    <div className="h-5 bg-zinc-700 rounded w-3/4 mb-1"></div>
                                                    <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                                                </div>
                                                <div className="w-6 h-6 min-w-6 bg-zinc-700 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Library;
