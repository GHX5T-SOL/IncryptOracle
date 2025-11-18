import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsPage() {
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
            <span className="text-gradient">Terms of Service</span>
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
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Incrypt Oracle and its associated services ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="mb-4">
              Incrypt Oracle provides:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Decentralized oracle services for data feeds on Binance Smart Chain</li>
              <li>Prediction market platform (IncryptPredict)</li>
              <li>DAO governance system for $IO token holders</li>
              <li>Staking and revenue distribution mechanisms</li>
              <li>Developer tools and APIs for oracle integration</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Eligibility</h2>
            <p className="mb-4">
              To use the Platform, you must:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Not be located in a jurisdiction where the use of the Platform is prohibited</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. User Responsibilities</h2>
            
            <h3 className="text-xl font-semibold text-primary-400 mb-3">4.1 Wallet Security</h3>
            <p className="mb-4">
              You are solely responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Maintaining the security of your private keys and wallet</li>
              <li>All transactions initiated from your wallet</li>
              <li>Ensuring your wallet has sufficient funds for transactions and gas fees</li>
            </ul>

            <h3 className="text-xl font-semibold text-primary-400 mb-3">4.2 Prohibited Activities</h3>
            <p className="mb-4">
              You agree NOT to:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Manipulate or attempt to manipulate oracle data feeds</li>
              <li>Engage in market manipulation or fraudulent trading</li>
              <li>Attack, hack, or disrupt the Platform's infrastructure</li>
              <li>Use the Platform for money laundering or illegal activities</li>
              <li>Impersonate others or provide false information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Risks and Disclaimers</h2>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-4">
              <h3 className="text-red-400 font-semibold mb-3">⚠️ Important Risk Warnings</h3>
              <ul className="space-y-2 text-sm">
                <li>• Prediction markets involve significant financial risk</li>
                <li>• Cryptocurrency values are volatile and unpredictable</li>
                <li>• Smart contracts may contain bugs or vulnerabilities</li>
                <li>• Blockchain transactions are irreversible</li>
                <li>• You may lose all funds invested in prediction markets</li>
                <li>• Past performance does not guarantee future results</li>
              </ul>
            </div>

            <p className="mb-4">
              THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Accuracy or reliability of oracle data</li>
              <li>Continuous availability or uptime of the Platform</li>
              <li>Profitability of any prediction market or investment</li>
              <li>Security from all potential vulnerabilities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
            <p className="mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, INCRYPT NETWORK AND ITS AFFILIATES SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Any direct, indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or opportunities</li>
              <li>Damages resulting from smart contract failures or exploits</li>
              <li>Losses due to market volatility or prediction outcomes</li>
              <li>Unauthorized access to your wallet or funds</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
            <p className="mb-4">
              The Platform and its original content, features, and functionality are owned by Incrypt Network and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              Our smart contracts are open-source under the MIT License. See our <a href="https://github.com/GHX5T-SOL/IncryptOracle" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">GitHub repository</a> for details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Governance and DAO</h2>
            <p className="mb-4">
              As an $IO token holder, you may participate in governance:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Voting power is proportional to token holdings</li>
              <li>All votes are final and executed on-chain</li>
              <li>You are responsible for understanding proposal implications</li>
              <li>Governance participation does not create partnership or agency</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Incrypt Network, its affiliates, and service providers from any claims, damages, losses, or expenses arising from your use of the Platform or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Termination</h2>
            <p>
              We reserve the right to terminate or suspend access to the Platform immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Platform will cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable international laws, without regard to conflict of law provisions. Any disputes shall be resolved through binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be announced through our official communication channels. Continued use of the Platform after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms, please contact us:
            </p>
            <ul className="space-y-2">
              <li>• Email: <a href="mailto:legal@incryptoracle.com" className="text-primary-400 hover:text-primary-300">legal@incryptoracle.com</a></li>
              <li>• Discord: <a href="https://discord.gg/XPSCUYVM65" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">Community Support</a></li>
              <li>• GitHub: <a href="https://github.com/GHX5T-SOL/IncryptOracle" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">IncryptOracle Repository</a></li>
            </ul>
          </section>

          <div className="pt-8 border-t border-white/10 flex justify-between">
            <Link href="/" className="text-primary-400 hover:text-primary-300">
              ← Back to Home
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
