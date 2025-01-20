import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { hiddenRoutes, routes } from "./routes";

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
        {hiddenRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.element />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
