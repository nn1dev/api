import React from "react";
import { Text } from "@react-email/components";

function NN1Text({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        color: "#f8f7ff",
        margin: "0 0 26px",
        fontSize: "16px",
        lineHeight: "26px",
      }}
    >
      {children}
    </Text>
  );
}

export default NN1Text;
