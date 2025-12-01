import React from "react";
import { Link } from "@react-email/components";

function NN1Link({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      style={{
        color: "#ddc2a5",
        textDecoration: "underline",
      }}
    >
      {children}
    </Link>
  );
}

export default NN1Link;
