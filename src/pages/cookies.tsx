import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            <span className="text-gradient">Cookie Policy</span>
          </h1>
          <p className="text-gray-400">
            Last Updated: November 18, 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-liquid-glass p-8 space-y-8 text-gray-300"
        >
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit our Platform. They help us provide you with a better experience by remembering your preferences and understanding how you use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
            
            <h3 className="text-xl font-semibold text-primary-400 mb-3">2.1 Essential Cookies</h3>
            <p className="mb-4">
              These cookies are necessary for the Platform to function properly:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li><strong>Session Management</strong>: Maintain your login state and wallet connection</li>
              <li><strong>Security</strong>: Protect against fraudulent activities</li>
              <li><strong>Load Balancing</strong>: Distribute traffic for optimal performance</li>
            </ul>

            <h3 className="text-xl font-semibold text-primary-400 mb-3">2.2 Functional Cookies</h3>
            <p className="mb-4">
              These cookies enhance your experience:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li><strong>Preferences</strong>: Remember your settings (theme, language)</li>
              <li><strong>Wallet Connection</strong>: Remember your previously connected wallet</li>
              <li><strong>Network Selection</strong>: Remember your preferred blockchain network</li>
            </ul>

            <h3 className="text-xl font-semibold text-primary-400 mb-3">2.3 Analytics Cookies</h3>
            <p className="mb-4">
              These cookies help us understand how users interact with the Platform:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li><strong>Usage Statistics</strong>: Pages visited, time spent, click patterns</li>
              <li><strong>Performance Metrics</strong>: Page load times, errors, crashes</li>
              <li><strong>User Flow</strong>: Navigation patterns and user journeys</li>
            </ul>
            <p className="text-sm">
              Note: All analytics data is anonymized and does not personally identify you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Cookies</h2>
            <p className="mb-4">
              Some cookies are placed by third-party services we use:
            </p>
            
            <div className="space-y-4">
              <div className="bg-dark-900/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-2">WalletConnect</h4>
                <p className="text-sm">
                  Enables secure wallet connections. See <a href="https://walletconnect.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">WalletConnect Privacy Policy</a>.
                </p>
              </div>

              <div className="bg-dark-900/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-2">Vercel Analytics</h4>
                <p className="text-sm">
                  Provides hosting and performance analytics. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Vercel Privacy Policy</a>.
                </p>
              </div>

              <div className="bg-dark-900/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-2">Binance Smart Chain</h4>
                <p className="text-sm">
                  Blockchain network provider. All transactions are public and permanent on the blockchain.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Cookie Types and Duration</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-white py-3">Cookie Type</th>
                    <th className="text-left text-white py-3">Purpose</th>
                    <th className="text-left text-white py-3">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">Session Cookies</td>
                    <td className="py-3">Maintain user session</td>
                    <td className="py-3">Until browser closes</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">Wallet Connection</td>
                    <td className="py-3">Remember connected wallet</td>
                    <td className="py-3">30 days</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">Preferences</td>
                    <td className="py-3">Store user settings</td>
                    <td className="py-3">1 year</td>
                  </tr>
                  <tr>
                    <td className="py-3">Analytics</td>
                    <td className="py-3">Track usage patterns</td>
                    <td className="py-3">2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-semibold text-primary-400 mb-3">5.1 Browser Settings</h3>
            <p className="mb-4">
              Most web browsers allow you to control cookies through settings. You can:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>View what cookies are stored and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Delete all cookies when you close your browser</li>
              <li>Accept or reject cookies each time they're set</li>
            </ul>

            <h3 className="text-xl font-semibold text-primary-400 mb-3">5.2 Impact of Disabling Cookies</h3>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-sm text-yellow-300">
                <strong>⚠️ Note:</strong> Disabling essential cookies may prevent you from using certain features of the Platform, including wallet connections and market trading.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Do Not Track Signals</h2>
            <p>
              Some browsers have a "Do Not Track" feature that signals websites you visit that you do not want to have your online activity tracked. Our Platform currently does not respond to Do Not Track signals, as there is no industry standard for how to respond to such signals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Changes to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
            <p className="mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <ul className="space-y-2">
              <li>• Email: <a href="mailto:privacy@incryptoracle.com" className="text-primary-400 hover:text-primary-300">privacy@incryptoracle.com</a></li>
              <li>• Discord: <a href="https://discord.gg/XPSCUYVM65" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Join our community</a></li>
            </ul>
          </section>

          <div className="pt-8 border-t border-white/10 flex justify-between">
            <Link href="/terms" className="text-primary-400 hover:text-primary-300">
              ← Terms of Service
            </Link>
            <Link href="/privacy" className="text-primary-400 hover:text-primary-300">
              Privacy Policy →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
