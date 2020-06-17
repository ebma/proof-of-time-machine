import React from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
import IndexPage from "./components/pages/IndexPage";
import { AppProvider } from "./contexts/app";

const drizzle = new Drizzle(drizzleOptions);

const App = () => {
  return (
    <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
      <drizzleReactHooks.Initializer error="There was an error.">
        <AppProvider>
          <IndexPage />
        </AppProvider>
      </drizzleReactHooks.Initializer>
    </drizzleReactHooks.DrizzleProvider>
  );
};

export default App;
