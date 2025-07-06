import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    username: string;
    access_token: string;
    refresh_token: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    login: (userData: User) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    updateTokens: (access_token: string, refresh_token: string) => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: (userData: User) => {
                // Store tokens in localStorage and cookies for compatibility
                localStorage.setItem("access_token", userData.access_token);
                localStorage.setItem("refresh_token", userData.refresh_token);
                document.cookie = `auth_token=${userData.access_token}; path=/; max-age=86400;`;

                set({
                    user: userData,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            logout: () => {
                // Clear tokens from localStorage and cookies
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                document.cookie =
                    "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },

            updateTokens: (access_token: string, refresh_token: string) => {
                const currentUser = get().user;
                if (currentUser) {
                    // Update tokens in localStorage and cookies
                    localStorage.setItem("access_token", access_token);
                    localStorage.setItem("refresh_token", refresh_token);
                    document.cookie = `auth_token=${access_token}; path=/; max-age=86400;`;

                    set({
                        user: {
                            ...currentUser,
                            access_token,
                            refresh_token,
                        },
                    });
                }
            },
        }),
        {
            name: "auth-storage", // unique name for localStorage key
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }), // only persist these fields
        }
    )
);

export default useAuthStore;
