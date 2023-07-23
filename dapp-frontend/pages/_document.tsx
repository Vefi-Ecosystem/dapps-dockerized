/* eslint-disable @next/next/no-sync-scripts */
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';

export default class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <meta name="theme-color" content="#000000" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={undefined} />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;400;600;700;800&family=Poppins:wght@100;400;600;700;800&family=Syne:wght@400;600;700;800&display=swap"
            rel="stylesheet"
          />
          <meta property="og:image" content="/images/vefi_meta.png" />
          <link rel="icon" href="/images/logo.ico" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="description" content="Multi-chain DeFi ecosystem with Swap, Bridge and Launchpad. Trade, Bridge, Earn and Launch on CORE, Bitgert (Brise), Binance smart chain (BSC), XDC, XoDex, Dogechain, Doken, and Fuse" />
          <meta name="robots" content="index, follow" />
          <meta
            name="keywords"
            content="dapps, vefi, dex, launchpad, multisig, staking pools, stake, bitgert, binance, brise, bsc, omax, gatechain, multichain"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
