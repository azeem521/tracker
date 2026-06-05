import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // This runs only on the server. Initialize DNS servers here.
    try {
      // require the server-only DNS initializer
      require('../lib/dns');
    } catch (e) {
      // ignore in environments where require may fail
    }
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
