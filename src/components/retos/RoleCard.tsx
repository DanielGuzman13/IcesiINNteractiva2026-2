import Link from "next/link";
import type { Role } from "@/lib/roles";
import RoleIcon from "./RoleIcon";

interface RoleCardProps {
  role: Role;
}

export default function RoleCard({ role }: RoleCardProps) {
  return (
    <Link
      href={role.href ?? `/retos/${role.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-brand-primary/10 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-primary/25 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-mid sm:p-8"
    >
      <span
        className="absolute inset-x-0 top-0 h-1.5 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"
        style={{ backgroundColor: role.accent }}
      />
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg"
        style={{ backgroundColor: role.accent }}
      >
        <RoleIcon icon={role.icon} className="h-9 w-9" />
      </div>
      <h3 className="text-xl font-black tracking-tight text-brand-support sm:text-2xl">
        {role.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-support/80 sm:text-base">
        {role.description}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand-primary">
        Explorar rol
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}