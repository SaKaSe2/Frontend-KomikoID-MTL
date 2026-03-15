import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NetworkStatus from '@/components/ui/NetworkStatus';
import HelpButton from '@/components/ui/HelpButton';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

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
            <MobileBottomNav />
        </div>
    );
}
