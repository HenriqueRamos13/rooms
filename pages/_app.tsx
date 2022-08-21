import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../src/utils/contexts/Auth";
import BaseLayout from "../src/components/Templates/BaseLayout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </AuthProvider>
  );
}

export default MyApp;
