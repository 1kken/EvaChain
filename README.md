# EvaChain

EvaChain is a decentralized performance management and evaluation platform designed to ensure transparency, immutability, and accountability in academic and organizational settings. By leveraging blockchain and IPFS, EvaChain enables institutions to manage strategic plans, operational reports, and individual evaluations securely.

## 🚀 Features

- **Document Management**: Upload strategic, operational, and individual reports (IPCRs) with evidence.
- **Blockchain Integration**: Store document CIDs (Content Identifiers) on-chain for tamper-proof records.
- **IPFS File Storage**: Files are stored in decentralized storage via IPFS (e.g., Pinata).
- **Role-Based Access Control**: Custom scopes (`All`, `Unit`, `Office`, `Program`) per module.
- **Performance View**: Consolidated view of all IPCRs and related evidence.
- **Backup to IPFS**: Admins can back up all data and store snapshots on the blockchain.
- **Wallet Abstraction**: Seamless UX—users interact without needing crypto knowledge.

## 🛠️ Tech Stack

- **Frontend**: SvelteKit + Tailwind + ShadCN-Svelte  
- **Backend**: Supabase (Database, Auth, RLS)  
- **Blockchain**: Ethereum / Polygon via Alchemy  
- **Storage**: IPFS via Pinata  
- **Edge Functions**: Supabase Edge (PDF to image conversion)  
- **Hosting**: Vercel

## 📦 Installation

```bash
git clone https://github.com/1kken/EvaChain.git
cd EvaChain
npm install
