import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/provider/auth-provider";
import { CssBaseline } from "@mui/material";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Kanban Board",
  description: "Kanban Board Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} antialiased`}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ className: "text-sm", duration: 3000 }}
        />
        <CssBaseline />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
