import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Input, InputPassword } from "@/components/ui";
import { authErrorMessage } from "@/lib/authError";
import { supabase } from "@/lib/supabase";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirm) {
            setError("Konfirmasi password tidak cocok.");
            return;
        }
        if (!agreed) {
            setError("Anda harus menyetujui Terms dan Privacy Policy.");
            return;
        }

        setSubmitting(true);
        const { error: authError } = await supabase.auth.signUp({
            email,
            password,
        });
        setSubmitting(false);

        if (authError) {
            setError(authErrorMessage(authError));
            return;
        }

        navigate("/login");
    };

    return (
        <>
            <div className="mb-8 text-center">
                <h1 className="mb-2 text-3xl font-bold text-slate-900">
                    Create your account
                </h1>
                <p className="text-sm text-slate-500">
                    Join Automarket and start exploring.
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
                    autoComplete="new-password"
                    placeholder="Input your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <InputPassword
                    label="Confirm password"
                    id="confirm-password"
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                />

                <Checkbox
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                >
                    I agree to the{" "}
                    <a
                        href="#"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Terms
                    </a>{" "}
                    and{" "}
                    <a
                        href="#"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Privacy Policy
                    </a>
                </Checkbox>

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
                    {submitting ? "Creating account..." : "Register"}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:underline"
                >
                    Login here
                </Link>
            </p>
        </>
    );
};

export default Register;
