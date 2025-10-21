import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#121212" />
        <meta name="msapplication-TileColor" content="#121212" />
        <meta name="description" content="Incrypt Oracle - Decentralized prediction market oracle on Binance Smart Chain" />
        <meta property="og:title" content="Incrypt Oracle" />
        <meta property="og:description" content="Decentralized prediction market oracle on Binance Smart Chain" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/hero_img.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Incrypt Oracle" />
        <meta name="twitter:description" content="Decentralized prediction market oracle on Binance Smart Chain" />
        <meta name="twitter:image" content="/hero_img.png" />
      </Head>
      <body className="bg-dark-950 text-white antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
