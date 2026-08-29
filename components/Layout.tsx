import * as React from "react";
import { Body } from "react-email";
import { Container } from "react-email";
import { Head } from "react-email";
import { Html } from "react-email";
import { Img } from "react-email";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <Html>
    <Head>
      <meta name="color-scheme" content="light" />
      <meta name="supported-color-schemes" content="light" />
    </Head>
    <Body
      style={{
        backgroundColor: "#ffffff",
        color: "#09080d",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,segoe ui,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol",
        padding: "52px 26px",
        margin: "0",
      }}
    >
      <Container
        style={{
          maxWidth: "600px",
          backgroundColor: "#ffffff",
        }}
      >
        <Img
          src="https://nn1.dev/logo-email.png"
          width="119"
          height="28"
          alt="NN1 Dev Club Logo"
          style={{
            margin: "0 0 52px",
          }}
        />
        {children}
      </Container>
    </Body>
  </Html>
);

export default Layout;
