import { Link } from "react-router-dom";
import { Button, Checkbox, Input, InputPassword } from "@/components/ui";

const Login = () => {
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
                    autoComplete="current-password"
                    placeholder="Input your password"
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

                <Button type="submit" className="mt-4 w-full">
                    Login
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
