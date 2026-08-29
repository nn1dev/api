import React from "react";
import { Button } from "react-email";

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
        backgroundColor: "#09080d",
        color: "#f8f7ff",
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
