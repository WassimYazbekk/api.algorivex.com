import http from "@/axios-client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{
    currentUser: TUser | null;
    setCurrentUser: (arg0: TUser | null) => void;
    authToken: string | null;
    setAuthToken: (arg0: string | null) => void;
}>({
    currentUser: null,
    setCurrentUser: () => {},
    authToken: null,
    setAuthToken: () => {},
});

export type TUser = {
    name: string;
    email: string;
};

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const _authToken =
        localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_NAME) || null;
    const [currentUser, setCurrentUser] = useState<TUser | null>(null);
    const [authToken, _setAuthToken] = useState<string | null>(_authToken);

    useEffect(() => {
        if (authToken) {
            http.get("user")
                .then((res) => {
                    setCurrentUser(res.data);
                })
                .catch((err) => console.error(err));
        }
    }, []);

    function setAuthToken(token: string | null) {
        if (token)
            localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_NAME, token);
        else localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_NAME);

        _setAuthToken(token);
    }
    return (
        <AuthContext.Provider
            value={{ currentUser, setCurrentUser, authToken, setAuthToken }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
