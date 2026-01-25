import { ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import "./index.css";
import { persistor, store } from "./redux/store.ts";
import router from "./routes/routes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#005151", // Dark Teal from logo
              colorLink: "#005151",
              colorWarning: "#FFA000", // Orange from logo
              borderRadius: 6,
              fontFamily: "'Roboto Mono', monospace",
            },
            components: {
              Button: {
                algorithm: true, // Enable algorithm for button
              },
            },
          }}
        >
          <RouterProvider router={router} />
        </ConfigProvider>
      </PersistGate>
      <Toaster />
    </Provider>
  </React.StrictMode>,
);
