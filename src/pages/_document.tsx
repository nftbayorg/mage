import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

class MageDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            rel="preload"
            as="style"
            href="https://fonts.googleapis.com/css2?family=Silkscreen&display=swap"
          />
          <link href="https://fonts.googleapis.com/css2?family=Silkscreen&display=swap" rel="stylesheet"/>
          <noscript>
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Silkscreen&display=swap"
            />
          </noscript>
        </Head>
        <body >
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MageDocument