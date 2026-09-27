import type { Role } from "@/lib/roles";

interface RoleIconProps {
  icon: Role["icon"];
  className?: string;
}

export default function RoleIcon({ icon, className = "h-10 w-10" }: RoleIconProps) {
  switch (icon) {
    case "blueprint":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 9v12M3 15h18" />
          <circle cx="6" cy="6" r="0.5" fill="currentColor" />
          <path d="M13 13h4v4h-4z" fill="currentColor" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3Z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "code":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m8 6-6 6 6 6M16 6l6 6-6 6M13 4l-2 16" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 3v18h18" />
          <path d="M7 15l4-5 4 3 5-7" />
          <circle cx="7" cy="15" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="11" cy="10" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="15" cy="13" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="20" cy="6" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}