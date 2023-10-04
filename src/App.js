import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaymentPage from './components/payment-page/PaymentPage';
import './components/payment-page/PaymentPage.css';
import PaymentResult from './components/payment-result/PaymentResult';
import './components/payment-result/PaymentResult.css';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<PaymentPage />} />
          <Route path="/payment-result" element={<PaymentResult />} />
        </Routes>
    </Router>
  );
}

export default App;

