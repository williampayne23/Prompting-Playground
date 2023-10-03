export const metadata = {
  title: "Playground",
  description: "",
};

import "~/styles/globals.css";
import Link from "next/link";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-[100vh] flex-grow flex-col">
        <nav className="flex items-center justify-between bg-blue-500 p-4">
          <Link href="/" className="text-lg font-bold text-white">
            Home
          </Link>
          <div className="flex space-x-4"></div>
        </nav>
        <div id="content" className="grow">
          {children}
        </div>
      </body>
    </html>
  );
}

export default RootLayout;
