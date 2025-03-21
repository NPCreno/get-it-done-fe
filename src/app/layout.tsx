import { ReactNode } from "react";
import { FormProvider } from "./context/FormProvider";
import "./globals.css";

export const metadata = {
  title: "Get it done",
  icons: "/get-it-done-icon.ico",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <FormProvider>{children}</FormProvider>
      </body>
    </html>
  );
}
