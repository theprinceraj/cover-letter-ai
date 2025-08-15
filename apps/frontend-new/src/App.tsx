import { Route, Routes } from "react-router";
import "./App.css";
import { FRONTEND_ENDPOINTS } from "./constants";
import { Landing } from "./pages/Landing";
import { UI } from "./pages/UI";

function App() {
    return (
        <Routes>
            <Route path="/ui" element={<UI />} />
            <Route path={FRONTEND_ENDPOINTS.LANDING} element={<Landing />} />
        </Routes>
    );
}

export default App;
