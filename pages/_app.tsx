import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../src/utils/contexts/Auth";
import BaseLayout from "../src/components/Templates/BaseLayout";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <BaseLayout>
        <ToastContainer />
        <Component {...pageProps} />
      </BaseLayout>
    </AuthProvider>
  );
}

export default MyApp;
