import React from 'react';
import SheetExample from './components/SheetExample';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Subscribe from './components/Subscribe';
import Footer from './components/Footer';
import WhatsAppFloating from './components/WhatsAppFloating';
import Login from './components/Login';
import AdminDashboard from './components/admin/AdminDashboard';

function HomePage() {
  return (
    <main className="pt-32">
      <Hero />
      <About />
      <Gallery />
      <Contact />
      <Subscribe />
    </main>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <HomePage />
                  <Footer />
                  <WhatsAppFloating />
                </>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
