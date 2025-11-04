// src/App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import ScrollToTop from "./routes/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;
