export const AVATARS = [
  {
    id: "aborrajado",
    label: "Aborrajado",
    src: "/media/avatars/aborrajado.png",
  },
  {
    id: "arepa",
    label: "Arepa",
    src: "/media/avatars/arepa.png",
  },
  {
    id: "bunuelo",
    label: "Buñuelo",
    src: "/media/avatars/bunuelo.png",
  },
  {
    id: "cholado",
    label: "Cholado",
    src: "/media/avatars/cholado.png",
  },
  {
    id: "chontaduro",
    label: "Chontaduro",
    src: "/media/avatars/chontaduro.png",
  },
  {
    id: "empanada",
    label: "Empanada",
    src: "/media/avatars/empanada.png",
  },
  {
    id: "lulada",
    label: "Lulada",
    src: "/media/avatars/lulada.png",
  },
  {
    id: "raspado",
    label: "Raspado",
    src: "/media/avatars/raspado.png",
  },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export function getAvatarSrc(id: AvatarId): string {
  const avatar = AVATARS.find((item) => item.id === id);
  return avatar ? avatar.src : AVATARS[0].src;
}