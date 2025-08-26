import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import {
    DEFAULT_USE_LIMIT_FOR_GUEST,
    DEFAULT_USE_LIMIT_FOR_REGISTERED_USER,
    MAX_JOB_DESCRIPTION_LENGTH,
    MAX_OTHER_RELEVANT_INFORMATION_LENGTH,
} from "@cover-letter-ai/constants";
import { EMAIL_ADDRESS } from "../constants";
import { SEO } from "../components/ui/seo";

export const TermsOfService: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <SEO
                title="Terms of Service - CoverGenius AI"
                description="Read the Terms of Service for CoverGenius AI. Understand the rules and guidelines for using our AI-powered cover letter generator."
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
                        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
                        <p className="text-slate-400 mb-2">Last updated: {new Date().toLocaleDateString()}</p>
                        <p className="text-slate-400 text-sm">
                            Business Name: <strong>PRINCE RAJ</strong>
                        </p>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                            <p className="text-slate-300 mb-4">
                                By accessing and using CoverGenius ("the Service"), operated by{" "}
                                <strong>PRINCE RAJ</strong>, you accept and agree to be bound by the terms and provision
                                of this agreement. If you do not agree to abide by the above, please do not use this
                                service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                            <p className="text-slate-300 mb-4">
                                CoverGenius, operated by <strong>PRINCE RAJ</strong>, is an AI-powered cover letter
                                generation service that:
                            </p>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>
                                    Analyzes job descriptions and resume content to generate personalized cover letters
                                </li>
                                <li>Provides enhancement suggestions for improving cover letters</li>
                                <li>Offers both registered user accounts and guest access options</li>
                                <li>Utilizes Google's Gemini AI technology for content generation</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                3. User Accounts and Registration
                            </h2>
                            <h3 className="text-xl font-medium text-white mb-3">3.1 Account Creation</h3>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>You may create an account by providing a valid email address and password</li>
                                <li>
                                    You are responsible for maintaining the confidentiality of your account credentials
                                </li>
                                <li>You must provide accurate and complete information during registration</li>
                            </ul>

                            <h3 className="text-xl font-medium text-white mb-3">3.2 Guest Access</h3>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>Guest users can access the service without creating an account</li>
                                <li>
                                    Guest access is limited to {DEFAULT_USE_LIMIT_FOR_GUEST} cover letter generation per
                                    IP address
                                </li>
                                <li>Guest users are identified by IP address only</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">4. Usage Limits and Restrictions</h2>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>
                                    <strong>Registered Users:</strong> Limited to{" "}
                                    {DEFAULT_USE_LIMIT_FOR_REGISTERED_USER} cover letter generations per account
                                </li>
                                <li>
                                    <strong>Guest Users:</strong> Limited to {DEFAULT_USE_LIMIT_FOR_GUEST} cover letter
                                    generation per IP address
                                </li>
                                <li>
                                    <strong>File Uploads:</strong> Only PDF files are accepted for resume uploads
                                </li>
                                <li>
                                    <strong>Content Limits:</strong> Job descriptions limited to{" "}
                                    {MAX_JOB_DESCRIPTION_LENGTH} characters; additional information limited to{" "}
                                    {MAX_OTHER_RELEVANT_INFORMATION_LENGTH} characters
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">5. User Responsibilities</h2>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>
                                    <strong>Accurate Information:</strong> You must provide accurate and truthful
                                    information in your job descriptions and resumes
                                </li>
                                <li>
                                    <strong>Content Ownership:</strong> You must own or have rights to all content you
                                    upload, including resumes
                                </li>
                                <li>
                                    <strong>Appropriate Use:</strong> You agree not to use the service for any illegal,
                                    harmful, or inappropriate purposes
                                </li>
                                <li>
                                    <strong>No Misrepresentation:</strong> You must not use generated content to
                                    misrepresent your qualifications or experience
                                </li>
                                <li>
                                    <strong>Review and Edit:</strong> You are responsible for reviewing, editing, and
                                    customizing generated cover letters before use
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">6. Prohibited Uses</h2>
                            <p className="text-slate-300 mb-4">You agree not to use the Service to:</p>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>Violate any applicable laws or regulations</li>
                                <li>Infringe upon intellectual property rights</li>
                                <li>Upload malicious software or attempt to compromise system security</li>
                                <li>Attempt to circumvent usage limits or access restrictions</li>
                                <li>Generate content for fraudulent or deceptive purposes</li>
                                <li>Harass, abuse, or harm others</li>
                                <li>Attempt to reverse engineer or copy the service</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">7. Intellectual Property</h2>
                            <h3 className="text-xl font-medium text-white mb-3">7.1 Service Ownership</h3>
                            <p className="text-slate-300 mb-4">
                                The Service and its original content, features, and functionality are owned by{" "}
                                <strong>PRINCE RAJ</strong> and are protected by international copyright, trademark,
                                patent, trade secret, and other intellectual property laws.
                            </p>

                            <h3 className="text-xl font-medium text-white mb-3">7.2 User Content</h3>
                            <p className="text-slate-300 mb-4">
                                You retain ownership of content you upload (resumes, job descriptions, additional
                                information). By using the Service, you grant us a limited license to process this
                                content for the purpose of generating cover letters.
                            </p>

                            <h3 className="text-xl font-medium text-white mb-3">7.3 Generated Content</h3>
                            <p className="text-slate-300 mb-4">
                                Cover letters generated by our AI system are provided for your use and customization.
                                While we use AI technology, the final content and its use remain your responsibility.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimers and Limitations</h2>
                            <h3 className="text-xl font-medium text-white mb-3">8.1 Service Availability</h3>
                            <p className="text-slate-300 mb-4">
                                The Service is provided "as is" and "as available." We do not guarantee uninterrupted
                                access or error-free operation.
                            </p>

                            <h3 className="text-xl font-medium text-white mb-3">8.2 Content Accuracy</h3>
                            <p className="text-slate-300 mb-4">
                                While we strive for quality, AI-generated content may contain errors or inaccuracies.
                                You are responsible for reviewing and editing all generated content before use.
                            </p>

                            <h3 className="text-xl font-medium text-white mb-3">8.3 No Guarantees</h3>
                            <p className="text-slate-300 mb-4">
                                We do not guarantee that using our service will result in job offers or successful
                                applications. Job search success depends on many factors beyond our control.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">9. Privacy and Data Protection</h2>
                            <p className="text-slate-300 mb-4">
                                Your privacy is important to us. Please review our Privacy Policy, which also governs
                                your use of the Service, to understand our practices regarding the collection and use of
                                your information.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">10. Termination</h2>
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                                <li>
                                    We may terminate or suspend your account immediately, without prior notice, for
                                    conduct that we believe violates these Terms of Service or is harmful to other users
                                    or the Service
                                </li>
                                <li>You may terminate your account at any time by contacting us</li>
                                <li>Upon termination, your right to use the Service will cease immediately</li>
                                <li>
                                    Provisions of these Terms that by their nature should survive termination shall
                                    survive termination
                                </li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to Terms</h2>
                            <p className="text-slate-300 mb-4">
                                We reserve the right to modify these Terms of Service at any time. We will notify users
                                of any material changes by posting the new Terms on this page and updating the "Last
                                updated" date. Your continued use of the Service after such modifications constitutes
                                acceptance of the updated Terms.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">12. Governing Law</h2>
                            <p className="text-slate-300 mb-4">
                                These Terms shall be interpreted and governed by the laws of the jurisdiction in which
                                CoverGenius operates, without regard to its conflict of law provisions.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Information</h2>
                            <p className="text-slate-300 mb-4">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <ul className="list-disc list-inside text-slate-300 space-y-2">
                                <li>
                                    Business Name: <strong>PRINCE RAJ</strong>
                                </li>
                                <li>Email: {EMAIL_ADDRESS}</li>
                                <li>X (Twitter): @theprinceraj</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};
