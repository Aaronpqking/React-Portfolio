import './App.css';
import Header from './components/Header';
import Home from "./components/Home"
import Contact from "./components/Contact"
import Project from './components/Project';
import Footer from './components/Footer';
import Resume from './components/Resume';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import ErrorBoundary from './components/ErrorBoundary';
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom"
import { HelmetProvider } from 'react-helmet-async';
import initFontAwesome from "./initFontAwesome";
import 'bootstrap/dist/css/bootstrap.min.css';
initFontAwesome();

function App() {
  return (
    <HelmetProvider>
      <div>
        <BrowserRouter>
          <ErrorBoundary>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
              <Route path="/Project" element={<Navigate to="/case-studies" replace />} />
              <Route path="/projects" element={<Navigate to="/case-studies" replace />} />
              <Route path="/Resume" element={<Resume />} />
              <Route path="/Contact" element={<Contact />} />
            </Routes>
            <Footer />
          </ErrorBoundary>
        </BrowserRouter>
      </div>
    </HelmetProvider>
  )
}

export default App;
