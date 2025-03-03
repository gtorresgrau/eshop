"use client";
import dynamic from 'next/dynamic';
import ClientLayout from './ClientLayout';

const MainContent = dynamic(() => import('./home/MainContent'));

export default function HomePage({children}) {
    return (
        <ClientLayout>
          <MainContent />
        </ClientLayout>
    );
  }