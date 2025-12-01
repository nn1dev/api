import * as React from "react";
import { render } from "@react-email/render";
import Layout from "../components/Layout.tsx";
import Text from "../components/Text.tsx";
import Hr from "../components/Hr.tsx";
import Link from "../components/Link.tsx";

interface EmailAdminSignupSuccessProps {
  name: string;
  email: string;
}

export const EmailAdminSignupSuccess = ({
  name,
  email,
}: EmailAdminSignupSuccessProps) => (
  <Layout>
    <Text>New signup 👍</Text>
    <Hr />
    <Text>
      <strong>
        Name:
        <br />
      </strong>{" "}
      {name}
    </Text>
    <Text>
      <strong>Email:</strong>
      <br />
      <Link href={`mailto:${email}`}>{email}</Link>
    </Text>
  </Layout>
);

EmailAdminSignupSuccess.PreviewProps = {
  name: "Pawel Grzybek",
  email: "club@nn1.dev",
} as EmailAdminSignupSuccessProps;

const renderEmailAdminSignupSuccess = async (
  props: EmailAdminSignupSuccessProps,
) => ({
  html: await render(<EmailAdminSignupSuccess {...props} />),
  text: await render(<EmailAdminSignupSuccess {...props} />, {
    plainText: true,
  }),
});

export default EmailAdminSignupSuccess;
export { renderEmailAdminSignupSuccess };
