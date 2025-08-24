import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_USE_LIMIT_FOR_GUEST } from "@cover-letter-ai/constants";
import { SEO } from "../components/ui/seo";
import { TWITTER_URL } from "../constants";

export const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <SEO
                title="Privacy Policy - CoverGenius AI"
                description="Learn about how CoverGenius AI collects, uses, and protects your personal data. Read our privacy policy to understand your rights."
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
                            <ArrowLeft size={20} className="mr-2" />
                            Back
                        </button>
                        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
                        <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                            <p className="text-slate-300 mb-4">
                                Welcome to CoverGenius ("we," "our," or "us"). We are committed to protecting your
                                privacy and ensuring the security of your personal information. This Privacy Policy
                                explains how we collect, use, disclose, and safeguard your information when you use our
                                cover letter generation service.
                            </p>
                            <p className="text-slate-300">
                                By using our service, you agree to the collection and use of information in accordance
                                with this policy.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>

                            <h3 className="text-xl font-medium text-white mb-3">2.1 Personal Information</h3>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>
                                    <strong>Account Information:</strong> When you create an account, we collect your
                                    email address and a password (encrypted).
                                </li>
                                <li>
                                    <strong>IP Address:</strong> We collect your IP address for security purposes and to
                                    provide guest access functionality.
                                </li>
                                <li>
                                    <strong>Usage Data:</strong> We track your usage of our service, including the
                                    number of cover letters generated and usage limits.
                                </li>
                            </ul>

                            <h3 className="text-xl font-medium text-white mb-3">2.2 Content You Provide</h3>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>
                                    <strong>Job Descriptions:</strong> The job descriptions you input for cover letter
                                    generation.
                                </li>
                                <li>
                                    <strong>Resume Files:</strong> PDF resume files you upload for analysis and cover
                                    letter generation.
                                </li>
                                <li>
                                    <strong>Additional Information:</strong> Any additional context or information you
                                    provide to enhance cover letter generation.
                                </li>
                            </ul>

                            <h3 className="text-xl font-medium text-white mb-3">2.3 Generated Content</h3>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>
                                    <strong>Cover Letters:</strong> AI-generated cover letters based on your inputs.
                                </li>
                                <li>
                                    <strong>Suggestions:</strong> Enhancement suggestions provided by our AI system.
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>
                                    <strong>Service Provision:</strong> To provide our cover letter generation service
                                    and process your requests.
                                </li>
                                <li>
                                    <strong>AI Processing:</strong> To send your resume and job descriptions to Google's
                                    Gemini AI for analysis and cover letter generation.
                                </li>
                                <li>
                                    <strong>Account Management:</strong> To manage your account, track usage limits, and
                                    provide customer support.
                                </li>
                                <li>
                                    <strong>Security:</strong> To protect against fraud, abuse, and unauthorized access
                                    to our service.
                                </li>
                                <li>
                                    <strong>Improvement:</strong> To improve our service quality and user experience
                                    (using anonymized data).
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                4. Information Sharing and Disclosure
                            </h2>
                            <p className="text-slate-300 mb-4">
                                We do not sell, trade, or otherwise transfer your personal information to third parties,
                                except in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>
                                    <strong>AI Service Providers:</strong> We share your resume and job descriptions
                                    with Google's Gemini AI service to generate cover letters. This is necessary for our
                                    core service functionality.
                                </li>
                                <li>
                                    <strong>Legal Requirements:</strong> We may disclose information if required by law
                                    or to protect our rights and safety.
                                </li>
                                <li>
                                    <strong>Service Providers:</strong> We may use third-party services for hosting,
                                    analytics, and other operational purposes. These providers are bound by
                                    confidentiality agreements.
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">5. Data Storage and Security</h2>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>
                                    <strong>Storage:</strong> Your data is stored securely in MongoDB databases with
                                    encryption at rest.
                                </li>
                                <li>
                                    <strong>Transmission:</strong> All data transmission is encrypted using HTTPS/TLS
                                    protocols.
                                </li>
                                <li>
                                    <strong>Access Control:</strong> We implement strict access controls and
                                    authentication measures to protect your data.
                                </li>
                                <li>
                                    <strong>Retention:</strong> We retain your data for as long as your account is
                                    active or as required by law.
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights and Choices</h2>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>
                                    <strong>Access:</strong> You can access your account information and usage data
                                    through your account dashboard.
                                </li>
                                <li>
                                    <strong>Correction:</strong> You can update your account information at any time.
                                </li>
                                <li>
                                    <strong>Deletion:</strong> You can request deletion of your account and associated
                                    data by contacting us.
                                </li>
                                <li>
                                    <strong>Opt-out:</strong> You can choose not to provide certain information, though
                                    this may limit service functionality.
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">7. Guest Users</h2>
                            <p className="text-slate-300 mb-4">
                                Guest users are limited to {DEFAULT_USE_LIMIT_FOR_GUEST} cover letter generation and are
                                identified by IP address only. We do not collect email addresses or create accounts for
                                guest users.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">8. Children's Privacy</h2>
                            <p className="text-slate-300 mb-4">
                                Our service is not intended for children under 13 years of age. We do not knowingly
                                collect personal information from children under 13. If you are a parent or guardian and
                                believe your child has provided us with personal information, please contact us.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                9. Changes to This Privacy Policy
                            </h2>
                            <p className="text-slate-300 mb-4">
                                We may update this Privacy Policy from time to time. We will notify you of any changes
                                by posting the new Privacy Policy on this page and updating the "Last updated" date. You
                                are advised to review this Privacy Policy periodically for any changes.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Us</h2>
                            <p className="text-slate-300 mb-4">
                                If you have any questions about this Privacy Policy or our data practices, please
                                contact us:
                            </p>
                            <ul className="list-disc list-inside text-slate-300 space-y-2">
                                <li>
                                    X (Twitter):{" "}
                                    <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer">
                                        @theprinceraj
                                    </a>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};
