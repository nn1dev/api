import * as React from "react";
import { render } from "@react-email/render";
import Layout from "../components/Layout.tsx";
import Text from "../components/Text.tsx";
import Hr from "../components/Hr.tsx";
import Link from "../components/Link.tsx";

interface EmailAdminNewsletterSubscribeProps {
  email: string;
}

export const EmailAdminNewsletterSubscribe = ({
  email,
}: EmailAdminNewsletterSubscribeProps) => (
  <Layout>
    <Text>Newsletter member subscribed 👍</Text>
    <Hr />
    <Text>
      <strong>Email:</strong>
      <br />
      <Link href={`mailto:${email}`}>{email}</Link>
    </Text>
  </Layout>
);

EmailAdminNewsletterSubscribe.PreviewProps = {
  email: "club@nn1.dev",
} as EmailAdminNewsletterSubscribeProps;

const renderEmailAdminNewsletterSubscribe = async (
  props: EmailAdminNewsletterSubscribeProps,
) => ({
  html: await render(<EmailAdminNewsletterSubscribe {...props} />),
  text: await render(<EmailAdminNewsletterSubscribe {...props} />, {
    plainText: true,
  }),
});

export default EmailAdminNewsletterSubscribe;
export { renderEmailAdminNewsletterSubscribe };
