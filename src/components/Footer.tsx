import React from 'react';
import Link from 'next/link';

const navigation = {
  product: [
    { name: 'Oracle', href: '/docs' },
    { name: 'SDK', href: '/sdk' },
    { name: 'IncryptPredict', href: '/predict' },
    { name: 'DAO', href: '/dao' },
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'Testnet Reports', href: '/reports' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'GitHub', href: 'https://github.com/GHX5T-SOL/IncryptOracle' },
  ],
  community: [
    { name: 'Discord', href: 'https://discord.gg/XPSCUYVM65' },
    { name: 'Twitter', href: 'https://x.com/Incrypt_defi' },
    { name: 'Medium', href: '#' },
    { name: 'GitHub', href: 'https://github.com/GHX5T-SOL/IncryptOracle' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark-900/50 border-t border-white/10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <img
                className="h-8 w-8 glow"
                src="/favicon.png"
                alt="Incrypt Oracle"
              />
              <span className="text-lg font-bold text-gradient">
                Incrypt Oracle
              </span>
            </Link>
            <p className="text-sm leading-6 text-gray-300">
              Decentralized prediction market oracle on Binance Smart Chain. 
              Powering the future of prediction markets with reliable, fast, and secure data feeds.
            </p>
            <div className="flex space-x-6">
              {navigation.community.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200"
                >
                  <span className="sr-only">{item.name}</span>
                  {/* Social icons would go here */}
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-primary-500 transition-colors duration-200">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Resources</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-primary-500 transition-colors duration-200">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Developer</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="/docs" className="text-sm leading-6 text-gray-300 hover:text-primary-500 transition-colors duration-200">
                      API Documentation
                    </Link>
                  </li>
                  <li>
                    <a href="https://github.com/GHX5T-SOL/IncryptOracle/tree/main/sdk" target="_blank" rel="noopener noreferrer" className="text-sm leading-6 text-gray-300 hover:text-primary-500 transition-colors duration-200">
                      JavaScript SDK
                    </a>
                  </li>
                  <li>
                    <Link href="/reports" className="text-sm leading-6 text-gray-300 hover:text-primary-500 transition-colors duration-200">
                      Smart Contract Audits
                    </Link>
                  </li>
                  <li>
                    <a href="https://github.com/GHX5T-SOL/IncryptOracle" target="_blank" rel="noopener noreferrer" className="text-sm leading-6 text-gray-300 hover:text-primary-500 transition-colors duration-200">
                      Open Source Code
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-col sm:flex-row sm:justify-between items-center">
            <p className="text-xs leading-5 text-gray-400">
              © 2025 Incrypt Network. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0 flex space-x-6 text-xs leading-5 text-gray-400">
              <Link href="/privacy" className="hover:text-primary-500 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary-500 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-primary-500 transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
