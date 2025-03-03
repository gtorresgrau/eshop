"use client";
import dynamic from 'next/dynamic';

const HeaderSection = dynamic(() => import('./home/HeaderSection'));
const FooterSection = dynamic(() => import('./home/FooterSection'));

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
