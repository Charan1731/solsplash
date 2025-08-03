"use client";

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import React, { useState, useEffect } from 'react'
import Link from 'next/link';

const Navbar = () => {
  const [mounted, setMounted] = useState(false)
  const [balance, setBalance] = useState(0)
  const { connection } = useConnection();
  const wallet = useWallet();

  const getBalance = async () => {
    if(wallet.publicKey){
        console.log("hello from get balance")
        const sol = await connection.getBalance(wallet.publicKey);
        console.log(sol);
        setBalance(Number((sol / LAMPORTS_PER_SOL).toFixed(4)));
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if(wallet.publicKey) getBalance(); 
  },[wallet.publicKey])

  return (
    <div className='fixed top-6 left-6 right-6 z-50'>
      <div className='mx-auto max-w-7xl'>
        <div className="bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-lg">
          <div className='flex justify-between items-center px-6 py-4'>
            <div className='flex flex-row items-center justify-center gap-5'>
                <div className='text-xl font-bold text-foreground'>
                    <Link href='/'>
                        Faucet
                    </Link>
                </div>
                <nav className='flex items-center justify-center gap-2'>
                    <Link href="/airdrop">Airdrop</Link>
                    <Link href="/txns">Transactions</Link>
                    <Link href="/signature">Signature</Link>
                </nav>
            </div>
            <div className="flex flex-row items-center justify-center gap-5">
                <div className='flex flex-row items-center justify-center gap-2'>
                    <div>
                        SOL: {balance} 
                    </div>
                </div>
                <div className='wallet-adapter-button-trigger'>
                    {mounted ? (
                      <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90 !rounded-lg !font-medium !px-4 !py-2 !h-10 !transition-colors" />
                    ) : (
                      <div className="bg-primary text-primary-foreground rounded-lg font-medium px-4 py-2 h-10 flex items-center justify-center">
                        Select Wallet
                      </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar