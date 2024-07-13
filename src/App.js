import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import Quiz from "./components/quiz/Quiz";
import Footer from "./components/footer/Footer";
import Hero from "./components/hero/Hero";
import CreateMCQs from "./components/gen-quiz/CreateMCQs";

function App() {
  return (
  <BrowserRouter>
  <Header/>
  
  <Routes>
    <Route path="/" element={<Hero/>}  />
    <Route path="/create-mcq" element={<CreateMCQs/>}  />
    <Route path="/generate-mcq" element={<Quiz/>}  />

  </Routes>
  <Footer/>
  </BrowserRouter>
  );
}

export default App;
