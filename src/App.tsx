import "./App.css";
import { Routes, Route } from "react-router-dom";
import Library from "./pages/Library";
import Licenses from "./pages/Licenses";
import SignIn from "./pages/SignIn";
import Header from "./Header";
import Auth from "./pages/Auth";
import { ProfileProvider } from "./ProfileContext";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Resources from "./pages/Resources";
import TermsOfService from "./pages/TermsOfService";
import RedeemTutorial from "./pages/RedeemTutorial";
import Docs from "./pages/Docs";
import Faq from "./pages/Faq";
import { SessionProvider } from "./SessionContext";
import { ApiProvider } from "./ApiContext";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <>
      <meta name="title" content="Dashboard - Marakusa" />

      <ApiProvider>
        <SessionProvider>
          <ProfileProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Library />} />
              <Route path="/licenses" element={<Licenses />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/archived" element={<Library archived />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/tos" element={<TermsOfService />} />
              <Route path="/product/:currentProductId" element={<Library />} />
              <Route path="/tutorial/redeem" element={<RedeemTutorial />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/docs/faq" element={<Faq />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ProfileProvider>
        </SessionProvider>
      </ApiProvider>
    </>
  );
}
