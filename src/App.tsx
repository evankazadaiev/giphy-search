import {Route, Routes} from "react-router-dom";
import SearchPage from "./pages/SearchPage.tsx";

function App() {
  return (
      <Routes>
          <Route path="/" element={<SearchPage />} />
      </Routes>
  )
}

export default App
