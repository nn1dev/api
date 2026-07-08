import React from "react";
import { Text } from "react-email";

function NN1Text({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        color: "#2f2b33",
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
