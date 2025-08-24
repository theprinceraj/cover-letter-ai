import React from "react";
import { TwitterIcon, ClockIcon, HelpCircleIcon, MessageCircleIcon, MailIcon, ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EMAIL_ADDRESS } from "../constants";
import { SEO } from "../components/ui/seo";

export const ContactUs: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <SEO
                title="Contact Us - CoverGenius AI"
                description="Get in touch with the CoverGenius AI team. We're here to help with any questions, feedback, or support you may need."
                name="CoverGenius AI"
                type="website"
            />
            <div className="min-h-screen bg-slate-950 text-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-slate-400 hover:text-slate-200 transition-colors mb-4">
                            <ArrowLeftIcon size={20} className="mr-2" />
                            Back
                        </button>
                        <h1 className="text-3xl font-bold text-white mb-2">Contact Us</h1>
                        <p className="text-slate-400">Have questions, feedback, or need support? We're here to help!</p>
                    </div>

                    {/* Introduction Section */}
                    <div className="bg-slate-900 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Get in Touch</h2>
                        <p className="text-slate-300 mb-4">
                            Whether you have questions about our AI-powered cover letter generation service, need
                            technical support, want to provide feedback, or have concerns about your account, we're here
                            to assist you. We believe in providing excellent customer service and ensuring you have the
                            best experience with CoverGenius.
                        </p>
                        <p className="text-slate-300">
                            For the fastest response, we recommend reaching out via X (Twitter) direct message. You can
                            also email us if you prefer a more detailed conversation or need to share attachments.
                        </p>
                    </div>

                    {/* Contact Options */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* X (Twitter) Profile Card */}
                        <div className="bg-slate-900 rounded-lg p-6 shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src="https://unavatar.io/x/theprinceraj"
                                    alt="X Profile"
                                    className="w-16 h-16 rounded-full border border-slate-700"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-lg text-white">@theprinceraj</span>
                                        <a
                                            href="https://x.com/theprinceraj"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sky-400 hover:underline flex items-center">
                                            <TwitterIcon size={18} className="mr-1" />
                                            Visit Profile
                                        </a>
                                    </div>
                                    <p className="text-slate-400 text-sm">Founder & Developer</p>
                                </div>
                            </div>
                            <p className="text-slate-300 text-sm mb-4">
                                DM me on X for the fastest response! I'm usually available during business hours and try
                                to respond to all messages within a few hours.
                            </p>
                            <a
                                href="https://x.com/messages/compose?recipient_id=theprinceraj"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block w-full text-center px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded transition-colors font-medium">
                                <MessageCircleIcon size={18} className="inline mr-2" />
                                Send Direct Message
                            </a>
                        </div>

                        {/* Email Option */}
                        <div className="bg-slate-900 rounded-lg p-6 shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <MailIcon size={28} className="text-slate-400" />
                                <div>
                                    <div className="font-semibold text-white">Email Support</div>
                                    <p className="text-slate-400 text-sm">For detailed inquiries</p>
                                </div>
                            </div>
                            <p className="text-slate-300 text-sm mb-4">
                                Perfect for longer conversations, sharing screenshots, or when you need to provide
                                detailed information about your issue or request.
                            </p>
                            <a
                                href={`mailto:${EMAIL_ADDRESS}`}
                                className="inline-block w-full text-center px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors font-medium">
                                <MailIcon size={18} className="inline mr-2" />
                                Send Email
                            </a>
                        </div>
                    </div>

                    {/* What We Can Help With */}
                    <div className="bg-slate-900 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">How Can We Help?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                                    <HelpCircleIcon size={20} className="mr-2 text-sky-400" />
                                    Technical Support
                                </h3>
                                <ul className="text-slate-300 text-sm space-y-2">
                                    <li>• Account access issues</li>
                                    <li>• Credit package problems</li>
                                    <li>• File upload difficulties</li>
                                    <li>• AI generation errors</li>
                                    <li>• Browser compatibility</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                                    <MessageCircleIcon size={20} className="mr-2 text-sky-400" />
                                    General Inquiries
                                </h3>
                                <ul className="text-slate-300 text-sm space-y-2">
                                    <li>• Feature requests</li>
                                    <li>• Pricing questions</li>
                                    <li>• Refund requests</li>
                                    <li>• Partnership opportunities</li>
                                    <li>• Feedback and suggestions</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Response Times */}
                    <div className="bg-slate-900 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <ClockIcon size={20} className="mr-2 text-sky-400" />
                            Response Times
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-sky-400 mb-1">X DM</div>
                                <div className="text-slate-300 text-sm">Usually within 2-4 hours</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-sky-400 mb-1">Email</div>
                                <div className="text-slate-300 text-sm">Within 24 hours</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-sky-400 mb-1">Weekends</div>
                                <div className="text-slate-300 text-sm">May take longer</div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-slate-900 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Before You Contact Us</h2>
                        <p className="text-slate-300 mb-4">
                            To help us assist you more efficiently, please have the following information ready:
                        </p>
                        <ul className="text-slate-300 text-sm space-y-2 mb-4">
                            <li>• Your email address (if you have an account)</li>
                            <li>• A clear description of your issue or question</li>
                            <li>• Screenshots (if applicable)</li>
                            <li>• Browser and device information (for technical issues)</li>
                            <li>• Transaction details (for payment-related inquiries)</li>
                        </ul>
                        <p className="text-slate-300 text-sm">
                            We're committed to providing you with the best possible support experience. Thank you for
                            choosing CoverGenius!
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
