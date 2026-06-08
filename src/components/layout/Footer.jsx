import {
    LuFacebook,
    LuInstagram,
    LuTwitter,
    LuYoutube,
} from "react-icons/lu";
import { LogoText } from "@/components/ui";

const Footer = () => {
    return (
        <footer className="bg-blue-50">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-4">
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
                            <a href="#" className="hover:text-slate-900">
                                Buy car
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-slate-900">
                                Trade-in cars
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-slate-900">
                                Promo vouchers
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-slate-900">
                                Compare cars
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold text-slate-900">Others</h3>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        <li>
                            <a href="#" className="hover:text-slate-900">
                                Contact us
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-slate-900">
                                Privacy policy
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-slate-900">
                                Terms & condition
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold text-slate-900">Follow us</h3>
                    <div className="mt-3 flex gap-3">
                        <a
                            href="#"
                            aria-label="Twitter"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-400 text-white"
                        >
                            <LuTwitter className="h-4 w-4" />
                        </a>
                        <a
                            href="#"
                            aria-label="Facebook"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white"
                        >
                            <LuFacebook className="h-4 w-4" />
                        </a>
                        <a
                            href="#"
                            aria-label="Instagram"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-purple-500 via-pink-500 to-orange-400 text-white"
                        >
                            <LuInstagram className="h-4 w-4" />
                        </a>
                        <a
                            href="#"
                            aria-label="YouTube"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white"
                        >
                            <LuYoutube className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
