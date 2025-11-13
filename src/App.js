import './App.css';
import Header from './components/Header';
import Home from "./components/Home"
import Contact from "./components/Contact"
import Footer from './components/Footer';
import Resume from './components/Resume';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import AIChatPage from './components/ai/AIChatPage';
import ProjectEstimator from './components/ai/ProjectEstimator';
import ConversationalProjectAdvisor from './components/ai/ConversationalProjectAdvisor';
import WorkflowAnalyzer from './components/ai/WorkflowAnalyzer';
import SOPGenerator from './components/ai/SOPGenerator';
import EmailResponseGenerator from './components/ai/EmailResponseGenerator';
import ProposalGenerator from './components/ai/ProposalGenerator';
import PropertySummaryGenerator from './components/ai/PropertySummaryGenerator';
import AIDemos from './pages/AIDemos';
import AIChatWidget from './components/ai/AIChatWidget';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom"
import { HelmetProvider } from 'react-helmet-async';
import initFontAwesome from "./initFontAwesome";
import 'bootstrap/dist/css/bootstrap.min.css';
initFontAwesome();

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <div>
          <BrowserRouter>
            <ErrorBoundary>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
                <Route path="/ai-demos" element={<AIDemos />} />
                <Route path="/ai-chat" element={<AIChatPage />} />
                <Route path="/ai-estimator" element={<ConversationalProjectAdvisor />} />
                <Route path="/project-estimator" element={<ProjectEstimator />} />
                <Route path="/ai-workflow-analyzer" element={<WorkflowAnalyzer />} />
                <Route path="/ai-sop-generator" element={<SOPGenerator />} />
                <Route path="/ai-email-generator" element={<EmailResponseGenerator />} />
                <Route path="/ai-proposal-generator" element={<ProposalGenerator />} />
                <Route path="/ai-property-summary" element={<PropertySummaryGenerator />} />
                <Route path="/Project" element={<Navigate to="/case-studies" replace />} />
                <Route path="/projects" element={<Navigate to="/case-studies" replace />} />
                <Route path="/Resume" element={<Resume />} />
                <Route path="/Contact" element={<Contact />} />
              </Routes>
              <AIChatWidget onExpand={() => window.location.href = '/ai-chat'} />
              <Footer />
            </ErrorBoundary>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App;
