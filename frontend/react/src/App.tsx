import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { routes } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {routes.map((route) => (
          <Route
            key={route.title}
            path={route.path}
            element={<route.element />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
