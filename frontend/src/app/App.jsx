import AppProviders from "./providers/AppProviders";
import AppRoutes from "./router/AppRoutes";

const App = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;