"use client";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useState } from 'react'
import { toast } from 'sonner';

const Page = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const { connection } = useConnection();
  const wallet = useWallet();

  const quickAmounts = [0.1, 0.5, 1, 2];

  const handleTransfer = async () => {
    try {

        const txn = new Transaction();
        txn.add(SystemProgram.transfer({
            fromPubkey: wallet.publicKey!,
            toPubkey: new PublicKey(recipient),
            lamports: Number(amount) * LAMPORTS_PER_SOL
        }))

        const respose = await wallet.sendTransaction(txn, connection);
        if(respose){
            toast.success("Transaction has been sent")
        }
        
    } catch (error) {
        console.error(error);
        toast.error("Transaction has failed")
    }
  };

  const isValidPublicKey = (key: string) => {
    return key.length >= 32 && key.length <= 44 && /^[A-Za-z0-9]+$/.test(key);
  };

  return (
    <div className='min-h-screen pt-32 pb-12 px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-foreground mb-4'>Transfer SOL</h1>
          <p className='text-lg text-muted-foreground max-w-md mx-auto'>
            Send Solana tokens to any wallet address on the Devnet network
          </p>
        </div>

        <div className='grid lg:grid-cols-2 gap-8'>
          {/* Transfer Form */}
          <div className='bg-background/95 backdrop-blur-md border border-border rounded-3xl shadow-2xl p-8'>
          <div className='mb-8'>
            <label className='block text-sm font-medium text-foreground mb-3'>
              Recipient Address
            </label>
            <div className='relative'>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter Solana wallet address"
                className='w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm'
              />
              {recipient && (
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                  {isValidPublicKey(recipient) ? (
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  ) : (
                    <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                  )}
                </div>
              )}
            </div>
            <p className='text-xs text-muted-foreground mt-2'>
              Make sure this is a valid Solana wallet address
            </p>
          </div>

          <div className='mb-8'>
            <label className='block text-sm font-medium text-foreground mb-3'>
              Amount (SOL)
            </label>
            
            <div className='grid grid-cols-4 gap-2 mb-4'>
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className='py-2 px-4 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium'
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
                placeholder="Enter amount"
                min="0"
                step="0.01"
                className='w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
              />
              <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium'>
                SOL
              </div>
            </div>
            
            <p className='text-xs text-muted-foreground mt-2'>
              Ensure you have sufficient balance for the transfer
            </p>
          </div>

          {(recipient || amount) && (
            <div className='mb-8 p-4 bg-muted/30 rounded-2xl border border-border/50'>
              <h3 className='text-sm font-semibold text-foreground mb-3'>Transaction Summary</h3>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>To:</span>
                  <span className='text-foreground font-mono text-xs'>
                    {recipient ? `${recipient.slice(0, 8)}...${recipient.slice(-8)}` : '--'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Amount:</span>
                  <span className='text-foreground font-semibold'>
                    {amount ? `${amount} SOL` : '--'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Network Fee:</span>
                  <span className='text-foreground'>~0.000005 SOL</span>
                </div>
                <div className='border-t border-border/50 pt-2 mt-2'>
                  <div className='flex justify-between font-semibold'>
                    <span className='text-foreground'>Total:</span>
                    <span className='text-foreground'>
                      {amount ? `${(parseFloat(amount) + 0.000005).toFixed(6)} SOL` : '--'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleTransfer}
            disabled={!recipient || !amount || !isValidPublicKey(recipient)}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
              !recipient || !amount || !isValidPublicKey(recipient)
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-foreground text-background hover:bg-foreground/90 hover:shadow-lg active:scale-[0.98]'
            }`}
          >
            Send Transaction
          </button>

          <div className='mt-8 p-6 bg-muted/30 rounded-2xl'>
            <h3 className='font-semibold text-foreground mb-3'>Important Notes</h3>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>• Double-check the recipient address before sending</li>
              <li>• Transactions on Devnet are irreversible</li>
              <li>• Network fees are automatically calculated</li>
              <li>• Ensure sufficient balance for transfer + fees</li>
            </ul>
            
            <div className='mt-4 p-3 bg-yellow-500/10 text-yellow-600 rounded-lg border border-yellow-500/20'>
              <p className='text-xs font-medium'>
                ⚠ This is Solana Devnet. Tokens have no real value and are for testing only.
              </p>
            </div>
            </div>
            </div>

            <div className='bg-background/95 backdrop-blur-md border border-border rounded-3xl shadow-2xl p-8'>
              <h2 className='text-2xl font-bold text-foreground mb-6'>Recent Transactions</h2>
              <div className='text-center py-12'>
                <div className='text-4xl mb-4'>📋</div>
                <p className='text-muted-foreground mb-2'>No transactions yet</p>
                <p className='text-sm text-muted-foreground'>
                  Your transaction history will appear here after you make your first transfer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Page