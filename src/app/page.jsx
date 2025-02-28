"use client";
import dynamic from 'next/dynamic';

const HeaderSection = dynamic(() => import('./home/HeaderSection'));
const MainContent = dynamic(() => import('./home/MainContent'));
const FooterSection = dynamic(() => import('./home/FooterSection'));

export default function HomePage() {
    return (
      <>
        <HeaderSection />
        <MainContent />
        <FooterSection />
      </>
    );
  }