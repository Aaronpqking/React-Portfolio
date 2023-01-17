import './App.css';
import Header from './components/Header';
// import Navigation from './components/Navigation';
import Home from "./components/Home"
import Contact from "./components/Contact"
import Project from './components/Project';
import Footer from './components/Footer';
import Resume from './components/Resume';
import { Routes, Route, BrowserRouter } from "react-router-dom"
import initFontAwesome from "./initFontAwesome";
initFontAwesome();

function App() {
  return (
    
    <div>
      <BrowserRouter>
        
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Project" element={<Project />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Resume" element={<Resume />} />
        </Routes>
        <Footer />
        
      </BrowserRouter>
    </div>
  )
}

export default App;
