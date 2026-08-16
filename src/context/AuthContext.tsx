import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    FC,
    ReactNode,
} from "react";

export type UserRole = "homeowner" | "contractor" | "admin";

export interface Session {
    role: UserRole;
    token: string;
    profile: any;
}

interface AuthContextValue {
    session: Session | null;
    isLoading: boolean;
    login: (role: UserRole, token: string, profile: any) => void;
    logout: () => void;
    updateProfile: (profile: any) => void;
}

const STORAGE_KEY = "ff_session";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setSession(JSON.parse(stored));
            }
        } catch (err) {
            console.error("Failed to read session", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(
        (role: UserRole, token: string, profile: any) => {
            const next: Session = { role, token, profile };
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            setSession(next);
        },
        []
    );

    const logout = useCallback(() => {
        window.localStorage.removeItem(STORAGE_KEY);
        setSession(null);
    }, []);

    const updateProfile = useCallback((profile: any) => {
        setSession((prev) => {
            if (!prev) return prev;
            const next = { ...prev, profile };
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    return (
        <AuthContext.Provider
            value={{ session, isLoading, login, logout, updateProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
};
