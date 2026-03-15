'use client';

import { Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import GlobalProviders from '@/components/layout/GlobalProviders';

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
});

export default function RootLayout({ children }) {
    return (
        <html lang="id" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#0a0a0a" />
                <link rel="icon" href="/images/icons/favicon.ico" />
                <link rel="apple-touch-icon" href="/images/icons/Logo.png" />

                {/* Anti-flash script */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                try {
                                    var theme = localStorage.getItem('komiko-theme');
                                    if (!theme) {
                                        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                                    }
                                    document.documentElement.setAttribute('data-theme', theme);
                                } catch (e) {}
                            })();
                        `,
                    }}
                />
            </head>
            <body className={`${poppins.variable} font-sans antialiased`}>
                <ThemeProvider>
                    <AuthProvider>
                        <ToastProvider>
                            <GlobalProviders>
                                {children}
                            </GlobalProviders>
                        </ToastProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

