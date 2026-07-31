import { useEffect, useState } from "react";
import { useApi } from '../ApiContext';
import { useSearchParams } from "react-router";
import { Link } from "react-router-dom";

function ToolAuth() {
  const [searchParams] = useSearchParams();
  const callback = searchParams.get("callback");
  const state = searchParams.get("state");
  const prompt = searchParams.get("prompt");

  const { api } = useApi();

  const [auth, setAuth] = useState<{
    authenticated: boolean;
    error: string | null;
  }>({
    authenticated: false,
    error: null
  });

  if (!callback || !state) {
    return (
      <>
        <title>Dashboard - Authenticate Tool</title>
        <div className="mx-8 md:m-auto md:w-150 flex flex-col items-center justify-center h-auto bg-zinc-900 text-zinc-300 gap-2 p-8 rounded-3xl shadow-lg shadow-black/20">

          <p>Invalid request</p>

        </div>
      </>
    );
  }

  async function authenticate() {
    if (!callback || !state) {
      setAuth({
        authenticated: false,
        error: "Invalid request. Missing callback or state."
      });
      return;
    }

    try {
      const result = await api.generateToolToken(localStorage.getItem("auth"), localStorage.getItem("token"));

      if (!result.data || !result.data.code || result.error) {
        setAuth({
          authenticated: false,
          error: result.error || "Authentication failed. Please try again."
        });
        const url = new URL(callback);
        url.searchParams.set("error", result.error || "Authentication failed. Please try again.");
        window.location.href = url.toString();
        return;
      }

      setAuth({
        authenticated: true,
        error: null
      });

      // Redirect to callback URL with code and state
      const url = new URL(callback);
      url.searchParams.set("code", result.data.code);
      url.searchParams.set("state", state);
      window.location.href = url.toString();
    } catch (error) {
      setAuth({
        authenticated: false,
        error: "Authentication failed. Please try again."
      });
      const url = new URL(callback);
      url.searchParams.set("error", "Authentication failed. Please try again.");
      window.location.href = url.toString();
    }
  }

  if (prompt === "none") {
    useEffect(() => {
      authenticate();
    }, []);

    return (
      <>
        <title>Dashboard - Authenticate Tool</title>
        <div className="mx-8 md:m-auto md:w-150 flex flex-col items-center justify-center h-auto bg-zinc-900 text-zinc-300 gap-2 p-8 rounded-3xl shadow-lg shadow-black/20">
          {auth.error ?
            <div>
              <p className="text-red-400">Authentication failed. Please try again...</p>
              <p className="text-red-400">{auth.error}</p>
            </div> :
            <p>Please wait...</p>}
        </div>
      </>
    );
  }

  return (
    <>
      <title>Dashboard - Authenticate Tool</title>
      <div className="mx-8 md:m-auto md:w-150 flex flex-col items-center justify-center h-auto bg-zinc-900 text-zinc-300 gap-2 p-8 rounded-3xl shadow-lg shadow-black/20">

        <p>An external application</p>
        <p className="text-xl font-bold">Maras Tool Installer</p>
        <p>wants to authenticate with your account</p>

        {auth.error && <div>
          <p className="text-red-400">Authentication failed. Please try again...</p>
          <p className="text-red-400">{auth.error}</p>
        </div>}

        <div className="flex gap-4 justify-between w-full mt-4">
          <Link to="/" className="text-sm bg-zinc-800 text-zinc-300 px-5 py-3 rounded-full hover:bg-zinc-800/70 cursor-pointer transition-colors w-full">
            Cancel
          </Link>
          <button onClick={() => {
            authenticate();
          }} className="text-sm bg-blue-800 text-zinc-300 px-5 py-3 rounded-full hover:bg-blue-800/70 cursor-pointer transition-colors w-full">
            Authenticate
          </button>
        </div>
      </div>
    </>
  );
}

export default ToolAuth;
