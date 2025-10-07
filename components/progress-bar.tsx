import { Check } from "lucide-react"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const steps = ["Le Livre", "Double Mission", "La Carte", "L'Herboriste", "Finale"]

  return (
    <div className="w-full py-6 px-4 bg-card border-b border-border">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    index < currentStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : index === currentStep
                        ? "bg-accent border-accent text-accent-foreground"
                        : "bg-muted border-border text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <span className="text-xs mt-2 text-muted-foreground hidden md:block">{step}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 md:w-24 h-0.5 mx-2 ${index < currentStep ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
