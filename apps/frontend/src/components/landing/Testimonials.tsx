import { MessageCircle, Star, User } from "lucide-react";
import { useContext } from "react";
import { toast } from "sonner";
import { ModalContext } from "../../Contexts";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { LandingSectionTemplate } from "../ui/LandingSectionTemplate";

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
    <LandingSectionTemplate
      title={
        <>
          <span className="text-neutral-800">What Our </span>
          <span className="text-green-500">Future Users</span>
          <span className="text-neutral-800"> Will Say</span>
        </>
      }
      description={
        "We're a fresh startup, so these testimonials are waiting for you!\nBe our first success story and help others discover CoverGenius."
      }
      id="testimonials"
      bgClasses="bg-gradient-to-b from-white to-neutral-50"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-4 lg:gap-8">
        {emptyTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="rounded-2xl p-8 md:px-4 md:py-8 lg:p-8 shadow-medium border-2 border-dashed border-neutral-300 hover:border-primary-400 transition-all duration-300 hover-glow"
          >
            <div className="flex items-center mb-6">
              <div className="size-12 min-h-[48px] min-w-[48px] bg-purple-500 rounded-full flex items-center justify-center mr-4">
                <User className="size-6 text-white min-h-[24px] min-w-[24px]" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-neutral-800">
                  {testimonial.name}
                </h4>
                <p className="text-xs sm:text-sm text-secondary-500">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </div>

            <div className="flex mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="size-5 text-warning-500 fill-current"
                />
              ))}
            </div>

            <p className="text-balance text-neutral-600 italic mb-6 text-sm sm:text-base">
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
        <div className="rounded-2xl p-8 shadow-medium border border-neutral-200 max-w-2xl mx-auto">
          <h3 className="text-balance text-xl sm:text-2xl font-bold mb-4 text-neutral-800">
            🚀 Worried About Your Privacy?
          </h3>
          <p className="text-sm sm:text-base text-neutral-600 mb-6">
            We care about your privacy. You can use our service as a guest
            without signing up and try the service right away.
            <span className="block mt-2">
              <b>NO</b> email, <b>NO</b> credit cards, <b>NO</b> commitment.
            </span>
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
              Try Anonymously
            </Button>
          </div>
        </div>
      </div>
    </LandingSectionTemplate>
  );
};
