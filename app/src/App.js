import { drizzleReactHooks } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import React from "react";
import { HashRouter as Router } from "react-router-dom";
import IndexPage from "./components/pages/IndexPage";
import { AppProvider } from "./contexts/app";
import drizzleOptions from "./drizzleOptions";
const drizzle = new Drizzle(drizzleOptions);

const App = () => {
  return (
    <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
      <drizzleReactHooks.Initializer error="There was an error.">
        <Router>
          <AppProvider>
            <IndexPage />
          </AppProvider>
        </Router>
      </drizzleReactHooks.Initializer>
    </drizzleReactHooks.DrizzleProvider>
  );
};

export default App;
