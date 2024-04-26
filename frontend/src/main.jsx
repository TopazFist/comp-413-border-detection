import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

/**
 * Render the root of the React application.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  // Wrap the App component with BrowserRouter for routing functionality
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
