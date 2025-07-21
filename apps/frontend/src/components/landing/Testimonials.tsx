import { MessageCircle, Star, User } from "lucide-react";
import { useContext } from "react";
import { toast } from "sonner";
import { ModalContext } from "../../Contexts";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

const emptyTestimonials = [
  {
    id: 1,
    name: "Your Name Here",
    role: "Dream Job Getter",
    company: "Amazing Company",
    rating: 5,
    text: "This space is waiting for your success story! Be the first to land your dream job with CoverGenius.",
    placeholder: true,
  },
  {
    id: 2,
    name: "Future Success Story",
    role: "Career Changer",
    company: "Top Tech Firm",
    rating: 5,
    text: "We're saving this spot for you! Share how CoverGenius helped you get that interview.",
    placeholder: true,
  },
  {
    id: 3,
    name: "Next Happy Customer",
    role: "Job Seeker",
    company: "Fortune 500",
    rating: 5,
    text: "Your testimonial could be right here! Use CoverGenius and tell us about your experience.",
    placeholder: true,
  },
];

export const Testimonials: React.FC = () => {
  const navigate = useNavigate();
  const { openSignInModal } = useContext(ModalContext)!;
  return (
    <section id="testimonials" className="py-20 bg-gradient-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-neutral-800">What Our </span>
            <span className="text-green-500">Future Users</span>
            <span className="text-neutral-800"> Will Say</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            We're a fresh startup, so these testimonials are waiting for you!
            <br />
            Be our first success story and help others discover CoverGenius.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {emptyTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="glass rounded-2xl p-8 shadow-medium border-2 border-dashed border-neutral-300 hover:border-primary-400 transition-all duration-300 hover-glow"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-secondary-600">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-warning-500 fill-current"
                  />
                ))}
              </div>

              <p className="text-neutral-700 italic mb-6">
                "{testimonial.text}"
              </p>

              {testimonial.placeholder && (
                <div className="text-center">
                  <Button
                    variant="primary"
                    className="px-6 py-3 flex items-center mx-auto"
                    onClick={() => navigate("/contact-us")}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Share Your Story
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="glass rounded-2xl p-8 shadow-medium border border-neutral-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-neutral-800">
              🚀 Worried About Your Privacy?
            </h3>
            <p className="text-neutral-600 mb-6">
              We care about your privacy. You can use our service as a guest
              without signing up and try the service right away. No email, no
              credit cards, no commitment.
            </p>
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="px-8 py-3"
                onClick={() => {
                  openSignInModal();
                  toast.info("Please select Guest Login");
                }}
              >
                Try Without Signing Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
