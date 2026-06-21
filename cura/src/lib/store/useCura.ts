import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TwinProfile = {
  ageRange: string; goals: string[]; styles: string[]; hairType: string;
  skinType: string; budget: string; events: string[]; location?: string;
};
export type BeautyTwin = {
  persona: string; tagline: string; summary: string;
  signature_traits: string[]; color_palette: string[];
  style_dna: { minimal: number; glam: number; trend: number; classic: number; edgy: number };
  recommended_vibes: string[]; beauty_score: number; next_best_action: string;
};
export type Roadmap = {
  title: string; summary: string; total_weeks: number;
  estimated_budget_inr: { min: number; max: number };
  weeks: Array<{ week: number; phase: string; focus: string; milestone: string;
    tasks: Array<{ title: string; type: "salon"|"home"|"product"|"consult"; duration_min: number; priority: "high"|"medium"|"low" }>; }>;
  pro_tips: string[];
};
export type Booking = {
  id: string; salonId: string; salonName: string; serviceName: string;
  price: number; duration: number; date: string; time: string; createdAt: number;
};

type State = {
  profile: TwinProfile | null;
  twin: BeautyTwin | null;
  roadmap: Roadmap | null;
  bookings: Booking[];
  setProfile: (p: TwinProfile) => void;
  setTwin: (t: BeautyTwin) => void;
  setRoadmap: (r: Roadmap) => void;
  addBooking: (b: Omit<Booking, "id"|"createdAt">) => Booking;
  isSlotTaken: (salonId: string, date: string, time: string) => boolean;
  reset: () => void;
};

export const useCura = create<State>()(
  persist(
    (set, get) => ({
      profile: null, twin: null, roadmap: null, bookings: [],
      setProfile: (profile) => set({ profile }),
      setTwin: (twin) => set({ twin }),
      setRoadmap: (roadmap) => set({ roadmap }),
      addBooking: (b) => {
        const booking: Booking = { ...b, id: crypto.randomUUID(), createdAt: Date.now() };
        set((s) => ({ bookings: [...s.bookings, booking] }));
        return booking;
      },
      isSlotTaken: (salonId, date, time) =>
        get().bookings.some((x) => x.salonId === salonId && x.date === date && x.time === time),
      reset: () => set({ profile: null, twin: null, roadmap: null, bookings: [] }),
    }),
    { name: "cura-ai-store", version: 1 }
  )
);
