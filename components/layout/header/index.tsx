import Link from "next/link";
import HeaderControls from "./HeaderControls";
import Cart from "components/cart/Cart";
import Logo from "components/layout/header/Logo";
import { API_URL } from "../../../lib/config";

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 flex flex-col items-center p-4 lg:px-6 bg-theme dark:bg-theme-dark backdrop-blur">
      <div className="flex w-full items-center justify-between">
        <Link href="/" prefetch={true} className="flex items-center">
          <Logo />
        </Link>
        {!API_URL.includes("server") && <h2 style={{ color: "red" }}>DEMO</h2>}
        <div className="flex w-full md:w-1/3 justify-center px-2">
          <HeaderControls />
        </div>
        <div className="flex justify-end w-auto md:w-1/3">
          <Cart />
        </div>
      </div>
    </nav>
  );
}
