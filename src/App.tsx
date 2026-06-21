import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import SplashScreen from './screens/SplashScreen';
import LandingPage from './screens/LandingPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
