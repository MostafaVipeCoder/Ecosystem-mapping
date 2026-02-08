import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { StartupsProvider } from './context/StartupsContext';
import Layout from './components/Layout';
import { Loader2 } from 'lucide-react';

// Lazy load pages
const EcosystemPage = lazy(() => import('./pages/EcosystemPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));
const AddDataPage = lazy(() => import('./pages/AddDataPage'));

// Loading fallback components
const LoadingScreen = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    <p className="text-slate-500 font-medium animate-pulse">Loading experience...</p>
  </div>
);

export default function App() {
  return (
    <HashRouter>
      <StartupsProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="explore" element={<EcosystemPage />} />
              <Route path="stats" element={<StatsPage />} />
            </Route>

            {/* Hidden Portal Route - Outside Main Layout */}
            <Route path="/portal" element={<AddDataPage />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" richColors />
      </StartupsProvider>
    </HashRouter>
  );
}
