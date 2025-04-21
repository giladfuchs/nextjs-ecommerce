import { getMenu } from 'lib/shopify';
import NavbarClient from './Navbar.client';

export  async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');
  return <NavbarClient menu={menu} />;
}