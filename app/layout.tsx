import {CartProvider} from 'components/cart/cart-context';
import {Navbar} from 'components/layout/navbar';
import {WelcomeToast} from 'components/welcome-toast';
import {GeistSans} from 'geist/font/sans';
import {getCart} from 'lib/shopify';
import {ReactNode} from 'react';
import {Toaster} from 'sonner';
import './globals.css';
import {baseUrl} from 'lib/utils';
import {Cart} from "../lib/shopify/types";
import Providers from "./providers";
import '../styles/theme.scss';
import {useStore} from "../lib/store";


const {SITE_NAME} = process.env;

export const metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: SITE_NAME!,
        template: `%s | ${SITE_NAME}`
    },
    robots: {
        follow: true,
        index: true
    }
};

export default async function RootLayout({
                                             children
                                         }: {
    children: ReactNode;
}) {



    return (
        <html lang="en" className={GeistSans.variable}>
        <body
            className="bg-theme text-theme selection:bg-teal-300 dark:bg-theme-dark dark:text-theme dark:selection:bg-pink-500 dark:selection:text-white">
        <Providers>
            <Navbar/>
            <main>{children}</main>
        </Providers>
        </body>
        </html>
    );
}
