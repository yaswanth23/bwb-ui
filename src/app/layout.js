import { Montserrat } from "next/font/google";
import Head from "next/head";
import { Provider } from "react-redux";
import "./globals.css";
import { store } from "../store/store";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "bwb",
  description: "bwb",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
