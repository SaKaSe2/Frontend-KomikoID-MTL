import Navbar from '@/components/layout/navbar';

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}