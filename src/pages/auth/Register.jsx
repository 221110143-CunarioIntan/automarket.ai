import { Link } from "react-router-dom";
import { Button, Checkbox, Input, InputPassword } from "@/components/ui";

const Register = () => {
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

            <form className="space-y-4">
                <Input
                    label="Email"
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Input your email"
                />

                <InputPassword
                    label="Password"
                    id="password"
                    autoComplete="new-password"
                    placeholder="Input your password"
                />

                <InputPassword
                    label="Confirm password"
                    id="confirm-password"
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                />

                <Checkbox>
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

                <Button type="submit" className="mt-4 w-full">
                    Register
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
