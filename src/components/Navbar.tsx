import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import ConnectWallet from './ConnectWallet';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Oracle Docs', href: '/docs' },
  { name: 'SDK', href: '/sdk' },
  { name: 'IncryptPredict', href: '/predict' },
  { name: 'DAO', href: '/dao' },
  { name: 'Staking', href: '/staking' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Smart Contracts', href: '/smart-contracts' },
  { name: 'Security', href: '/security' },
  { name: 'Roadmap', href: '/roadmap' },
  { name: 'Whitepaper', href: '/whitepaper' },
  { name: 'Partners', href: '/partners' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const isActive = (pathname: string) => {
    return router.pathname === pathname;
  };

  return (
    <header className="relative z-50">
      <nav className="flex items-center justify-between p-6 lg:px-8 backdrop-blur-md bg-dark-950/80 border-b border-white/10">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <img
              className="h-10 w-10 glow"
              src="/favicon.png"
              alt="Incrypt Oracle"
            />
            <span className="text-xl font-bold text-gradient">
              Incrypt Oracle
            </span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400 hover:text-primary-500"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

                <div className="hidden lg:flex lg:gap-x-6">
          {navigation.slice(0, 6).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-link ${isActive(item.href) ? 'active text-primary-500' : ''}`}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Dropdown for additional pages */}
          <div className="relative group">
            <button className="nav-link flex items-center" aria-label="More navigation options" type="button">
              More
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className="absolute top-full left-0 mt-1 w-56 bg-dark-900 border border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 grid grid-cols-2 gap-1 p-2">
              {navigation.slice(6).concat([{ name: 'Reports', href: '/reports' }]).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-gray-300 hover:text-primary-400 hover:bg-white/5 transition-colors rounded"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <ConnectWallet />
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden fixed inset-0 z-50"
        >
          <div className="fixed inset-y-0 right-0 w-full overflow-y-auto bg-dark-950 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
                <img
                  className="h-8 w-8 glow"
                  src="/favicon.png"
                  alt="Incrypt Oracle"
                />
                <span className="text-lg font-bold text-gradient">
                  Incrypt Oracle
                </span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-400 hover:text-primary-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/25">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors ${
                        isActive(item.href)
                          ? 'text-primary-500 bg-primary-500/10'
                          : 'text-white hover:bg-gray-800'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <ConnectWallet />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
