interface ArquitectoGuideProps {
  currentStep: number;
}

function StepIcon({ state }: { state: "current" | "done" | "pending" }) {
  if (state === "current") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand-primary" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.7 1 6.4 2.6L21 8" />
        <path d="M21 3v5h-5" />
      </svg>
    );
  }
  if (state === "done") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand-soft" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

export default function ArquitectoGuide({ currentStep }: ArquitectoGuideProps) {
  const steps = [
    {
      title: "Paso 1: Identificar Clases",
      description:
        "Como un arquitecto que diseña los planos, primero identifica las entidades principales del sistema.",
      example: "Analiza el diagrama y arrastra los nombres correctos a cada clase.",
    },
    {
      title: "Paso 2: Asignar Atributos",
      description:
        "Cada clase necesita sus propiedades específicas, como cada jugador tiene sus habilidades únicas.",
      example: "Arrastra los atributos restantes a las clases correspondientes.",
    },
    {
      title: "Paso 3: Validar Diseño",
      description: "Un buen arquitecto siempre revisa su trabajo antes de construir.",
      example: "Revisa los errores y corrige antes de finalizar.",
    },
  ];

  const consejos = [
    "Piensa como un técnico: ¿qué posiciones necesitas en el campo?",
    "Cada atributo es como una habilidad específica que define el rol.",
    "Un buen diseño es como una formación táctica perfecta.",
  ];

  return (
    <div className="fixed right-4 top-20 z-40 w-80 rounded-lg border border-brand-soft bg-white p-4 shadow-xl">
      <div className="mb-4">
        <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-brand-primary">
          Guía del Arquitecto
        </h3>
        <div className="text-xs text-brand-support">
          Rol: Diseñador Estructural del Sistema
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const state = index === currentStep
            ? "current"
            : index < currentStep
              ? "done"
              : "pending";
          return (
            <div
              key={step.title}
              className={`rounded-lg border-2 p-3 transition-all ${
                state === "current"
                  ? "border-brand-primary bg-brand-primary/10 shadow-md"
                  : state === "done"
                    ? "border-green-300 bg-green-50"
                    : "border-brand-soft bg-brand-light/30"
              }`}
            >
              <div className="mb-2 flex items-start gap-2">
                <StepIcon state={state} />
                <div className="flex-1">
                  <div
                    className={`mb-1 text-sm font-semibold ${
                      state === "current"
                        ? "text-brand-primary"
                        : state === "done"
                          ? "text-green-700"
                          : "text-brand-support"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div
                    className={`text-xs ${
                      state === "current"
                        ? "text-brand-support"
                        : state === "done"
                          ? "text-green-600"
                          : "text-brand-support/70"
                    }`}
                  >
                    {step.description}
                  </div>
                  <div className="mt-1 text-xs italic text-brand-support/70">
                    {step.example}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg border border-brand-mid/40 bg-brand-soft/30 p-3">
        <div className="mb-1 text-xs font-semibold text-brand-primary">
          Consejo del Arquitecto:
        </div>
        <p className="text-xs text-brand-support">{consejos[currentStep]}</p>
      </div>
    </div>
  );
}