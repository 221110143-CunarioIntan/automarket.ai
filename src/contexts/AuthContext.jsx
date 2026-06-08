import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });

        const { data } = supabase.auth.onAuthStateChange((_event, next) => {
            setSession(next);
        });

        return () => data.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!session?.user) {
            setProfile(null);
            return;
        }
        let cancelled = false;
        supabase
            .from("users")
            .select("id, email, name, role")
            .eq("id", session.user.id)
            .single()
            .then(({ data }) => {
                if (!cancelled) setProfile(data);
            });
        return () => {
            cancelled = true;
        };
    }, [session]);

    const value = {
        session,
        user: session?.user ?? null,
        profile,
        role: profile?.role ?? null,
        loading,
        signOut: () => supabase.auth.signOut(),
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
