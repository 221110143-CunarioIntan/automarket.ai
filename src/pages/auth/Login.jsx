import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Input, InputPassword } from "@/components/ui";
import { supabase } from "@/lib/supabase";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setSubmitting(false);

        if (authError) {
            setError(authError.message);
            return;
        }

        navigate("/");
    };

    return (
        <>
            <div className="mb-8 text-center">
                <h1 className="mb-2 text-3xl font-bold text-slate-900">
                    Welcome to Automarket
                </h1>
                <p className="text-sm text-slate-500">
                    Enter and find your dream vehicle now.
                </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Input your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <InputPassword
                    label="Password"
                    id="password"
                    autoComplete="current-password"
                    placeholder="Input your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div className="flex items-center justify-between text-sm">
                    <Checkbox>Remember me</Checkbox>
                    <a
                        href="#"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Forgot password?
                    </a>
                </div>

                {error && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                        {error}
                    </p>
                )}

                <Button
                    type="submit"
                    className="mt-4 w-full"
                    disabled={submitting}
                >
                    {submitting ? "Signing in..." : "Login"}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Do you not have an account yet?{" "}
                <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:underline"
                >
                    Register here
                </Link>
            </p>
        </>
    );
};

export default Login;
