import NavbarClient from "./Navbar.client";
import { Menu } from "../../../lib/types";

export async function Navbar() {
  const menu = [] as Menu[];
  return <NavbarClient menu={menu} />;
}
