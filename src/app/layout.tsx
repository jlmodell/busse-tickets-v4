import Link from "next/link";

import "./globals.css";
import { Inter } from "next/font/google";

import NavigationLinks from "@/components/mainpage/navigation";
import Provider from "@/components/mainpage/sessionprovider";
import LoginButtons from "@/components/layout/loginbuttons";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Busse Tickets v4.0",
  description:
    "Internal ticketing system for IT and Maintenance at Busse Hospital Disposables",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <main className="flex min-h-screen flex-col items-center justify-between p-3 md:p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm flex mt-[10vh] lg:mt-0 lg:flex-row flex-col">
              <Link
                href="/"
                className="fixed text-white left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-blue-400 to-blue-400/30 pb-6 pt-8 backdrop-blur-lg dark:border-neutral-800 dark:bg-zinc-800/50 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"
              >
                Busse
                <span className="italic">Tickets</span>
              </Link>

              <div className="hidden fixed bottom-0 left-0 lg:flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                <p className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0">
                  <span className="font-semibold underline">Today</span>:{" "}
                  {new Date().toLocaleDateString("en-US", {})},{" "}
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {/* @ts-expect-error Async Server Component */}
              <LoginButtons />
            </div>

            <div className="w-full flex justify-center items-center mt-10 mb-32">
              {children}
            </div>
            <NavigationLinks />
          </main>
        </Provider>
      </body>
    </html>
  );
}
