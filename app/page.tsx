import React from 'react'
import Link from 'next/link'

const page = () => {
  const features = [
    {
      title: "Free SOL Airdrop",
      description: "Get free Solana tokens instantly for testing and development on Devnet",
      icon: "🚁"
    },
    {
      title: "Transaction History",
      description: "View and track all your transactions in a clean, organized interface",
      icon: "📋"
    },
    {
      title: "Message Signing",
      description: "Sign and verify messages using your connected Solana wallet",
      icon: "✍️"
    }
  ]

  return (
    <div className='min-h-screen pt-32 pb-16 px-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-20'>
          <div className='mb-8'>
            <h1 className='text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight'>
              SolSplash
            </h1>
            <p className='text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
              A simple, elegant faucet for Solana Devnet. Get free SOL tokens, manage transactions, and interact with the Solana blockchain effortlessly.
            </p>
          </div>
          
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Link href="/airdrop">
              <button className='bg-foreground text-background cursor-pointer px-8 py-4 rounded-xl font-semibold text-lg hover:bg-foreground/90 transition-colors shadow-lg min-w-[160px]'>
                Get Started
              </button>
            </Link>
            <Link href="/txns">
              <button className='border-2 border-border px-8 py-4 rounded-xl cursor-pointer font-semibold text-lg text-foreground hover:bg-accent transition-colors min-w-[160px]'>
                Make Transactions
              </button>
            </Link>
          </div>
        </div>
        <div className='mb-20'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
              Everything you need for Solana development
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              Built for developers, designers, and anyone working with Solana Devnet
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <div key={index} className='text-center p-8 border border-border rounded-2xl hover:shadow-lg transition-shadow'>
                <div className='text-4xl mb-4'>{feature.icon}</div>
                <h3 className='text-xl font-semibold text-foreground mb-3'>
                  {feature.title}
                </h3>
                <p className='text-muted-foreground leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className='text-center mb-20'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-8'>
              Simple. Fast. Reliable.
            </h2>
            <div className='grid md:grid-cols-2 gap-12 text-left'>
              <div>
                <h3 className='text-xl font-semibold text-foreground mb-4'>For Developers</h3>
                <p className='text-muted-foreground leading-relaxed mb-6'>
                  Perfect for testing your Solana dApps, smart contracts, and blockchain integrations. Get the SOL you need without any hassle.
                </p>
                <ul className='space-y-2 text-muted-foreground'>
                  <li>• Instant token delivery</li>
                  <li>• No registration required</li>
                  <li>• Devnet environment</li>
                  <li>• Rate limit protection</li>
                </ul>
              </div>
              <div>
                <h3 className='text-xl font-semibold text-foreground mb-4'>Easy to Use</h3>
                <p className='text-muted-foreground leading-relaxed mb-6'>
                  Connect your wallet, request tokens, and start building. Our intuitive interface makes it simple for anyone to get started.
                </p>
                <ul className='space-y-2 text-muted-foreground'>
                  <li>• Connect any Solana wallet</li>
                  <li>• Real-time balance updates</li>
                  <li>• Transaction tracking</li>
                  <li>• Message signing tools</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='text-center p-12 border border-border rounded-2xl bg-muted/20'>
          <h2 className='text-2xl md:text-3xl font-bold text-foreground mb-4'>
            Ready to start building?
          </h2>
          <p className='text-muted-foreground mb-8 text-lg'>
            Connect your wallet and get free SOL tokens in seconds
          </p>
          <Link href="/airdrop">
            <button className='bg-foreground text-background cursor-pointer px-10 py-4 rounded-xl font-semibold text-lg hover:bg-foreground/90 transition-colors shadow-lg'>
              Request Airdrop Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default page