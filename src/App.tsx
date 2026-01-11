import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { StartupsProvider } from './context/StartupsContext';
import Layout from './components/Layout';
import EcosystemPage from './pages/EcosystemPage';
import LandingPage from './pages/LandingPage';
import StatsPage from './pages/StatsPage';

export default function App() {
  return (
    <HashRouter>
      <StartupsProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="explore" element={<EcosystemPage />} />

            <Route path="stats" element={<StatsPage />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </StartupsProvider>
    </HashRouter>
  );
}
