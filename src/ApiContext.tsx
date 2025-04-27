import { apiPath } from "./public.config.json";
import React, { createContext, useContext } from "react";

export interface ApiResponseType<T> {
    error: string | null;
    data?: T;
}

export interface ProfileType {
    userId: string;
    username: string;
    avatar: string;
    discord_id?: string;
}
export interface SessionProfileType {
    fetched: boolean;
    data: ProfileType | null;
}

export interface AuthDiscordType {
    auth: string | null;
    token: string | null;
}

export interface LicenseType {
    createdAt: string;
    product_id: string;
    internal_product_id: string;
    license_key: string;
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: any[];
    user_id: {
        email: string;
        discord_id: string;
        gumroad_id: string;
        createdAt: string;
        $id: string;
        $createdAt: string;
        $updatedAt: string;
        $permissions: any[];
        $databaseId: string;
        $collectionId: string;
    };
    $databaseId: string;
    $collectionId: string;
}
export interface LicensesType {
    licenses: LicenseType[];
    message: string;
}

export interface RedeemLicenseType {
    market_platform: string | null;
    product_id: string | null;
    license_key: string | null;
    auth: string | null;
    token: string | null;
}

export interface SessionListType {
    sessions: {
        id: string;
        session_info: string;
        location: string | null;
        last_activity: string;
        current_session: boolean;
    }[];
}

export interface DownloadTokenType {
    downloadId: string;
    token: string;
    downloadUrl: string;
}

interface ApiContextType {
    api: {
        authenticateDiscord: (code: string | null, state: string | null) => Promise<ApiResponseType<AuthDiscordType>>;
        disconnectDiscord: (auth: string | null, token: string | null) => Promise<ApiResponseType<any>>;
        profileDiscord: (auth: string | null, token: string | null) => Promise<ApiResponseType<ProfileType>>;
        listLicenses: (auth: string | null, token: string | null) => Promise<ApiResponseType<LicensesType>>;
        redeemLicense: (marketPlatform: string | null, productId: string | null, licenseKey: string | null, auth: string | null, token: string | null) => Promise<ApiResponseType<RedeemLicenseType>>;
        listSessions: (auth: string | null, token: string | null) => Promise<ApiResponseType<SessionListType>>;
        signOutSession: (auth: string | null, token: string | null, session_id: string | null) => Promise<ApiResponseType<any>>;
        generateDownloadToken: (product: string | null, file: string | null, archived: boolean, auth: string | null, token: string | null) => Promise<ApiResponseType<DownloadTokenType>>;
    };
}

const ApiContext = createContext<ApiContextType | null>(null);

const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const api = {
        authenticateDiscord: async (code: string | null, state: string | null) => {
            try {
                const response = await fetch(`${apiPath}/api/v1/auth/discord`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code, state }),
                });
                const data = await response.json();
                if (!response.ok) {
                    return { error: data.error || "Unknown error" };
                }
                return { error: null, data: data };
            } catch (error) {
                return { error: error instanceof Error ? error.message : "Unknown error" };
            }
        },
        disconnectDiscord: async (auth: string | null, token: string | null) => {
            try {
                const response = await fetch(`${apiPath}/api/v1/disconnect/discord`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ auth, token }),
                });
                const data = await response.json();
                if (!response.ok) {
                    return { error: data.error || "Unknown error" };
                }
                return { error: null, data: null };
            } catch (error) {
                return { error: error instanceof Error ? error.message : "Unknown error" };
            }
        },
        profileDiscord: async (auth: string | null, token: string | null) => {
            try {
                const response = await fetch(`${apiPath}/api/v1/profile/discord`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ auth, token }),
                });
                const data = await response.json();
                if (!response.ok) {
                    return { error: data.error || "Unknown error" };
                }
                return { error: null, data: data.profile };
            } catch (error) {
                return { error: error instanceof Error ? error.message : "Unknown error" };
            }
        },
        listLicenses: async (auth: string | null, token: string | null) => {
            try {
                const response = await fetch(`${apiPath}/api/v1/license/list`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ auth, token }),
                });
                const data = await response.json();
                if (!response.ok) {
                    return { error: data.error || "Unknown error" };
                }
                return { error: null, data: data };
            } catch (error) {
                return { error: error instanceof Error ? error.message : "Unknown error" };
            }
        },
        redeemLicense: async (marketPlatform: string | null, productId: string | null, licenseKey: string | null, auth: string | null, token: string | null) => {
            try {
                const response = await fetch(`${apiPath}/api/v1/license/redeem`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        market_platform: marketPlatform,
                        product_id: productId,
                        license_key: licenseKey,
                        auth,
                        token,
                    }),
                });
                const data = await response.json();
                if (!response.ok) {
                    return { error: data.error || "Unknown error" };
                }
                return { error: null, data: data };
            } catch (error) {
                return { error: error instanceof Error ? error.message : "Unknown error" };
            }
        },
        listSessions: async (auth: string | null, token: string | null) => {
            try {
                const response = await fetch(`${apiPath}/api/v1/sessions/list`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ auth, token }),
                });
                const data = await response.json();
                if (!response.ok) {
                    return { error: data.error || "Unknown error" };
                }
                return { error: null, data: data };
            } catch (error) {
                return { error: error instanceof Error ? error.message : "Unknown error" };
            }
        },
        signOutSession: async (auth: string | null, token: string | null, session_id: string | null = null) => {
            try {
                const response = await fetch(`${apiPath}/api/v1/sessions/signout`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ auth, token, session_id }),
                });
                const data = await response.json();
                if (!response.ok) {
                    return { error: data.error || "Unknown error" };
                }
                return { error: null, data: data.data };
            } catch (error) {
                return { error: error instanceof Error ? error.message : "Unknown error" };
            }
        },
        generateDownloadToken: async (product: string | null, file: string | null, archived: boolean, auth: string | null, token: string | null) => {
            try {
                const response = await fetch(`${apiPath}/api/v1/file/download`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        product,
                        file,
                        archived,
                        auth,
                        token,
                    }),
                });
                const data = await response.json();
                if (!response.ok) {
                    return { error: data.error || "Unknown error" };
                }
                return { error: null, data: data };
            } catch (error) {
                return { error: error instanceof Error ? error.message : "Unknown error" };
            }
        },
    };

    return <ApiContext.Provider value={{ api }}>{children}</ApiContext.Provider>;
};

const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error("useApi must be used within an ApiProvider");
    }
    return context;
};

export { ApiProvider, useApi };