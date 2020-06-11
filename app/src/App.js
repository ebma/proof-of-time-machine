import React from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
import IndexPage from "./components/pages/IndexPage";

const drizzle = new Drizzle(drizzleOptions);

const App = () => {
  return (
    <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
      <drizzleReactHooks.Initializer error="There was an error.">
        <IndexPage />
      </drizzleReactHooks.Initializer>
    </drizzleReactHooks.DrizzleProvider>
  );
};

export default App;
