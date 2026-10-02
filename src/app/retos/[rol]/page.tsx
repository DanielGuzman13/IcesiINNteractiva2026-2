import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoleBySlug } from "@/lib/roles";
import RoleIcon from "@/components/retos/RoleIcon";

export default async function RolActivityPage(
  props: PageProps<"/retos/[rol]">,
) {
  const { rol } = await props.params;
  const role = getRoleBySlug(rol);
  if (!role) notFound();

  return (
    <div
      className="flex min-h-dvh flex-col px-4 py-10 sm:px-8 sm:py-14"
      style={{
        background:
          "linear-gradient(160deg, #B2BCCC 0%, #91A4BC 45%, #6E7FA2 100%)",
      }}
    >
      <Link
        href="/retos"
        className="inline-flex w-fit items-center gap-2 rounded-full bg-white/60 px-5 py-2.5 text-sm font-semibold text-brand-support backdrop-blur transition hover:bg-white/90 hover:text-brand-primary"
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
        Elegir otro reto
      </Link>

      <main className="mx-auto my-auto flex w-full max-w-xl flex-col items-center text-center">
        <div className="relative">
          <span
            className="absolute inset-0 scale-150 blur-2xl opacity-40"
            style={{ backgroundColor: role.accent }}
          />
          <div
            className="relative flex h-20 w-20 items-center justify-center rounded-2xl text-white shadow-xl"
            style={{ backgroundColor: role.accent }}
          >
            <RoleIcon icon={role.icon} className="h-11 w-11" />
          </div>
        </div>

        <span className="mt-8 rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-support backdrop-blur">
          Reto · {role.title}
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-brand-support drop-shadow sm:text-5xl">
          Actividad en preparación
        </h1>
        <p className="mt-4 text-base leading-relaxed text-brand-support/90 sm:text-lg">
          La actividad de <strong>{role.title}</strong> está siendo preparada
          para la siguiente etapa del reto &quot;Cali nos une&quot;. ¡Vuelve
          pronto, tu rol te espera!
        </p>
        <Link
          href="/retos"
          className="mt-8 rounded-full bg-brand-primary px-10 py-3.5 text-lg font-bold text-white shadow-xl shadow-brand-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-mid hover:shadow-2xl"
        >
          Explorar otros roles
        </Link>
      </main>
    </div>
  );
}