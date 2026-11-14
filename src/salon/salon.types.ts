export type CatalogService = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  duration: number | null;
};

export type TeamMember = {
  id: string;
  name: string;
  firstName: string;
  role: string;
  bio: string;
  avatar: string | null;
  serviceIds: string[];
  instagram: string | null;
  whatsapp: string | null;
};

export type Slot = { id: string; startsAt: string };
