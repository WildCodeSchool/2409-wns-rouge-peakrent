import { rentalProcessSteps } from "./fakeData";

interface ProcessStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ProcessStep({ icon, title, description }: ProcessStepProps) {
  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 flex flex-col items-center text-center relative">
      <div className="size-15 bg-red-100 rounded-full flex items-center justify-center mb-4 absolute -top-8 left-1/2 -translate-x-1/2">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2 mt-1">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

const SvgDraw = () => (
  <svg
    viewBox="0 0 800 150"
    className="w-[90%] h-full fill-none stroke-primary mx-auto"
    preserveAspectRatio="none"
  >
    <path
      d="M0,75 C200,150 600,0 800,75"
      strokeWidth="3"
      className="stroke-primary"
    />
  </svg>
);

const SvgDrawVertical = () => (
  <svg
    viewBox="0 0 150 800"
    className="h-[80%] w-full fill-none stroke-primary my-auto mt-10"
    preserveAspectRatio="none"
  >
    <path
      d="M75,0 C150,200 0,600 75,800"
      strokeWidth="3"
      className="stroke-primary"
    />
  </svg>
);

export function RentalProcessFlow() {
  return (
    <section className="relative w-full max-w-screen-xl mx-auto py-12 sm:px-4 mt-8">
      {/* Desktop */}
      <div className="hidden lg:block absolute top-1/2 left-0 w-full h-40 -translate-y-1/2 z-0">
        <SvgDraw />
      </div>

      {/* Tablet */}
      <div className="hidden sm:block lg:hidden absolute top-1/4 left-0 w-full h-40 -translate-y-1/2 z-0">
        <SvgDraw />
      </div>
      <div className="hidden sm:block lg:hidden absolute top-3/4 left-0 w-full h-40 -translate-y-1/2 z-0">
        <SvgDraw />
      </div>

      {/* Mobile */}
      <div className="block sm:hidden absolute left-1/2 -translate-x-1/2 h-full z-0">
        <SvgDrawVertical />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-10 gap-14 lg:gap-6 relative z-10">
        {rentalProcessSteps.map((step, index) => (
          <ProcessStep key={index} {...step} />
        ))}
      </div>
    </section>
  );
}
