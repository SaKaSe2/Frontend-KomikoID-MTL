export const metadata = {
    title: {
        default: 'KomikoID - Baca Komik Terjemahan Indonesia',
        template: '%s | KomikoID',
    },
    description: 'Baca komik manga, manhwa, dan manhua dengan terjemahan bahasa Indonesia. Terjemahan otomatis berkualitas dengan teknologi MTL terbaru.',
    keywords: ['komik', 'manga', 'manhwa', 'manhua', 'baca komik', 'terjemahan indonesia', 'MTL'],
    authors: [{ name: 'KomikoID' }],
    creator: 'KomikoID',
    publisher: 'KomikoID',
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: 'website',
        locale: 'id_ID',
        url: 'https://komiko.id',
        siteName: 'KomikoID',
        title: 'KomikoID - Baca Komik Terjemahan Indonesia',
        description: 'Baca komik manga, manhwa, dan manhua dengan terjemahan bahasa Indonesia.',
        images: [
            {
                url: '/images/icons/Logo.png',
                width: 512,
                height: 512,
                alt: 'KomikoID Logo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'KomikoID - Baca Komik Terjemahan Indonesia',
        description: 'Baca komik manga, manhwa, dan manhua dengan terjemahan bahasa Indonesia.',
        images: ['/images/icons/Logo.png'],
    },
    manifest: '/manifest.json',
    icons: {
        icon: '/images/icons/favicon.ico',
        apple: '/images/icons/Logo.png',
    },
};

export { default } from './layout';
