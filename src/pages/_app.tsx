import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme";
import { AuthProvider } from "@/context/AuthContext";
import { SeasonProvider } from "@/context/SeasonContext";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <SeasonProvider>
                <AuthProvider>
                    <Component {...pageProps} />
                </AuthProvider>
            </SeasonProvider>
        </ChakraProvider>
    );
}
