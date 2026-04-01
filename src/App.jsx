import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import PortfolioView from './components/Dashboard/PortfolioView';
import BuildingView from './components/Building/BuildingView';
import EnergyView from './components/Energy/EnergyView';
import FinancialView from './components/Financial/FinancialView';
import ReportsView from './components/Reports/ReportsView';
import SupportView from './components/Support/SupportView';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <Routes>
          <Route path="/" element={<PortfolioView />} />
          <Route path="/building" element={<BuildingView />} />
          <Route path="/energy" element={<EnergyView />} />
          <Route path="/financial" element={<FinancialView />} />
          <Route path="/reports" element={<ReportsView />} />
          <Route path="/support" element={<SupportView />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
