import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPage() {
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
            <span className="text-gradient">Privacy Policy</span>
          </h1>
          <p className="text-gray-400">
            Last Updated: January 21, 2025
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-liquid-glass p-8 space-y-8 text-gray-300"
        >
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Incrypt Network ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our decentralized oracle platform and prediction market services.
            </p>
            <p>
              By accessing or using Incrypt Oracle, you agree to this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-primary-400 mb-3">2.1 Blockchain Data</h3>
            <p className="mb-4">
              As a decentralized platform, we interact with blockchain data that is publicly available:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Wallet addresses</li>
              <li>Transaction history</li>
              <li>Token balances</li>
              <li>Smart contract interactions</li>
              <li>Voting records on governance proposals</li>
            </ul>

            <h3 className="text-xl font-semibold text-primary-400 mb-3">2.2 Usage Information</h3>
            <p className="mb-4">
              We may collect information about how you interact with our platform:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>IP address (anonymized)</li>
              <li>Pages visited and time spent</li>
              <li>Click patterns and interactions</li>
            </ul>

            <h3 className="text-xl font-semibold text-primary-400 mb-3">2.3 Information We Do NOT Collect</h3>
            <p className="mb-4">
              We do not collect or store:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Private keys or seed phrases</li>
              <li>Personal identification information (name, email, phone)</li>
              <li>Financial information beyond public blockchain data</li>
              <li>Passwords or authentication credentials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">
              We use the collected information for:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Providing and maintaining our oracle services</li>
              <li>Improving user experience and platform functionality</li>
              <li>Detecting and preventing fraud or security issues</li>
              <li>Analyzing usage patterns to enhance our services</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Storage and Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Encryption of data in transit using HTTPS/SSL</li>
              <li>Secure smart contract architecture with audited code</li>
              <li>No centralized storage of sensitive user data</li>
              <li>Regular security audits and penetration testing</li>
            </ul>
            <p>
              However, please note that blockchain transactions are permanent and publicly visible. Any on-chain activity cannot be deleted or modified.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Third-Party Services</h2>
            <p className="mb-4">
              Our platform integrates with third-party services that may collect information:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>WalletConnect</strong>: For wallet connectivity</li>
              <li><strong>Vercel</strong>: For hosting and content delivery</li>
              <li><strong>Binance Smart Chain</strong>: Blockchain network provider</li>
              <li><strong>Analytics Providers</strong>: For usage statistics (anonymized)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
            <p className="mb-4">
              We use essential cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Maintain your session and preferences</li>
              <li>Analyze platform usage and performance</li>
              <li>Provide a personalized experience</li>
            </ul>
            <p>
              You can control cookies through your browser settings. For more information, see our <Link href="/cookies" className="text-primary-400 hover:text-primary-300">Cookie Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Access the information we have about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data (where applicable)</li>
              <li>Opt-out of certain data collection</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
            <p>
              Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="space-y-2">
              <li>• Email: <a href="mailto:privacy@incryptoracle.com" className="text-primary-400 hover:text-primary-300">privacy@incryptoracle.com</a></li>
              <li>• Discord: <a href="https://discord.gg/XPSCUYVM65" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Join our community</a></li>
              <li>• GitHub: <a href="https://github.com/GHX5T-SOL/IncryptOracle/issues" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Open an issue</a></li>
            </ul>
          </section>

          <div className="pt-8 border-t border-white/10">
            <Link href="/" className="text-primary-400 hover:text-primary-300">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
