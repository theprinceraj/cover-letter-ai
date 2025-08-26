import { Fragment } from "react/jsx-runtime";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCompleted = index < currentStep;

          return (
            <Fragment key={step}>
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full 
                    transition-colors duration-300 font-bold
                    ${isActive ? "bg-primary text-dark" : "bg-slate-600"}
                    ${isCompleted ? "bg-emerald-600" : ""}
                  `}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs ${isActive ? "text-secondary-900" : "text-secondary-400"}`}
                >
                  {step}
                </span>
              </div>

              {/* Connector line (except after last step) */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2
                      ${index < currentStep ? "bg-primary" : "bg-slate-600"}
                  `}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
