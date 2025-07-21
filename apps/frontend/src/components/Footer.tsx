import { PenTool, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  EMAIL_ADDRESS,
  LINKEDIN_URL,
  TWITTER_URL,
  FRONTEND_ENDPOINTS,
} from "../constants";
import { useContext } from "react";
import { AuthContext } from "../Contexts";

type Link = {
  href: string;
  label: string;
};

const PRODUCT_LINKS: Link[] = [
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#pricing",
    label: "Pricing",
  },
  {
    href: "#demo",
    label: "Demo",
  },
];

const IMPORTANT_LINKS: Link[] = [
  {
    href: FRONTEND_ENDPOINTS.TERMS,
    label: "Terms of Service",
  },
  {
    href: FRONTEND_ENDPOINTS.PRIVACY,
    label: "Privacy Policy",
  },
  {
    href: FRONTEND_ENDPOINTS.CANCELLATION,
    label: "Cancellation and Refund Policy",
  },
  {
    href: FRONTEND_ENDPOINTS.CONTACT,
    label: "Contact",
  },
];

export const Footer: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext)!;
  return (
    <footer className="bg-neutral-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-500 p-2 rounded-lg shadow-soft">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-orange-400">
                CoverGenius
              </span>
            </div>
            <p className="text-neutral-400 mb-6">
              Revolutionizing job applications with AI-powered cover letter
              generation.
            </p>
            <div className="flex space-x-4">
              <a
                href={TWITTER_URL}
                className="text-neutral-400 hover:text-orange-500 transition-colors focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded"
              >
                <div className="size-6">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </div>
              </a>
              <a
                href={LINKEDIN_URL}
                className="text-neutral-400 hover:text-purple-500 transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded"
              >
                <div className="size-6">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.335 18.339H15.67v-4.177c0-1.005-.022-2.3-1.403-2.3-1.402 0-1.616 1.095-1.616 2.225v4.252h-2.663V9.75h2.556v1.17h.036c.36-.685 1.235-1.406 2.544-1.406 2.717 0 3.222 1.79 3.222 4.11v4.715zM7.003 8.575a1.548 1.548 0 01-1.548-1.551 1.548 1.548 0 111.547 1.55zm1.336 9.764H5.666V9.75H8.34v8.589zM19.67 3H4.329C3.593 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.338C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.666 3h.003z" />
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Product */}
          {location.pathname === FRONTEND_ENDPOINTS.LANDING && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                {PRODUCT_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-neutral-400 hover:text-orange-500 transition-colors focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {isAuthenticated && (
                <>
                  <li>
                    <Link
                      to={FRONTEND_ENDPOINTS.GENERATOR}
                      className="text-neutral-400 hover:text-purple-500 transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded"
                    >
                      Cover Letter Generator
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={FRONTEND_ENDPOINTS.CREDITS_SHOP}
                      className="text-neutral-400 hover:text-purple-500 transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded"
                    >
                      Pricing
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  to={FRONTEND_ENDPOINTS.CONTACT}
                  className="text-neutral-400 hover:text-purple-500 transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Important Links</h4>
            <ul className="space-y-2">
              {IMPORTANT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-neutral-400 hover:text-green-500 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              &copy; {new Date().getFullYear()} CoverGenius. All rights
              reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="text-neutral-400 hover:text-orange-500 transition-colors flex items-center focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded"
              >
                <Mail className="w-4 h-4 mr-2" />
                {EMAIL_ADDRESS}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
