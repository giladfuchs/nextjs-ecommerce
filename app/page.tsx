import { Metadata } from "next";
import { getProducts } from "lib/api";
import ClientProduct from "components/product/ClientProduct";
import SidebarLayout from "components/layout/sidebar";
import { H1SeoTitle } from "components/shared/messages";
import {
  metadata_site_title,
  metadata_site_description,
} from "../lib/assets/i18n/seo_heb";
import { baseUrl, ICON_IMAGE_URL } from "../lib/config";

export const metadata: Metadata = {
  title: metadata_site_title,
  description: metadata_site_description,
  openGraph: {
    title: metadata_site_title,
    description: metadata_site_description,
    images: [ICON_IMAGE_URL],
    url: baseUrl,
    type: "website",
  },
};

export default async function HomePage() {
  const products = await getProducts();

  return (
    <SidebarLayout>
      <H1SeoTitle />
      <ClientProduct products={products} />
    </SidebarLayout>
  );
}
