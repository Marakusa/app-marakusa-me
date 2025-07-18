import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "./ProfileContext";
import { useEffect, useState } from "react";

function Header() {
    const navigate = useNavigate();

    const { getSessionProfile } = useProfile();
    const [profileMenu, setProfileMenu] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);

    const toggleProfileMenu = () => {
        setMobileMenu(false);
        setProfileMenu(!profileMenu);
    };
    const toggleMobileMenu = () => {
        setProfileMenu(false);
        setMobileMenu(!mobileMenu);
    };

    useEffect(() => {
        const closeProfileMenu = (event: MouseEvent) => {
            if (event.target instanceof HTMLElement) {
                const insideProfile =
                    event.target.closest("#profile-button") ||
                    event.target.closest("#profile-menu");
                if (!insideProfile) setProfileMenu(false);
            }
        };
        document.addEventListener("click", closeProfileMenu);
        return () => document.removeEventListener("click", closeProfileMenu);
    }, []);

    const [isFloating, setIsFloating] = useState(true);
    function handleScroll() {
        setIsFloating(window.scrollY <= 50);
    }
    useEffect(() => {
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { to: "/", label: "Library" },
        { to: "/licenses", label: "Licenses" },
        { to: "https://store.marakusa.me", label: "Stores", external: true },
        { to: "/docs", label: "Help" },
    ];

    const profileLinks = [
        { to: "/profile", label: "Profile", external: false },
        { to: "/settings", label: "Settings", external: false, bottomHr: true },
        { to: "/auth?signout=1", label: "Sign Out", external: false },
    ];

    const navClasses = 'text-white p-3 rounded-lg border border-transparent hover:bg-zinc-950/50 hover:border-zinc-900';

    return (
        <header className={
            `transition-all duration-300 fixed z-50 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-xl shadow-black/20 ${isFloating ? 'top-8 left-8 right-8' : 'top-4 left-8 right-8'}`
        }>
            <div className="flex items-center justify-between pl-6 p-2">
                <div onClick={() => navigate("/")} className="font-[Boldonse] text-lg text-blue-200 select-none cursor-pointer">MARAKUSA</div>

                {/* Desktop nav */}
                <nav className="hidden md:flex flex-grow justify-center gap-2">
                    {links.map((link) => link.external ? (
                        <a key={link.label} href={link.to} target="_blank" rel="noopener noreferrer" className={navClasses}>
                            {link.label}
                        </a>
                    ) : (
                        <Link key={link.label} to={link.to} className={navClasses}>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Profile & Burger wrapper */}
                <div className="flex items-center gap-2">
                    {/* Profile button */}
                    {getSessionProfile().fetched ? (
                        getSessionProfile().data ? (
                            <div id="profile-button" onClick={toggleProfileMenu} className="flex items-center cursor-pointer select-none p-2 rounded-3xl hover:bg-zinc-950/50 border border-transparent hover:border-zinc-900">
                                <img src={
                                    getSessionProfile().data?.avatar.startsWith("https://") || getSessionProfile().data?.avatar.startsWith("/")
                                        ? getSessionProfile().data?.avatar
                                        : `https://cdn.discordapp.com/avatars/${getSessionProfile().data?.discord_id}/${getSessionProfile().data?.avatar}.png`
                                } alt="Avatar" className="w-8 h-8 rounded-full" />
                                <p className="text-white ml-3 hidden lg:block">{getSessionProfile().data?.username}</p>
                            </div>
                        ) : (
                            <Link to="/signin" className="text-white p-3 rounded-3xl hover:bg-zinc-950/50 border border-transparent hover:border-zinc-900">Sign In</Link>
                        )
                    ) : (
                       null
                    )}

                    {/* Mobile burger */}
                    <button onClick={toggleMobileMenu} className="md:hidden p-3 rounded-2xl hover:bg-zinc-950/50 border border-transparent hover:border-zinc-900">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu drawer */}
            {mobileMenu && (
                <nav className="md:hidden bg-zinc-900 border-zinc-800 rounded-b-3xl">
                    <ul className="flex flex-col">
                        {links.map((link) => (
                            <li key={link.label} className="">
                                {link.external ? (
                                    <a
                                        href={link.to}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`block text-white px-4 py-3 border-t border-zinc-800 hover:bg-zinc-700/50 ${links[links.length - 1].label === link.label ? "rounded-b-3xl" : ""
                                            }`}
                                    >
                                        {link.label}
                                    </a>
                                ) : (
                                    <Link to={link.to} onClick={toggleMobileMenu} className={`block text-white px-4 py-3 border-t border-zinc-800 hover:bg-zinc-700/50 ${profileLinks[profileLinks.length - 1].label === link.label ? "rounded-b-3xl" : ""}`}>
                                        {link.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            {/* Profile dropdown */}
            {profileMenu && (
                <div id="profile-menu" className={`bg-zinc-900 border-zinc-800 md:rounded-b-3xl md:fixed md:flex md:flex-col md:p-0 md:bg-zinc-900 text-white rounded-3xl md:shadow-lg md:shadow-black/20 md:border md:border-zinc-800 z-50 ${isFloating ? 'md:top-26 md:right-8' : 'md:top-16 md:right-2'}`}>
                    <ul className="flex flex-col">
                        {profileLinks.map((link) => (
                            <li key={link.label} className="">
                                {link.external ? (
                                    <a
                                        href={link.to}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`block text-white px-4 py-3 border-t md:border-0 border-zinc-800 hover:bg-zinc-700/50 ${profileLinks[profileLinks.length - 1].label === link.label ? "rounded-b-3xl" : ""} ${profileLinks[0].label === link.label ? "md:rounded-t-3xl" : ""}`}
                                    >
                                        {link.label}
                                    </a>
                                ) : (
                                    <Link to={link.to} onClick={toggleProfileMenu} className={`block text-white px-4 py-3 border-t md:border-0 border-zinc-800 hover:bg-zinc-700/50 ${profileLinks[profileLinks.length - 1].label === link.label ? "rounded-b-3xl" : ""} ${profileLinks[0].label === link.label ? "md:rounded-t-3xl" : ""}`}>
                                        {link.label}
                                    </Link>
                                )}
                                {link.bottomHr && <hr className="border-zinc-800" />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
}

export default Header;