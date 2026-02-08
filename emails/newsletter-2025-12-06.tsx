import { render } from "@react-email/render";
import Button from "../components/Button";
import Hr from "../components/Hr";
import Link from "../components/Link";
import Text from "../components/Text";
import Layout from "../components/Layout";
import Socials from "../components/Socials";
import Heading from "../components/Heading";

interface EmailProps {
  unsubscribeUrl: string;
}

export const Email = ({ unsubscribeUrl }: EmailProps) => (
  <Layout>
    <Heading>
      #10: "Bad at CSS" by Keith Cirkel and "Start-Up to Exit: The Journey for
      Tech Companies" by Paul Jesson and Ian Zant-Boer
    </Heading>
    <Text>
      We've got some absolute legends speaking at this one! Keith Cirkel,
      ex-GitHub senior engineer now a staff-level member of Mozilla's DOM Core
      team and prolific contributor to all dominant browser engines, is going to
      walk us through the chaos of CSS. Following this technical deep dive, Paul
      Jesson and Ian Zant-Boer will share insights on building financial
      foundations and navigating fundraising rounds for tech businesses.
    </Text>
    <Text>
      🗓️ Thursday, 29/01/2026, 18:00
      <br />
      📍 Vulcan Works, Northampton, NN1 1EW
      <br />
      💰 Free (ticket required, limited to 100)
    </Text>
    <Button href="https://nn1.dev/events/10">Get your ticket</Button>
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

const renderEmailNewsletter_2025_12_06 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2025_12_06 };
