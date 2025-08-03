"use client";
import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

const SignaturePage = () => {
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [signedMessage, setSignedMessage] = useState<string>('');
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    
    const wallet = useWallet();

    const handleSignMessage = async () => {
      try {
        
      } catch (error) {
        console.error(error);
        toast.error("Failed to sign message")
      }
    };

    const clearMessage = () => {
        setMessage('');
        setSignedMessage('');
        setStatus({ type: null, message: '' });
    };

    const sampleMessages = [
        "Hello, Solana!",
        "This is a test message for signing"
    ];

  return (
        <div className='min-h-screen pt-32 pb-12 px-6'>
            <div className='max-w-2xl mx-auto'>
                <div className='text-center mb-12'>
                    <h1 className='text-4xl font-bold text-foreground mb-4'>Message Signing</h1>
                    <p className='text-lg text-muted-foreground max-w-md mx-auto'>
                        Sign any message using your connected Solana wallet for verifying ownership
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
                            Message to Sign
                        </label>
                        <div className='grid grid-cols-2 gap-2 mb-4'>
                            {sampleMessages.map((sampleMessage, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMessage(sampleMessage)}
                                    className='py-2 px-3 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium text-left'
                                    disabled={isLoading}
                                >
                                    {sampleMessage.length > 25 ? `${sampleMessage.slice(0, 25)}...` : sampleMessage}
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your message here..."
                            rows={4}
                            disabled={isLoading}
                            className='w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none'
                        />
                        
                        <div className='flex justify-between items-center mt-2'>
                            <p className='text-xs text-muted-foreground'>
                                {message.length} characters
                            </p>
                            {message && (
                                <button
                                    onClick={clearMessage}
                                    className='text-xs text-muted-foreground hover:text-foreground transition-colors'
                                >
                                    Clear message
                                </button>
                            )}
                        </div>
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
                        onClick={handleSignMessage}
                        disabled={isLoading || !wallet.connected || !message.trim()}
                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                            isLoading || !wallet.connected || !message.trim()
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]'
                        }`}
                    >
                        {isLoading ? (
                            <div className='flex items-center justify-center space-x-2'>
                                <div className='w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin'></div>
                                <span>Signing Message...</span>
                            </div>
                        ) : !wallet.connected ? (
                            'Connect Wallet to Sign'
                        ) : !message.trim() ? (
                            'Enter Message to Sign'
                        ) : (
                            'Sign Message'
                        )}
                    </button>

                    {signedMessage && (
                        <div className='mt-8 p-6 bg-muted/30 rounded-2xl'>
                            <h3 className='font-semibold text-foreground mb-3 flex items-center gap-2'>
                                <span className='text-green-500'>✓</span>
                                Signed Message
                            </h3>
                            <div className='bg-background/50 rounded-lg p-4 border border-border'>
                                <p className='font-mono text-sm text-foreground break-all'>
                                    {signedMessage}
                                </p>
                            </div>
                            <div className='flex gap-2 mt-4'>
                                <button className='px-4 py-2 text-sm bg-muted text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors'>
                                    Copy Signature
                                </button>
                                <button className='px-4 py-2 text-sm bg-muted text-muted-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors'>
                                    Verify Signature
                                </button>
                            </div>
                        </div>
                    )}

                    <div className='mt-8 p-6 bg-muted/30 rounded-2xl'>
                        <h3 className='font-semibold text-foreground mb-3'>How Message Signing Works</h3>
                        <ul className='space-y-2 text-sm text-muted-foreground'>
                            <li>• Connect your Solana wallet using the button in the navbar</li>
                            <li>• Enter any message you want to sign or choose from samples</li>
                            <li>• Click &quot;Sign Message&quot; to create a cryptographic signature</li>
                            <li>• Use the signature to prove ownership of your wallet address</li>
                        </ul>
                        
                        <div className='mt-4 p-3 bg-blue-500/10 text-blue-600 rounded-lg border border-blue-500/20'>
                            <p className='text-xs font-medium'>
                                💡 Message signing doesn&apos;t require any transaction fees and works on any network.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignaturePage