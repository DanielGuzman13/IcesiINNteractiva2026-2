import Link from "next/link";
import RegistrationForm from "@/components/registro/RegistrationForm";

export default function RegistroPage() {
  return (
    <div
      className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-12 sm:px-6"
      style={{
        background:
          "linear-gradient(145deg, #B2BCCC 0%, #91A4BC 50%, #719FC1 100%)",
      }}
    >
      <Link
        href="/"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-semibold text-brand-primary shadow-sm backdrop-blur transition hover:bg-white/90 hover:shadow-md sm:left-6 sm:top-6"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Volver al inicio
      </Link>

      <div className="w-full max-w-xl">
        <RegistrationForm />
      </div>
    </div>
  );
}