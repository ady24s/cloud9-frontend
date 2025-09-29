import React, { useState } from "react"; // <== you forgot useState
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SecurityOverview from "./components/SecurityOverview";
import BudgetPage from "./components/BudgetPage";
import Optimizer from "./components/Optimizer";
import LoginPage from "./components/LoginPage";
import AccountLoginPage from "./components/AccountLoginPage";
import CloudCredentials from "./components/CloudCredentials";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [provider, setProvider] = useState(null); // <== ADD this line

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<AccountLoginPage setProvider={setProvider} />}
        />{" "}
        {/* <== FIX here */}
        <Route
          path="/dashboard"
          element={<Dashboard provider={provider} />}
        />{" "}
        {/* <== pass provider */}
        <Route path="/CloudCredentials" element={<CloudCredentials />} />
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/security" element={<SecurityOverview />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/optimizer" element={<Optimizer />} />
      </Routes>
    </Router>
  );
}

export default App;
