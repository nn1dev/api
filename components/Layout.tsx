import * as React from "react";
import { Body } from "@react-email/components";
import { Container } from "@react-email/components";
import { Head } from "@react-email/components";
import { Html } from "@react-email/components";
import { Img } from "@react-email/components";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <Html>
    <Head />
    <Body
      style={{
        backgroundColor: "#09080d",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,segoe ui,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol",
        padding: "52px 26px",
        margin: "0",
      }}
    >
      <Container
        style={{
          maxWidth: "600px",
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
