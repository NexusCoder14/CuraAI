"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TwinProfile, BeautyTwin } from "../ai/beautyTwin";
import type { Roadmap } from "../ai/roadmap";

export type Booking = {
  id: string;
  salonId: string;
  salonName: string;
  serviceName: string;
  price: number;
  duration: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  createdAt: number;
};

type State = {
  profile: TwinProfile | null;
  twin: BeautyTwin | null;
  roadmap: Roadmap | null;
  bookings: Booking[];
  onboardingComplete: boolean;
  setProfile: (p: TwinProfile) => void;
  setTwin: (t: BeautyTwin) => void;
  setRoadmap: (r: Roadmap) => void;
  addBooking: (b: Omit<Booking, "id" | "createdAt">) => Booking;
  cancelBooking: (id: string) => void;
  isSlotTaken: (salonId: string, date: string, time: string) => boolean;
  reset: () => void;
};

export const useCura = create<State>()(
  persist(
    (set, get) => ({
      profile: null,
      twin: null,
      roadmap: null,
      bookings: [],
      onboardingComplete: false,
      setProfile: (profile) => set({ profile }),
      setTwin: (twin) => set({ twin, onboardingComplete: true }),
      setRoadmap: (roadmap) => set({ roadmap }),
      addBooking: (b) => {
        const booking: Booking = { ...b, id: crypto.randomUUID(), createdAt: Date.now() };
        set((s) => ({ bookings: [...s.bookings, booking] }));
        return booking;
      },
      cancelBooking: (id) => set((s) => ({ bookings: s.bookings.filter((b) => b.id !== id) })),
      isSlotTaken: (salonId, date, time) =>
        get().bookings.some((b) => b.salonId === salonId && b.date === date && b.time === time),
      reset: () => set({ profile: null, twin: null, roadmap: null, bookings: [], onboardingComplete: false }),
    }),
    { name: "cura-ai-store", version: 2 }
  )
);
