import { render } from "react-email";
import Layout from "../components/Layout";
import Text from "../components/Text";
import Hr from "../components/Hr";
import Link from "../components/Link";

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
