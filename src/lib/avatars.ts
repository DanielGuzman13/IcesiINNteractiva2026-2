export const AVATARS = [
  {
    id: "companion",
    label: "Compañero",
    src: "/media/avatars/av-companion.svg",
  },
  {
    id: "guardian",
    label: "Guardian",
    src: "/media/avatars/av-guardian.svg",
  },
  {
    id: "coder",
    label: "Coder",
    src: "/media/avatars/av-coder.svg",
  },
  {
    id: "analyst",
    label: "Analista",
    src: "/media/avatars/av-analyst.svg",
  },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export function getAvatarSrc(id: AvatarId): string {
  const avatar = AVATARS.find((item) => item.id === id);
  return avatar ? avatar.src : AVATARS[0].src;
}