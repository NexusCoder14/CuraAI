import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Aurora } from "@/components/shared/Aurora";
import { Nav } from "@/components/shared/Nav";
import { PageTransition } from "@/components/shared/Reveal";

// Route-level code splitting → tiny per-route bundles → instant navigation
const Landing = lazy(() => import("./routes/Landing"));
const Chat = lazy(() => import("./routes/Chat"));
const Onboarding = lazy(() => import("./routes/Onboarding"));
const Twin = lazy(() => import("./routes/Twin"));
const Roadmap = lazy(() => import("./routes/Roadmap"));
const Look = lazy(() => import("./routes/Look"));
const Insights = lazy(() => import("./routes/Insights"));
const Booking = lazy(() => import("./routes/Booking"));
const Book = lazy(() => import("./routes/Book"));
const Profile = lazy(() => import("./routes/Profile"));

function PageFallback() {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-20">
      <div className="glass rounded-3xl h-[60vh] relative overflow-hidden">
        <div className="shimmer absolute inset-0" />
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  return (
    <>
      <Aurora />
      <Nav />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Suspense fallback={<PageFallback />}>
              <Routes location={location}>
                <Route path="/" element={<Landing />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/twin" element={<Twin />} />
                <Route path="/twin/onboarding" element={<Onboarding />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/look" element={<Look />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/book" element={<Book />} />
                <Route path="/booking/:id" element={<Booking />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Landing />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </AnimatePresence>
      </main>
    </>
  );
}
