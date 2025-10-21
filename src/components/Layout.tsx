import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import ParticleBackground from './ParticleBackground';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ 
  children, 
  title = 'Incrypt Oracle', 
  description = 'Decentralized prediction market oracle on Binance Smart Chain' 
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-dark-950 text-white relative overflow-x-hidden">
        <ParticleBackground />
        
        <div className="relative z-10">
          <Navbar />
          
          <main className="flex-1">
            {children}
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
}
