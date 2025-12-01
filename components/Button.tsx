import React from "react";
import { Button } from "@react-email/components";

function NN1Button({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: "#ddc2a5",
        color: "#09080d",
        padding: "13px 26px",
        margin: "0 0 26px",
        borderRadius: "4px",
        fontSize: "16px",
        lineHeight: "26px",
      }}
    >
      {children}
    </Button>
  );
}

export default NN1Button;
