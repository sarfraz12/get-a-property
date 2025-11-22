// types/settings.ts
export interface SanityImage {
  _type: "image";
  alt?: string;
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface SocialLink {
  _key: string;
  media: "instagram" | "facebook" | "twitter" | "tiktok" | string; // extend as needed
  url: string;
}

export interface Settings {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: "settings";
  _updatedAt?: string;
  title?: string;
  address?: string;
  copyright?: string;
  description?: string;
  email?: string;
  googleIframe?: string;
  googleLink?: string;
  location?: string;
  logoalt?: SanityImage;
  openGraphImage?: SanityImage;
  phone?: string;
  social?: SocialLink[];
  url?: string;
  _system?: {
    base: {
      id: string;
      rev: string;
    };
  };
}
