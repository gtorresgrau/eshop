"use client";
import dynamic from 'next/dynamic';
import ClientLayout from './ClientLayout';

const MainContent = dynamic(() => import('./home/MainContent'), { ssr: false });

export default function HomePage() {
    return (
        <ClientLayout>
          <MainContent />
        </ClientLayout>
    );
}
