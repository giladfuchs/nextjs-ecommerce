import NavbarClient from "./Navbar.client";
import { Menu } from "../../../lib/shopify/types";

export async function Navbar() {
  const menu = [] as Menu[];
  return <NavbarClient menu={menu} />;
}
