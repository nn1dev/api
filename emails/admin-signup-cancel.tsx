import * as React from "react";
import { render } from "@react-email/render";
import Layout from "../components/Layout.tsx";
import Text from "../components/Text.tsx";
import Hr from "../components/Hr.tsx";
import Link from "../components/Link.tsx";

interface EmailAdminSignupCancelProps {
  name: string;
  email: string;
}

export const EmailAdminSignupCancel = ({
  name,
  email,
}: EmailAdminSignupCancelProps) => (
  <Layout>
    <Text>Ticket cancelled 👎</Text>
    <Hr />
    <Text>
      <strong>
        Name:
        <br />
      </strong>
      {name}
    </Text>
    <Text>
      <strong>Email:</strong>
      <br />
      <Link href={`mailto:${email}`}>{email}</Link>
    </Text>
  </Layout>
);

EmailAdminSignupCancel.PreviewProps = {
  name: "Pawel Grzybek",
  email: "club@nn1.dev",
} as EmailAdminSignupCancelProps;

const renderEmailAdminSignupCancel = async (
  props: EmailAdminSignupCancelProps,
) => ({
  html: await render(<EmailAdminSignupCancel {...props} />),
  text: await render(<EmailAdminSignupCancel {...props} />, {
    plainText: true,
  }),
});

export default EmailAdminSignupCancel;
export { renderEmailAdminSignupCancel };
