import { Sparkles, Shield, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Sparkles size={24} className="text-purple-500 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                CoverGenius
              </span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              AI-powered cover letter generation that helps you land your dream
              job. Professional, personalized, and ready in seconds.
            </p>
            <div className="flex items-center">
              <Shield size={16} className="text-green-500 mr-2" />
              <span className="text-sm text-slate-400">
                Your data is secure and never shared with third parties
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              More Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.overleaf.com/latex/templates/tagged/cv"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Resume Templates
                  <ExternalLink
                    size={14}
                    className="inline-block ml-1 text-slate-500 group-hover:text-white"
                  />
                </a>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors group"
                >
                  Terms of Service
                  <ExternalLink
                    size={14}
                    className="inline-block ml-1 text-slate-500 group-hover:text-white"
                  />
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-slate-400 hover:text-white transition-colors group"
                >
                  Privacy Policy
                  <ExternalLink
                    size={14}
                    className="inline-block ml-1 text-slate-500 group-hover:text-white"
                  />
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Cookie Settings
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} CoverGenius AI. All rights
            reserved.
          </p>

          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="https://x.com/theprinceraj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300"
            >
              <span className="sr-only">Twitter</span>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/theprinceraj/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300"
            >
              <span className="sr-only">LinkedIn</span>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.335 18.339H15.67v-4.177c0-1.005-.022-2.3-1.403-2.3-1.402 0-1.616 1.095-1.616 2.225v4.252h-2.663V9.75h2.556v1.17h.036c.36-.685 1.235-1.406 2.544-1.406 2.717 0 3.222 1.79 3.222 4.11v4.715zM7.003 8.575a1.548 1.548 0 01-1.548-1.551 1.548 1.548 0 111.547 1.55zm1.336 9.764H5.666V9.75H8.34v8.589zM19.67 3H4.329C3.593 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.338C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.666 3h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
