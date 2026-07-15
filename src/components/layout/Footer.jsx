import { Link } from "react-router-dom";
import { LogoText } from "@/components/ui";

const Footer = () => {
    return (
        <footer className="bg-blue-50">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-3">
                <div>
                    <LogoText className="text-xl" />
                    <p className="mt-3 text-xs text-slate-500">
                        Copyright © 2026 Automarket all rights reserved.
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold text-slate-900">Services</h3>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        <li>
                            <Link
                                to="/vehicles?type=CAR"
                                className="hover:text-slate-900"
                            >
                                Buy car
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/vehicles?type=MOTOR"
                                className="hover:text-slate-900"
                            >
                                Buy motor
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/compare"
                                className="hover:text-slate-900"
                            >
                                Compare vehicle
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold text-slate-900">Others</h3>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        <li>
                            <Link
                                to="/contact"
                                className="hover:text-slate-900"
                            >
                                Contact us
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/privacy"
                                className="hover:text-slate-900"
                            >
                                Privacy policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/terms"
                                className="hover:text-slate-900"
                            >
                                Terms & condition
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
