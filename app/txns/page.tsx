"use client";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

interface Transactions{
    signature: string;
    from: string;
    to: string;
    amount: number;
    status: string;
    timestamp: number;
}

const Page = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [recentTxn, setRecentTxn] = useState<Transactions[]>([]);
  const [isLoadingTxns, setIsLoadingTxns] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(0);
  const { connection } = useConnection();
  const wallet = useWallet();

  const quickAmounts = [0.1, 0.5, 1, 2];

  useEffect(() => {
    if (wallet.publicKey) {
      getRecentTxn();
    }
  }, [wallet.publicKey])

  const getRecentTxn = async () => {
    if (!wallet.publicKey) return;
    const now = Date.now();
    if (now - lastRefresh < 5000) {
      toast.error("Please wait a moment before refreshing again.");
      return;
    }
    
    setIsLoadingTxns(true);
    setLastRefresh(now);
    
    try {
      console.log("Fetching recent transactions...")
      
      const signatures = await connection.getSignaturesForAddress(wallet.publicKey, { limit: 10 });
      
      const transactions: Transactions[] = [];
      for (let i = 0; i < signatures.length; i++) {
        const signatureInfo = signatures[i];
        
        try {
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
          }
          
          const txn = await connection.getTransaction(signatureInfo.signature, {
            maxSupportedTransactionVersion: 0
          });
          
          if (txn && txn.meta && txn.transaction) {
            const instruction = txn.transaction.message.compiledInstructions[0];
            if (instruction) {
              const accountKeys = txn.transaction.message.staticAccountKeys;    
              const preBalances = txn.meta.preBalances;
              const postBalances = txn.meta.postBalances;
              
              let amount = 0;
              let fromAddress = '';
              let toAddress = '';
              
              for (let i = 0; i < preBalances.length; i++) {
                const balanceChange = postBalances[i] - preBalances[i];
                if (balanceChange !== 0) {
                  if (balanceChange < 0) {
                    fromAddress = accountKeys[i].toString();
                    amount = Math.abs(balanceChange) / LAMPORTS_PER_SOL;
                  } else if (balanceChange > 0) {
                    toAddress = accountKeys[i].toString();
                  }
                }
              }
              
              transactions.push({
                signature: signatureInfo.signature,
                from: fromAddress || wallet.publicKey.toString(),
                to: toAddress || 'Unknown',
                amount: amount,
                status: txn.meta.err ? 'Failed' : 'Success',
                timestamp: signatureInfo.blockTime || Date.now() / 1000
              });
            }
          }
        } catch (error) {
          if (error) {
            console.warn(`Rate limited for transaction ${signatureInfo.signature}, skipping...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            console.error(`Error fetching transaction ${signatureInfo.signature}:`, error);
          }
        }
      }
      
      setRecentTxn(transactions);
      console.log("Fetched transactions:", transactions);
    } catch (error) {
      if (error) {
        console.warn("Rate limited when fetching signatures. Please wait a moment before refreshing.");
        toast.error("Too many requests. Please wait a moment before refreshing.");
      } else {
        console.error("Error fetching recent transactions:", error);
        toast.error("Failed to fetch transactions. Please try again later.");
      }
    } finally {
      setIsLoadingTxns(false);
    }
  }

  const handleTransfer = async () => {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!recipient || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isValidPublicKey(recipient)) {
      toast.error("Please enter a valid recipient address");
      return;
    }

    try {
        const txn = new Transaction();
        txn.add(SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(recipient),
            lamports: Number(amount) * LAMPORTS_PER_SOL
        }))

        const signature = await wallet.sendTransaction(txn, connection);
        
        if(signature){
            toast.success("Transaction sent successfully!");
            
            setRecipient('');
            setAmount('');
            
            setTimeout(() => {
              getRecentTxn();
            }, 5000);
        }
        
    } catch (error) {
        console.error(error);
        toast.error("Transaction failed. Please try again.");
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
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-foreground'>Recent Transactions</h2>
                <button 
                  onClick={getRecentTxn}
                  disabled={isLoadingTxns}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    isLoadingTxns 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : 'bg-accent hover:bg-accent/80 text-accent-foreground'
                  }`}
                >
                  {isLoadingTxns ? (
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 border border-current border-t-transparent rounded-full animate-spin'></div>
                      Loading...
                    </div>
                  ) : (
                    'Refresh'
                  )}
                </button>
              </div>
              
              {!wallet.connected ? (
                <div className='text-center py-12'>
                  <div className='text-4xl mb-4'>🔗</div>
                  <p className='text-muted-foreground mb-2'>Connect your wallet</p>
                  <p className='text-sm text-muted-foreground'>
                    Connect your wallet to view transaction history
                  </p>
                </div>
              ) : recentTxn.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='text-4xl mb-4'>📋</div>
                  <p className='text-muted-foreground mb-2'>No transactions yet</p>
                  <p className='text-sm text-muted-foreground'>
                    Your transaction history will appear here after you make your first transfer
                  </p>
                </div>
              ) : (
                <div className='space-y-4 max-h-screen overflow-y-auto'>
                  {recentTxn.map((txn, index) => (
                    <div key={txn.signature} className='p-4 border border-border rounded-xl hover:bg-accent/20 transition-colors'>
                      <div className='flex justify-between items-start mb-2'>
                        <div className='flex items-center gap-2'>
                          <div className={`w-2 h-2 rounded-full ${
                            txn.status === 'Success' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className={`text-sm font-medium ${
                            txn.status === 'Success' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {txn.status}
                          </span>
                        </div>
                        <span className='text-xs text-muted-foreground'>
                          {new Date(txn.timestamp * 1000).toLocaleDateString()} {new Date(txn.timestamp * 1000).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className='space-y-2'>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm text-muted-foreground'>Amount</span>
                          <span className='font-semibold text-foreground'>{txn.amount.toFixed(4)} SOL</span>
                        </div>
                        
                        <div className='space-y-1'>
                          <div className='flex justify-between items-center'>
                            <span className='text-xs text-muted-foreground'>From</span>
                            <span className='text-xs font-mono text-foreground'>
                              {txn.from === wallet.publicKey?.toString() 
                                ? 'You' 
                                : `${txn.from.slice(0, 8)}...${txn.from.slice(-8)}`
                              }
                            </span>
                          </div>
                          
                          <div className='flex justify-between items-center'>
                            <span className='text-xs text-muted-foreground'>To</span>
                            <span className='text-xs font-mono text-foreground'>
                              {txn.to === wallet.publicKey?.toString() 
                                ? 'You' 
                                : `${txn.to.slice(0, 8)}...${txn.to.slice(-8)}`
                              }
                            </span>
                          </div>
                        </div>
                        
                        <div className='flex justify-between items-center pt-2 border-t border-border/50'>
                          <span className='text-xs text-muted-foreground'>Signature</span>
                          <button
                            onClick={() => window.open(`https://explorer.solana.com/tx/${txn.signature}?cluster=devnet`, '_blank')}
                            className='text-xs text-primary hover:text-primary/80 font-mono'
                          >
                            {txn.signature.slice(0, 8)}...{txn.signature.slice(-8)} ↗
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  )
}

export default Page