import { render } from "react-email";
import Button from "../components/Button";
import Hr from "../components/Hr";
import Link from "../components/Link";
import Text from "../components/Text";
import Layout from "../components/Layout";
import Socials from "../components/Socials";

interface EmailProps {
  unsubscribeUrl: string;
}

export const Email = ({ unsubscribeUrl }: EmailProps) => (
  <Layout>
    <Text>
      Our next meetup is on 26th November! Join Lotte Pitcher from Umbraco HQ
      and Mitchell Nortje, Paul Dolby and Rehan Butt from Spinbox at Vulcan
      Works for an evening of questionable dependency choices, perfectly good
      solutions to entirely wrong problems, and CMSs losing their heads.
      There’s plenty to unpack!
    </Text>
    <Text>
      🗓️ Thursday, 26/11/2026, 18:00–20:30
      <br />
      📍 Vulcan Works, Northampton, NN1 1EW
      <br />
      💰 Free (registration required)
    </Text>
    <Button href="https://nn1.dev/events/14/">Register now</Button>
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

const renderEmailNewsletter_2026_10_01 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2026_10_01 };
