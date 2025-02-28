"use client";

import Loading from '../components/Loading/Loading';
import dynamic from 'next/dynamic';

const HeaderSection = dynamic(() => import('./home/HeaderSection'), { 
    ssr: false, 
    loading: () => <Loading /> 
});
const MainContent = dynamic(() => import('./home/MainContent'), { 
    ssr: false, 
    loading: () => <Loading /> 
});
const FooterSection = dynamic(() => import('./home/FooterSection'), { 
    ssr: false, 
    loading: () => <Loading /> 
});

export default function HomePage() {
    return (
      <>
        <HeaderSection />
        <MainContent />
        <FooterSection />
      </>
    );
  }