# Payment Tracker

A production-ready Stellar Testnet payment dashboard built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Soroban-compatible contract integration. The app connects to Freighter, sends real Soroban contract invocations, and provides a polished dashboard for payment history and status tracking.

## Features

- Freighter wallet connection and disconnect flow
- Dashboard cards for totals, success, pending, and failed payments
- Multi-address payment form with validation
- Real Soroban contract invocation on Stellar Testnet
- Payment history with search, filter, sort, and pagination
- Realtime toast notifications and animated UI

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- React Icons
- Stellar SDK
- Freighter Wallet
- Stellar Testnet

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

```text
src/
  components/
  contracts/
  hooks/
  pages/
  services/
  styles/
  types/
  utils/
```

## Deployment Guide

1. Deploy the Soroban contract to Stellar Testnet.
2. Replace the placeholder contract ID in src/contracts/PaymentContract.ts with the deployed ID.
3. Ensure Freighter is installed and connected to the Testnet.
4. Run the frontend build and host it on Vercel, Netlify, or any static host.

## Architecture

The frontend communicates directly with Stellar Testnet. Wallet actions are handled by the Freighter service layer, while payment submissions use a Soroban contract wrapper. Payment history is stored in local UI state for the demo experience and can be wire-connected to a backend later.

## Screenshots

Placeholder screenshots can be added in the docs folder as the UI evolves.
