"use client";
import dynamic from 'next/dynamic';
import HeaderSection from './home/HeaderSection';
import FooterSection from './home/FooterSection';

// const HeaderSection = dynamic(() => import('./home/HeaderSection'));
// const FooterSection = dynamic(() => import('./home/FooterSection'));

const ClientLayout = ({children}) => {
  return (
    <>
        <HeaderSection />
            {children}
        <FooterSection />
    </>
  );
};

export default ClientLayout;
