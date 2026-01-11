import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { StartupsProvider } from './context/StartupsContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';

import StatsPage from './pages/StatsPage';

export default function App() {
  return (
    <HashRouter>
      <StartupsProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />

            <Route path="stats" element={<StatsPage />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </StartupsProvider>
    </HashRouter>
  );
}
