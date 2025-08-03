"use client";

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [mounted, setMounted] = useState(false)
  const [balance, setBalance] = useState(0)
  const [isBalanceLoading, setIsBalanceLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { connection } = useConnection();
  const wallet = useWallet();
  const pathname = usePathname();

  const getBalance = async () => {
    if(wallet.publicKey){
        setIsBalanceLoading(true)
        try {
          const sol = await connection.getBalance(wallet.publicKey);
          setBalance(Number((sol / LAMPORTS_PER_SOL).toFixed(4)));
        } catch (error) {
          console.error('Failed to fetch balance:', error);
        } finally {
          setIsBalanceLoading(false)
        }
    } else {
      setBalance(0)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if(wallet.publicKey) {
      getBalance(); 
    } else {
      setBalance(0)
    }
  },[wallet.publicKey, connection])

  const navItems = [
    { href: '/airdrop', label: 'Airdrop', icon: '🚁' },
    { href: '/txns', label: 'Transactions', icon: '📋' },
    { href: '/signature', label: 'Signature', icon: '✍️' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <div className='fixed top-6 left-6 right-6 z-50'>
        <div className='mx-auto max-w-7xl'>
          <div className="bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-xl ring-1 ring-black/5">
            <div className='flex justify-between items-center px-8 py-4'>
              <div className='flex items-center gap-8'>
                <Link href='/' className='group'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow'>
                      S
                    </div>
                    <span className='text-xl font-bold text-foreground group-hover:text-primary transition-colors'>
                      SOL Faucet
                    </span>
                  </div>
                </Link>

                <nav className='hidden md:flex items-center gap-1'>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'text-primary bg-primary/10 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`}
                    >
                      <span className='flex items-center gap-2'>
                        <span className='text-base'>{item.icon}</span>
                        {item.label}
                      </span>
                      {isActive(item.href) && (
                        <div className='absolute inset-x-0 -bottom-px h-0.5 bg-primary rounded-full' />
                      )}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="flex items-center gap-4">
                {wallet.connected && (
                  <div className='hidden sm:flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-xl border border-border/50'>
                    <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                    <div className='flex flex-col'>
                      <span className='text-xs text-muted-foreground font-medium'>Balance</span>
                      <span className='text-sm font-bold text-foreground'>
                        {isBalanceLoading ? (
                          <span className='inline-block w-12 h-4 bg-muted rounded animate-pulse'></span>
                        ) : (
                          `${balance} SOL`
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <div className='wallet-adapter-button-trigger'>
                  {mounted ? (
                    <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90 !rounded-xl !font-semibold !px-6 !py-3 !h-11 !transition-all !duration-200 !shadow-md hover:!shadow-lg !border-0" />
                  ) : (
                    <div className="bg-primary text-primary-foreground rounded-xl font-semibold px-6 py-3 h-11 flex items-center justify-center shadow-md">
                      Select Wallet
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className='md:hidden p-2 rounded-lg hover:bg-accent transition-colors'
                >
                  <svg className={`w-6 h-6 transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className='fixed inset-0 z-40 md:hidden'>
          <div 
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className='absolute top-24 left-6 right-6 bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-xl ring-1 ring-black/5 p-6'>
            {wallet.connected && (
              <div className='flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50 mb-6'>
                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                <div className='text-center'>
                  <div className='text-xs text-muted-foreground font-medium mb-1'>Wallet Balance</div>
                  <div className='text-lg font-bold text-foreground'>
                    {isBalanceLoading ? 'Loading...' : `${balance} SOL`}
                  </div>
                </div>
              </div>
            )}

            <nav className='space-y-2'>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <span className='text-xl'>{item.icon}</span>
                  {item.label}
                  {isActive(item.href) && (
                    <div className='ml-auto w-2 h-2 bg-primary rounded-full' />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar