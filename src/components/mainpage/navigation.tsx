"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationLinks = () => {
  const path = usePathname() as string;

  return (
    <div className="mb-32 grid gap-x-1 text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
      <Link
        href="/tickets/it"
        className={clsx(
          "group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30",
          path === "/tickets/it" && "border-gray-300 bg-gray-100"
        )}
      >
        <h2 className={clsx(`mb-3 text-2xl font-semibold`)}>
          IT Tickets{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
          Submit a ticket or view your existing tickets.
        </p>
      </Link>

      <Link
        href="/tickets/maintenance"
        className={clsx(
          "group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30",
          path === "/tickets/maintenance" && "border-gray-300 bg-gray-100"
        )}
      >
        <h2 className={`mb-3 text-2xl font-semibold`}>
          Maintenance Tickets{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
          Submit a ticket or view your existing tickets.
        </p>
      </Link>

      <Link
        href="/files"
        className={clsx(
          "group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30",
          path === "/files" && "border-gray-300 bg-gray-100"
        )}
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={`mb-3 text-2xl font-semibold`}>
          My Files{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
          View a current phone directory.
        </p>
      </Link>

      <Link
        href="https://busseforce.com/"
        className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-blue-300 hover:bg-blue-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 bg-blue-400 text-white hover:text-black"
        target="_blank"
      >
        <h2 className={`mb-3 text-2xl font-semibold`}>
          Busseforce{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
          Go to internal sales platform, Busseforce.
        </p>
      </Link>
    </div>
  );
};

export default NavigationLinks;
