"use client";
import React, { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'sonner';

const Airdrop = () => {
    const [amount, setAmount] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    
    const { connection } = useConnection();
    const wallet = useWallet();

    const handleAirdrop = async () => {
        setIsLoading(true);
        try {

            if(wallet.publicKey){
                const airdropAmount = parseFloat(amount) * LAMPORTS_PER_SOL;
                const signature = await connection.requestAirdrop(wallet.publicKey, airdropAmount);
                toast.success(`Successfully airdropped ${amount} SOL to your wallet!`);
                setAmount('');
                setStatus({type: 'success', message: `Successfully airdropped ${amount} SOL to your wallet!`});
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to airdrop")
            setIsLoading(false);
        }
    };

    const quickAmountButtons = [0.5, 1, 2, 5];

    return (
        <div className='min-h-screen pt-32 pb-12 px-6'>
            <div className='max-w-2xl mx-auto'>
                <div className='text-center mb-12'>
                    <h1 className='text-4xl font-bold text-foreground mb-4'>SOL Faucet</h1>
                    <p className='text-lg text-muted-foreground max-w-md mx-auto'>
                        Get free Solana (SOL) tokens for testing on the Devnet network
                    </p>
                </div>
                <div className='bg-background/95 backdrop-blur-md border border-border rounded-3xl shadow-2xl p-8'>
                    <div className='mb-8 p-4 rounded-2xl bg-muted/50'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-muted-foreground mb-1'>Wallet Status</p>
                                <p className='font-medium text-foreground'>
                                    {wallet.connected ? (
                                        <span className='text-green-500'>✓ Connected</span>
                                    ) : (
                                        <span className='text-orange-500'>⚠ Not Connected</span>
                                    )}
                                </p>
                            </div>
                            {wallet.connected && (
                                <div className='text-right'>
                                    <p className='text-sm text-muted-foreground mb-1'>Public Key</p>
                                    <p className='font-mono text-xs text-foreground'>
                                        {wallet.publicKey?.toString().slice(0, 8)}...{wallet.publicKey?.toString().slice(-8)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='mb-8'>
                        <label className='block text-sm font-medium text-foreground mb-3'>
                            Amount (SOL)
                        </label>
                        <div className='grid grid-cols-4 gap-2 mb-4'>
                            {quickAmountButtons.map((quickAmount) => (
                                <button
                                    key={quickAmount}
                                    onClick={() => setAmount(quickAmount.toString())}
                                    className='py-2 px-4 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium'
                                    disabled={isLoading}
                                >
                                    {quickAmount} SOL
                                </button>
                            ))}
                        </div>
                        <div className='relative'>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter custom amount"
                                min="0"
                                max="5"
                                step="0.1"
                                disabled={isLoading}
                                className='w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                            />
                            <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium'>
                                SOL
                            </div>
                        </div>
                        
                        <p className='text-xs text-muted-foreground mt-2'>
                            Maximum: 5 SOL per request
                        </p>
                    </div>
                    {status.type && (
                        <div className={`mb-6 p-4 rounded-xl ${
                            status.type === 'success' 
                                ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                                : 'bg-red-500/10 text-red-600 border border-red-500/20'
                        }`}>
                            <p className='text-sm font-medium'>{status.message}</p>
                        </div>
                    )}

                    <button
                        onClick={handleAirdrop}
                        disabled={isLoading || !wallet.connected}
                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                            isLoading || !wallet.connected
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]'
                        }`}
                    >
                        {isLoading ? (
                            <div className='flex items-center justify-center space-x-2'>
                                <div className='w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin'></div>
                                <span>Processing Airdrop...</span>
                            </div>
                        ) : !wallet.connected ? (
                            'Connect Wallet to Continue'
                        ) : (
                            'Request Airdrop'
                        )}
                    </button>

                    <div className='mt-8 p-6 bg-muted/30 rounded-2xl'>
                        <h3 className='font-semibold text-foreground mb-3'>How it works</h3>
                        <ul className='space-y-2 text-sm text-muted-foreground'>
                            <li>• Connect your Solana wallet using the button in the navbar</li>
                            <li>• Select or enter the amount of SOL you want (max 5 SOL)</li>
                            <li>• Click Request Airdrop to receive free Devnet SOL</li>
                            <li>• Tokens will appear in your wallet within a few seconds</li>
                        </ul>
                        
                        <div className='mt-4 p-3 bg-yellow-500/10 text-yellow-600 rounded-lg border border-yellow-500/20'>
                            <p className='text-xs font-medium'>
                                ⚠ This faucet only works on Solana Devnet. Tokens have no real value.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Airdrop