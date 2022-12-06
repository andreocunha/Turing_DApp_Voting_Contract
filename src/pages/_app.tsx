import '../styles/globals.css'
import type { AppProps } from 'next/app'

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
