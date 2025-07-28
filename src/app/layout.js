import "./globals.css";
import Navbar from "../components/Navbar"; // ✅ Adjust path if needed

export const metadata = {
  title: "Hyprsets",
  description: "Track your gym progress and dominate the leaderboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-100">
        <Navbar />
        <main className="p-6 max-w-4xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
