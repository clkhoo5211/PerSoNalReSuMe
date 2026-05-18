import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TipJar.css';

const TIP_CHANNELS = [
  {
    id: 'eth',
    label: 'Ethereum (ETH)',
    icon: '⟠',
    color: '#627EEA',
    address: 'YOUR_ETH_WALLET_ADDRESS',
    network: 'Ethereum Mainnet',
    note: 'Also works on BNB Smart Chain & Polygon',
  },
  {
    id: 'bnb',
    label: 'BNB Smart Chain',
    icon: '🔶',
    color: '#F3BA2F',
    address: 'YOUR_BNB_WALLET_ADDRESS',
    network: 'BNB Smart Chain (BSC)',
    note: 'BEP-20 tokens supported',
  },
  {
    id: 'icp',
    label: 'Internet Computer (ICP)',
    icon: '∞',
    color: '#29ABE2',
    address: 'YOUR_ICP_PRINCIPAL_ID',
    network: 'Internet Computer Protocol',
    note: 'ICP tokens',
  },
  {
    id: 'tron',
    label: 'TRON (TRX)',
    icon: '🔴',
    color: '#FF0013',
    address: 'YOUR_TRON_WALLET_ADDRESS',
    network: 'TRON Network',
    note: 'TRX & USDT TRC-20 accepted',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    icon: '🅿',
    color: '#003087',
    url: 'https://paypal.me/YOUR_PAYPAL_USERNAME',
    note: 'Credit card, debit card, or PayPal balance',
  },
  {
    id: 'crypto-general',
    label: 'Other Crypto',
    icon: '₿',
    color: '#F7931A',
    address: null,
    note: 'Contact me directly for BTC, SOL, or other chains',
    contactLink: true,
  },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className="tip-copy-btn" onClick={copy}>
      {copied ? '✓ Copied!' : '📋 Copy'}
    </button>
  );
}

export default function TipJar() {
  const [active, setActive] = useState(null);

  return (
    <div className="tipjar-page section">
      <div className="section-eyebrow">Support My Work</div>
      <h2 className="section-title" style={{ marginBottom: 'var(--sp-sm)' }}>Buy Me a Coffee ☕</h2>
      <p className="tipjar-subtitle">
        If you find my work valuable, a small tip goes a long way. Choose your preferred channel below.
      </p>

      <div className="tipjar-grid">
        {TIP_CHANNELS.map((ch, i) => (
          <motion.div
            key={ch.id}
            className={`tipjar-card card${active === ch.id ? ' open' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => setActive(active === ch.id ? null : ch.id)}
          >
            <div className="tipjar-card-header">
              <span className="tipjar-icon" style={{ color: ch.color }}>{ch.icon}</span>
              <div className="tipjar-card-meta">
                <div className="tipjar-label">{ch.label}</div>
                {ch.network && <div className="tipjar-network">{ch.network}</div>}
              </div>
              <span className="tipjar-chevron">{active === ch.id ? '▲' : '▼'}</span>
            </div>

            <AnimatePresence>
              {active === ch.id && (
                <motion.div
                  className="tipjar-detail"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="tipjar-detail-inner">
                    {ch.url && (
                      <a href={ch.url} target="_blank" rel="noopener noreferrer"
                        className="btn btn-primary tipjar-link-btn">
                        {ch.icon} Pay via {ch.label}
                      </a>
                    )}
                    {ch.address && ch.address !== 'YOUR_ETH_WALLET_ADDRESS' &&
                     ch.address !== 'YOUR_BNB_WALLET_ADDRESS' &&
                     ch.address !== 'YOUR_ICP_PRINCIPAL_ID' &&
                     ch.address !== 'YOUR_TRON_WALLET_ADDRESS' && (
                      <div className="tipjar-address-wrap">
                        <code className="tipjar-address">{ch.address}</code>
                        <CopyButton text={ch.address} />
                      </div>
                    )}
                    {ch.address && (ch.address.startsWith('YOUR_')) && (
                      <p className="tipjar-placeholder-note">
                        Wallet address coming soon — contact me directly.
                      </p>
                    )}
                    {ch.contactLink && (
                      <a href="mailto:kcl5211@gmail.com" className="btn btn-outline">
                        ✉️ Contact for Address
                      </a>
                    )}
                    {ch.note && <p className="tipjar-note">{ch.note}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <p className="tipjar-footer">
        Thank you for your support! 🙏 Every coffee helps me build more open-source tools and write better content.
      </p>
    </div>
  );
}
