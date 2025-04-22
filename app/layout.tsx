import {Navbar} from 'components/layout/navbar';
import {GeistSans} from 'geist/font/sans';
import {ReactNode} from 'react';
import './globals.css';
import {baseUrl} from 'lib/utils';
import Providers from "./providers";
import '../styles/theme.scss';

import { Assistant } from 'next/font/google';

const assistant = Assistant({
    subsets: ['hebrew'],
    weight: ['400', '700'],
});
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
        <html lang="he" dir="rtl"className={`${GeistSans.variable} ${assistant.className}`}>
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
