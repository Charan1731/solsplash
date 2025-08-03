import React from 'react'
import '../app/globals.css'

const Footer = () => {
  return (
    <footer className="relative backdrop-blur bg-[linear-gradient(90deg,transparent,rgba(139,92,246,0.1),transparent)] mt-auto futuristic-footer">
  <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(139,92,246,0.5),transparent)] animate-pulse-glow" />
  
  <div className="flex items-center justify-center py-4 px-4">
    <p className="text-xs font-mono tracking-wider animate-gradient-shift bg-[linear-gradient(90deg,#64748b,#8b5cf6,#64748b)] bg-clip-text text-transparent footer-text">
      <span className="lightning-icon inline-block animate-lightning-pulse">⚡</span> Powered by SolSplash <span className="opacity-60">|</span> Securing Digital Frontiers <span className="opacity-60">|</span> 
      <a 
        href="https://github.com/Charan1731" 
        target="_blank" 
        rel="noopener noreferrer"
        className="ml-1 animate-gradient-shift bg-[linear-gradient(90deg,#8b5cf6,#a855f7,#8b5cf6)] bg-clip-text text-transparent transition-opacity duration-200 hover:opacity-80"
      >
        GitHub
      </a> <span className="lightning-icon inline-block animate-lightning-pulse">⚡</span>
    </p>
  </div>
</footer>
  )
}

export default Footer