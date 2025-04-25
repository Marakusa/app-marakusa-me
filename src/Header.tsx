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
  const [profileMenu, setProfileMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

    if (profile.fetched === false) {
        fetchProfile();
    }

  const toggleProfileMenu = () => setProfileMenu(!profileMenu);
  const toggleMobileMenu = () => setMobileMenu(!mobileMenu);

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
    { to: "https://jinxxy.com/Marakusa/products", label: "Jinxxy", external: true },
    { to: "https://marakusa.gumroad.com", label: "Gumroad", external: true },
    { to: "https://marakusa.lemonsqueezy.com", label: "Lemon Squeezy", external: true },
  ];

  const navClasses = isFloating ?
    'text-white p-3 rounded-lg border border-transparent hover:bg-zinc-950/50 hover:border-zinc-900' :
    'text-white p-3 rounded-lg border border-transparent hover:bg-zinc-900';

  return (
    <header className={
      `transition-all duration-300 fixed z-50 ${isFloating ? 'top-8 left-8 right-8 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-xl shadow-black/20' : 'top-4 left-8 right-8 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-xl shadow-black/20'}`
    }>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="font-[Boldonse] text-lg text-blue-200 select-none">NAALI</div>

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
          {profile.fetched ? (
            profile.data ? (
              <div id="profile-button" onClick={toggleProfileMenu} className="flex items-center cursor-pointer select-none p-2 rounded-3xl hover:bg-zinc-950/50 border border-transparent hover:border-zinc-900">
                <img src={
                  (profile.data as Profile).avatar.startsWith("https://") || (profile.data as Profile).avatar.startsWith("/")
                    ? (profile.data as Profile).avatar
                    : `https://cdn.discordapp.com/avatars/${(profile.data as Profile).discord_id}/${(profile.data as Profile).avatar}.png`
                } alt="Avatar" className="w-8 h-8 rounded-full" />
                <p className="text-white ml-3 hidden lg:block">{(profile.data as Profile).username}</p>
              </div>
            ) : (
              <Link to="/signin" className="text-white p-3 rounded-3xl hover:bg-zinc-950/50 border border-transparent hover:border-zinc-900">Sign In</Link>
            )
          ) : null}

          {/* Mobile burger */}
          <button onClick={toggleMobileMenu} className="md:hidden p-2 rounded-lg hover:bg-zinc-950/50 border border-transparent hover:border-zinc-900">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenu && (
        <nav className="md:hidden bg-zinc-900 border-t border-zinc-800 rounded-b-3xl">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.label} className="">
                {link.external ? (
                  <a
                    href={link.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-white px-4 py-3 border border-zinc-800 hover:bg-zinc-700/50 ${
                      links[links.length - 1].label === link.label ? "rounded-b-3xl" : ""
                    }`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link to={link.to} onClick={toggleMobileMenu} className="block text-white px-4 py-3 border border-zinc-800 hover:bg-zinc-700/50">
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
        <div id="profile-menu" className={`fixed flex flex-col p-0 bg-zinc-900 text-white rounded-3xl shadow-lg shadow-black/20 border border-zinc-800 z-50 ${isFloating ? 'top-26 right-8' : 'top-16 right-2'}`}>
          <Link to="/profile" className="hover:bg-zinc-800/20 p-5 py-2 rounded-t-3xl" onClick={toggleProfileMenu}>Profile</Link>
          <Link to="/settings" className="hover:bg-zinc-800/20 p-5 py-2" onClick={toggleProfileMenu}>Settings</Link>
          <hr className="border-zinc-700" />
          <a href="/auth?signout=1" className="hover:bg-zinc-800/20 p-5 py-2 rounded-b-3xl">Sign Out</a>
        </div>
      )}
    </header>
  );
}

export default Header;
