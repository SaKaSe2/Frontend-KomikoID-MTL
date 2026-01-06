import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NetworkStatus from '@/components/ui/NetworkStatus';
import HelpButton from '@/components/ui/HelpButton';

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <NetworkStatus />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <HelpButton />
        </div>
    );
}

