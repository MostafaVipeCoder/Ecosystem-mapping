import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StartupsProvider } from './context/StartupsContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';

import StatsPage from './pages/StatsPage';

export default function App() {
  return (
    <BrowserRouter>
      <StartupsProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />

            <Route path="stats" element={<StatsPage />} />
          </Route>
        </Routes>
      </StartupsProvider>
    </BrowserRouter>
  );
}
