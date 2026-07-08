import React from "react";
import { Link } from "react-email";

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
        color: "#7a4b20",
        textDecoration: "underline",
      }}
    >
      {children}
    </Link>
  );
}

export default NN1Link;
