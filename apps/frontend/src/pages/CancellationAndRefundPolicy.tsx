import React from "react";
import { Mail, MailIcon, TwitterIcon, ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { EMAIL_ADDRESS, TWITTER_URL } from "../constants";
import { SEO } from "../components/ui/seo";

export const CancellationAndRefundPolicy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <SEO
                title="Cancellation & Refund Policy - CoverGenius AI"
                description="Understand the cancellation and refund policy for CoverGenius AI. Learn about our credit-based system and how we handle refunds."
                name="CoverGenius AI"
                type="website"
            />
            <div className="min-h-screen bg-slate-950 text-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-slate-400 hover:text-slate-200 transition-colors mb-4"
                            aria-label="Goto previous page">
                            <ArrowLeftIcon size={20} className="mr-2" />
                            Back
                        </button>
                        <h1 className="text-3xl font-bold text-white mb-2">Cancellation and Refund Policy</h1>
                        <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">1. Overview</h2>
                            <p className="text-slate-300 mb-4">
                                This Cancellation and Refund Policy outlines the terms and conditions for cancellations
                                and refunds for CoverGenius services. By purchasing credits or using our services, you
                                agree to these terms.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">2. Cancellation Policy</h2>
                            <div className="bg-slate-900 rounded-lg p-6 mb-4">
                                <h3 className="text-xl font-medium text-white mb-3">No Subscription System</h3>
                                <p className="text-slate-300 mb-4">
                                    CoverGenius operates on a credit-based system with no recurring subscriptions.
                                    Therefore, there are no subscriptions to cancel.
                                </p>
                                <ul className="list-disc list-inside text-slate-300 space-y-2">
                                    <li>We do not offer subscription services</li>
                                    <li>No automatic billing or recurring charges</li>
                                    <li>Credits are purchased on a one-time basis</li>
                                    <li>No cancellation process is required</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">3. Refund Policy</h2>

                            <h3 className="text-xl font-medium text-white mb-3">3.1 General Refund Terms</h3>
                            <p className="text-slate-300 mb-4">
                                Refunds are handled on a case-by-case basis and are subject to the following conditions:
                            </p>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>
                                    <strong>No Partial Refunds:</strong> Once credits have been used (even partially),
                                    no refunds will be provided for the used portion
                                </li>
                                <li>
                                    <strong>Unused Credits:</strong> Refunds may be considered for completely unused
                                    credit packages
                                </li>
                                <li>
                                    <strong>Technical Issues:</strong> Refunds may be provided for technical issues that
                                    prevent service usage
                                </li>
                                <li>
                                    <strong>Service Unavailability:</strong> Refunds may be provided if our service
                                    becomes unavailable for extended periods
                                </li>
                            </ul>

                            <h3 className="text-xl font-medium text-white mb-3">3.2 Refund Request Process</h3>
                            <p className="text-slate-300 mb-4">
                                To request a refund, you must contact us through the following channels:
                            </p>

                            <div className="bg-slate-900 rounded-lg p-6 mb-4">
                                <h4 className="text-lg font-medium text-white mb-3">
                                    Primary Contact Method: X (Twitter)
                                </h4>
                                <div className="flex items-center gap-3 mb-3">
                                    <TwitterIcon size={20} className="text-sky-400" />
                                    <a
                                        href={TWITTER_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sky-400 hover:underline">
                                        @theprinceraj
                                    </a>
                                </div>
                                <p className="text-slate-300 text-sm mb-3">
                                    Send a direct message with the following information:
                                </p>
                                <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                                    <li>Your email address used for the purchase</li>
                                    <li>Transaction ID or payment reference</li>
                                    <li>Date of purchase</li>
                                    <li>Reason for refund request</li>
                                    <li>Number of credits purchased and used</li>
                                </ul>
                            </div>

                            <div className="bg-slate-900 rounded-lg p-6">
                                <h4 className="text-lg font-medium text-white mb-3">
                                    Alternative Contact Method: Email
                                </h4>
                                <div className="flex items-center gap-3 mb-3">
                                    <Mail size={20} className="text-slate-400" />
                                    <a
                                        href={`mailto:${EMAIL_ADDRESS}`}
                                        className="text-sky-400 hover:underline"
                                        aria-label="Email Address for Help Related to CoverGenius">
                                        {EMAIL_ADDRESS}
                                    </a>
                                </div>
                                <p className="text-slate-300 text-sm">
                                    Include the same information as listed above in your email.
                                </p>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">4. Refund Processing</h2>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>
                                    <strong>Response Time:</strong> We aim to respond to refund requests within 24-48
                                    hours
                                </li>
                                <li>
                                    <strong>Review Process:</strong> Each request is reviewed individually based on the
                                    circumstances
                                </li>
                                <li>
                                    <strong>Approved Refunds:</strong> If approved, refunds will be processed within
                                    5-10 business days
                                </li>
                                <li>
                                    <strong>Payment Method:</strong> Refunds will be issued to the original payment
                                    method used for the purchase
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">5. Non-Refundable Situations</h2>
                            <p className="text-slate-300 mb-4">
                                The following situations are generally not eligible for refunds:
                            </p>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>
                                    <strong>Used Credits:</strong> Any credits that have been used to generate cover
                                    letters
                                </li>
                                <li>
                                    <strong>Change of Mind:</strong> Simply changing your mind about the service after
                                    purchase
                                </li>
                                <li>
                                    <strong>Account Violations:</strong> Accounts terminated due to Terms of Service
                                    violations
                                </li>
                                <li>
                                    <strong>Delayed Requests:</strong> Refund requests made more than 30 days after
                                    purchase
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">6. Dispute Resolution</h2>
                            <p className="text-slate-300 mb-4">If you disagree with our refund decision, you may:</p>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>Contact us again with additional information or clarification</li>
                                <li>Request a review of your case by providing more context</li>
                                <li>
                                    If you used a credit card, you may contact your bank about chargeback options
                                    (though this should be a last resort)
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Information</h2>
                            <p className="text-slate-300 mb-4">
                                For refund requests or questions about this policy, contact us:
                            </p>
                            <div className="bg-slate-900 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <TwitterIcon size={20} className="text-sky-400" />
                                    <span className="text-white font-medium">X (Twitter):</span>
                                    <a
                                        href={TWITTER_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sky-400 hover:underline">
                                        @theprinceraj
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MailIcon size={20} className="text-slate-400" />
                                    <span className="text-white font-medium">Email:</span>
                                    <a
                                        href={`mailto:${EMAIL_ADDRESS}`}
                                        className="text-sky-400 hover:underline"
                                        aria-label="Email Address for Help Related to CoverGenius">
                                        {EMAIL_ADDRESS}
                                    </a>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">8. Policy Updates</h2>
                            <p className="text-slate-300 mb-4">
                                We reserve the right to modify this Cancellation and Refund Policy at any time. Changes
                                will be effective immediately upon posting on this page. Your continued use of our
                                services after any changes constitutes acceptance of the updated policy.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};
