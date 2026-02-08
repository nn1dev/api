import { render } from "@react-email/render";
import Hr from "../components/Hr.tsx";
import Link from "../components/Link.tsx";
import Text from "../components/Text.tsx";
import Layout from "../components/Layout.tsx";
import Socials from "../components/Socials.tsx";
import Heading from "../components/Heading.tsx";

interface EmailProps {
  unsubscribeUrl: string;
}

export const Email = ({ unsubscribeUrl }: EmailProps) => (
  <Layout>
    <Heading>Newsletter template test</Heading>
    <Hr />
    <Text>Questions? Reach out on social media or reply to this email!</Text>
    <Text>
      NN1 Dev Club Crew,
      <br />
      Pawel & Darren
    </Text>
    <Socials />
    <Hr />
    <Text>
      Are you no longer interested? You can{" "}
      <Link href={unsubscribeUrl}>unsubscribe</Link> anytime.
    </Text>
  </Layout>
);

Email.PreviewProps = {
  unsubscribeUrl: "https://nn1.dev",
} as EmailProps;

const renderEmailNewsletterTest = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletterTest };
