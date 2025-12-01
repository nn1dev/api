import React from "react";
import { Text } from "@react-email/components";

function NN1Heading({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        color: "#f8f7ff",
        margin: "0 0 26px",
        fontSize: "16px",
        lineHeight: "26px",
        fontWeight: "700",
      }}
    >
      {children}
    </Text>
  );
}

export default NN1Heading;
