export type InvitedGuest = {
  slug: string;
  name: string;
  canBringPlusOne: boolean;
};

export const invitedGuests = [
  { slug: "mira-afaneh", name: "Mira Afaneh", canBringPlusOne: true },
  { slug: "mayar-nussair", name: "Mayar Nussair", canBringPlusOne: true },
  { slug: "taleen-kharouf", name: "Taleen Kharouf", canBringPlusOne: false },
  { slug: "dania-hammori", name: "Dania Hammori", canBringPlusOne: true },
  { slug: "rawan-khatib", name: "Rawan Khatib", canBringPlusOne: false },
  { slug: "rand-ashhab", name: "Rand Ashhab", canBringPlusOne: false },
  { slug: "tala-irshaid", name: "Tala Irshaid", canBringPlusOne: false },
  { slug: "nadine-abu-arafe", name: "Nadine abu arafe", canBringPlusOne: false },
  { slug: "mayar-kulgasi", name: "Mayar Kulgasi", canBringPlusOne: true },
  { slug: "tamara-abu-arafe", name: "Tamara abu arafe", canBringPlusOne: false },
  { slug: "dina-mansour", name: "Dina Mansour", canBringPlusOne: true },
  { slug: "huda-jibreen", name: "Huda Jibreen", canBringPlusOne: true },
] satisfies InvitedGuest[];

export function findInvitedGuest(slug: string) {
  return invitedGuests.find((guest) => guest.slug === slug);
}
