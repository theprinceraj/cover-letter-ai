import React from "react";
import { ArrowLeft, Mail, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EMAIL_ADDRESS } from "../constants";

export const ContactMe: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-400 hover:text-slate-200 transition-colors mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Contact</h1>
          <p className="text-slate-400">
            Have questions, feedback, or need support? Reach out to me!
          </p>
        </div>

        {/* Contact Options */}
        <div className="flex flex-col gap-6">
          {/* X (Twitter) Profile Card */}
          <div className="bg-slate-900 rounded-lg p-6 flex items-center gap-4 shadow">
            <img
              src="https://unavatar.io/x/theprinceraj"
              alt="X Profile Avatar"
              className="w-16 h-16 rounded-full border border-slate-700"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg text-white">
                  @theprinceraj
                </span>
                <a
                  href="https://x.com/theprinceraj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline flex items-center"
                >
                  <Twitter size={18} className="mr-1" />
                  Visit Profile
                </a>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                DM me on X for the fastest response!
              </p>
              <a
                href="https://x.com/messages/compose?recipient_id=theprinceraj"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded transition-colors text-sm font-medium"
              >
                Send Direct Message
              </a>
            </div>
          </div>

          {/* Email Option */}
          <div className="bg-slate-900 rounded-lg p-6 flex items-center gap-4 shadow">
            <Mail size={28} className="text-slate-400" />
            <div>
              <div className="font-semibold text-white">Email</div>
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="text-sky-400 hover:underline"
              >
                Drop me an email now!
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
