import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  ChartBarIcon,
  CpuChipIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const partnerFocus = [
  {
    category: 'DeFi Protocols',
    icon: ChartBarIcon,
    description: 'Planning collaborations with DEXs, lending markets, and structured product teams once the mainnet launch is cleared.',
    readiness: 'Collecting interest — no signed partners yet.'
  },
  {
    category: 'Infrastructure',
    icon: CpuChipIcon,
    description: 'Coordinating with RPC providers, data indexers, and oracle tooling teams to ensure compatibility with our stack.',
    readiness: 'Evaluating tooling integrations during private beta.'
  },
  {
    category: 'Security & Audits',
    icon: ShieldCheckIcon,
    description: 'Targeting third-party auditors and security reviewers after completing the AI beta assessment.',
    readiness: 'Preparing submissions for firms such as CertiK or Halborn (not yet audited by them).'
  }
];

const readinessStats = [
  { metric: 'Official Partners', value: '0', detail: 'Actively seeking; no agreements signed yet' },
  { metric: 'External Integrations', value: 'Demo/Testnet only', detail: 'Internal usage until launch' },
  { metric: 'Validator Nodes', value: '3 testnet nodes', detail: 'Operated by the core team' },
  { metric: 'Launch Window', value: 'Private beta Nov 2025', detail: 'Public roadmap to be confirmed' }
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            <span className="text-gradient">Partnership Program Preview</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We are laying the groundwork for future collaborations, but as of November 18, 2025 no official partners,
            integrations, or endorsements have been signed. This page outlines the categories we plan to work with once
            the platform leaves private beta.
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-300">
              🚧 Honest status: all data shown here reflects intentions and testnet progress—nothing on this page should be
              interpreted as an existing partnership or audit.
            </p>
          </div>
        </motion.div>

        {/* Readiness Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {readinessStats.map((stat, index) => (
            <div key={index} className="card-liquid-glass p-6">
              <div className="text-sm uppercase tracking-wide text-gray-400 mb-2">{stat.metric}</div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.detail}</div>
            </div>
          ))}
        </motion.div>

        {/* Partner Focus */}
        <div className="space-y-16">
          {partnerFocus.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <motion.section
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="p-3 bg-primary-500/20 rounded-lg">
                      <IconComponent className="w-8 h-8 text-primary-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">{category.category}</h2>
                  </div>
                  <p className="text-gray-300 max-w-2xl mx-auto">{category.description}</p>
                </div>

                <div className="max-w-2xl mx-auto card-liquid-glass p-6 text-center">
                  <p className="text-sm uppercase tracking-wide text-gray-400 mb-2">Status</p>
                  <p className="text-lg font-semibold text-white">{category.readiness}</p>
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Become a Partner CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 text-center"
        >
          <div className="card-liquid-glass p-12">
            <BuildingOfficeIcon className="w-16 h-16 text-primary-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Become a Partner
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-4">
              We&apos;re gathering interest from teams that want to collaborate once the protocol clears third-party audits
              and exits private beta. Share your needs so we can line up technical deep dives ahead of launch.
            </p>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto mb-8">
              Note: as of November 18, 2025 we have zero official partners or endorsements. Outreach today simply reserves a spot on our follow-up list.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Technical Support</h3>
                <p className="text-sm text-gray-300">
                  Dedicated developer support, custom integrations, and technical documentation.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Marketing Co-op</h3>
                <p className="text-sm text-gray-300">
                  Joint marketing campaigns, community cross-promotion, and ecosystem growth.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Revenue Sharing</h3>
                <p className="text-sm text-gray-300">
                  Competitive revenue sharing models and long-term partnership benefits.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:incryptinvestments@protonmail.com"
                className="btn-holographic"
              >
                Contact Partnerships Team
              </a>
              <Link href="/docs" className="btn-holographic">
                Integration Documentation
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
