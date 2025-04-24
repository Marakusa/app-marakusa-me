import { Link } from "react-router-dom";
import { useProfile } from "./ProfileContext";
import { useEffect, useState } from "react";

function Header() {
    interface Profile {
        userId: string;
        username: string;
        avatar: string;
        discord_id?: string;
        gumroad_id?: string;
        auth_method: string;
    }

    const { profile, fetchProfile } = useProfile();
    const [ profileMenu, setProfileMenu ] = useState(false);

    if (profile.fetched === false) {
        fetchProfile();
    }

    // Toggle the profile menu visibility
    const toggleProfileMenu = () => {
        setProfileMenu(!profileMenu);
    };

    // Close profile menu if click is outside of it
    useEffect(() => {
        const closeProfileMenu = (event: MouseEvent) => {
            if (event.target instanceof HTMLElement) {
                const isClickInsideProfileMenu =
                    event.target.closest("#profile-button") ||
                    event.target.closest("#profile-menu");
                if (!isClickInsideProfileMenu) {
                    setProfileMenu(false);
                }
            }
        };

        document.addEventListener("click", closeProfileMenu);
        return () => {
            document.removeEventListener("click", closeProfileMenu);
        };
    }, []);

    // State to track whether the header is floating or not
    const [isFloating, setIsFloating] = useState(true);

    function handleScroll() {
        if (window.scrollY > 50) {
            setIsFloating(false); // If scrolled down, make the header non-floating
        } else {
            setIsFloating(true); // If at the top, make the header floating again
        }
    }
    
    useEffect(() => {
        handleScroll(); // Initial check to set the header state
    
        // Add event listener on mount
        window.addEventListener('scroll', handleScroll);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className={`transition-all duration-300 ${
        isFloating
          ? 'top-8 left-8 right-8 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-xl shadow-black/20 fixed flex flex-row items-center text-white pl-4 p-1 z-50'
          : 'fixed flex flex-row items-center top-0 left-0 right-0 bg-zinc-950 text-white px-3 p-1 z-50 border-zinc-950'
      }`}>
                <div className="font-[Boldonse] text-lg text-blue-200 select-none">NAALI</div>
                <div className="flex-grow gap-0 flex flex-row justify-center">
                    <Link to="/" className={`text-white p-3 rounded-lg border border-transparent ${
                        isFloating
                            ? 'hover:bg-zinc-950/50 hover:border-zinc-900'
                            : 'hover:bg-zinc-900'
                        }`}>Library</Link>
                    <Link to="/licenses" className={`text-white p-3 rounded-lg border border-transparent ${
                        isFloating
                            ? 'hover:bg-zinc-950/50 hover:border-zinc-900'
                            : 'hover:bg-zinc-900'
                        }`}>Licenses</Link>
                    <a href="https://jinxxy.com/Marakusa/products" target="_blank" className={`text-white p-3 rounded-lg border border-transparent ${
                        isFloating
                            ? 'hover:bg-zinc-950/50 hover:border-zinc-900'
                            : 'hover:bg-zinc-900'
                        }`}>Jinxxy</a>
                    <a href="https://marakusa.gumroad.com" target="_blank" className={`text-white p-3 rounded-lg border border-transparent ${
                        isFloating
                            ? 'hover:bg-zinc-950/50 hover:border-zinc-900'
                            : 'hover:bg-zinc-900'
                        }`}>Gumroad</a>
                    <a href="https://marakusa.lemonsqueezy.com" target="_blank" className={`text-white p-3 rounded-lg border border-transparent ${
                        isFloating
                            ? 'hover:bg-zinc-950/50 hover:border-zinc-900'
                            : 'hover:bg-zinc-900'
                        }`}>Lemon Squeezy</a>
                </div>
                <div>
                    {profile.fetched ? profile.data ? (
                        <div id="profile-button" onClick={toggleProfileMenu} className="flex flex-row items-center cursor-pointer select-none p-2 rounded-3xl hover:bg-zinc-950/50 border border-transparent hover:border-zinc-900">
                            <img id="profile-button-img" src={
                                (profile.data as Profile).avatar.startsWith("https://") || (profile.data as Profile).avatar.startsWith("/") ? 
                                (profile.data as Profile).avatar : 
                                `https://cdn.discordapp.com/avatars/${(profile.data as Profile).discord_id}/${(profile.data as Profile).avatar}.png`} alt="Avatar" className="w-8 h-8 rounded-full" />
                            <p id="profile-button-text" className="text-white ml-3">{(profile.data as Profile).username}</p>
                        </div>
                    ) : (
                        <Link to="/signin" className="text-white ml-3 p-3 rounded-3xl hover:bg-zinc-950/50 border border-transparent hover:border-zinc-900">Sign In</Link>
                    ) : (<></>)}
                </div>
            </div>
            {profileMenu ? (
                <div id="profile-menu" className={`fixed flex flex-col p-0 bg-zinc-900 text-white rounded-3xl shadow-lg shadow-black/20 border border-zinc-800 z-100 text-left ${isFloating ? 'top-26 right-8' : 'top-16 right-2'}`}>
                    <Link to="/profile" className="text-white hover:bg-zinc-800/20 p-5 py-2 rounded-t-3xl" onClick={toggleProfileMenu}>Profile</Link>
                    <Link to="/settings" className="text-white hover:bg-zinc-800/20 p-5 py-2" onClick={toggleProfileMenu}>Settings</Link>
                    <hr className="border-zinc-700" />
                    <a href="/auth?signout=1" className="text-white hover:bg-zinc-800/20 p-5 py-2 rounded-b-3xl">Sign Out</a>
                </div>
            ) : (<></>)}
        </>
    );
}

export default Header;
