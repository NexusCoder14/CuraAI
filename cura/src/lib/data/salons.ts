export type Salon = {
  id: string;
  name: string;
  area: string;
  address: string;
  rating: number;
  reviews: number;
  priceBand: "₹" | "₹₹" | "₹₹₹" | "₹₹₹₹";
  specialties: string[];
  vibes: string[];
  services: { name: string; price: number; duration: number }[];
  image: string;
  accent: string;
};

export const SALONS: Salon[] = [
  { id: "lakme-bandra", name: "Lakmé Salon", area: "Bandra West", address: "Linking Road, Bandra West, Mumbai", rating: 4.7, reviews: 1842, priceBand: "₹₹₹", specialties: ["Bridal Makeup", "Hair Color", "Skin Treatments"], vibes: ["Modern Glam", "Reliable Luxury"], services: [{ name: "Signature Facial", price: 3200, duration: 75 }, { name: "Bridal Makeup Trial", price: 6500, duration: 120 }, { name: "Global Hair Color", price: 5800, duration: 150 }], image: "💎", accent: "#e879f9" },
  { id: "bblunt-juhu", name: "BBlunt", area: "Juhu", address: "Juhu Tara Road, Mumbai", rating: 4.8, reviews: 2210, priceBand: "₹₹₹", specialties: ["Editorial Cuts", "Balayage", "Texture"], vibes: ["Trend Architect", "Editorial"], services: [{ name: "Signature Cut", price: 2800, duration: 60 }, { name: "Balayage", price: 8500, duration: 180 }, { name: "Keratin Smoothing", price: 9500, duration: 210 }], image: "✂️", accent: "#22d3ee" },
  { id: "enrich-powai", name: "Enrich Salon", area: "Powai", address: "Hiranandani Gardens, Powai", rating: 4.6, reviews: 1530, priceBand: "₹₹", specialties: ["Hair Color", "Spa Manicure", "Threading"], vibes: ["Everyday Polished", "Approachable"], services: [{ name: "Root Touch-up", price: 1800, duration: 60 }, { name: "Spa Pedicure", price: 1400, duration: 60 }, { name: "Hydrating Facial", price: 2400, duration: 60 }], image: "🌿", accent: "#22c55e" },
  { id: "hakims-aalim", name: "Hakim's Aalim", area: "Khar West", address: "Linking Road, Khar West", rating: 4.9, reviews: 980, priceBand: "₹₹₹₹", specialties: ["Celebrity Cuts", "Avant-Garde Color", "Grooming"], vibes: ["Editorial Bold", "Star Studio"], services: [{ name: "Master Cut", price: 6000, duration: 75 }, { name: "Color Correction", price: 14000, duration: 240 }, { name: "Bridal Hair", price: 12000, duration: 180 }], image: "👑", accent: "#8b5cf6" },
  { id: "the-bridal-studio", name: "The Bridal Studio", area: "Bandra West", address: "Pali Hill, Bandra", rating: 4.9, reviews: 612, priceBand: "₹₹₹₹", specialties: ["Bridal Makeup", "Pre-Bridal Skin", "Trial Packages"], vibes: ["Bridal Radiance", "Luxury"], services: [{ name: "Bridal Trial", price: 8500, duration: 150 }, { name: "Pre-Bridal Glow Package", price: 22000, duration: 300 }, { name: "HD Airbrush", price: 18000, duration: 180 }], image: "💍", accent: "#f472b6" },
  { id: "skinlab-lowerparel", name: "SkinLab Clinic", area: "Lower Parel", address: "Kamala Mills, Lower Parel", rating: 4.7, reviews: 1124, priceBand: "₹₹₹₹", specialties: ["Medi-Facials", "Hydra-Glow", "Laser"], vibes: ["Clinical Glow", "Results-Driven"], services: [{ name: "Hydra-Facial Pro", price: 5500, duration: 75 }, { name: "LED Glow Therapy", price: 3800, duration: 45 }, { name: "Vampire Facial", price: 12000, duration: 90 }], image: "🧪", accent: "#60a5fa" },
  { id: "tonis-guy-bkc", name: "Toni & Guy", area: "BKC", address: "Bandra Kurla Complex", rating: 4.6, reviews: 1390, priceBand: "₹₹₹", specialties: ["Precision Cuts", "Foilyage", "Treatments"], vibes: ["Corporate Polished", "International"], services: [{ name: "Precision Cut", price: 3200, duration: 60 }, { name: "Foilyage", price: 9800, duration: 180 }, { name: "Olaplex Treatment", price: 3500, duration: 60 }], image: "🪞", accent: "#a78bfa" },
  { id: "page-3-worli", name: "Page 3 Salon", area: "Worli", address: "Worli Sea Face", rating: 4.5, reviews: 720, priceBand: "₹₹", specialties: ["Express Facials", "Threading", "Nails"], vibes: ["Quick Polish", "Friendly"], services: [{ name: "Express Facial", price: 1500, duration: 45 }, { name: "Gel Manicure", price: 1800, duration: 60 }, { name: "Eyebrow & Lashes", price: 800, duration: 30 }], image: "🌸", accent: "#fb7185" },
  { id: "anoos-andheri", name: "Anoos Spa & Salon", area: "Andheri West", address: "Lokhandwala, Andheri", rating: 4.4, reviews: 880, priceBand: "₹₹", specialties: ["Body Spa", "Hair Spa", "Pedicure"], vibes: ["Wellness", "Restorative"], services: [{ name: "Aroma Body Massage", price: 2800, duration: 90 }, { name: "Hair Spa", price: 1600, duration: 60 }, { name: "Spa Pedicure", price: 1200, duration: 60 }], image: "🌺", accent: "#facc15" },
];

export const getSalon = (id: string) => SALONS.find((s) => s.id === id);
