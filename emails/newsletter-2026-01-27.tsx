import { render } from "@react-email/render";
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
      A quick reminder that our next meetup is happening in two days and we
      still have a few slots left! We have three amazing speakers lined up for
      you this time: <strong>Keith Cirkel</strong>,{" "}
      <strong>Samantha Wildman</strong> and <strong>Ian Zant-Boer</strong>. We
      would love to see you there! As always the event is free but registration
      is required.
    </Text>
    <Text>
      🗓️ Thursday, 29/01/2026, 18:00
      <br />
      📍 Vulcan Works, Northampton, NN1 1EW
      <br />
      💰 Free (registration required, limited to 100)
    </Text>
    <Button href="https://nn1.dev/events/10">Register now</Button>
    <Hr />
    <Text>
      Code written by <strong>Keith Cirkel</strong> is present in all dominant
      browser engines, and as a Staff Engineer at Mozilla leading the DOM Core
      team, you can tell he knows something about browsers. In his talk, he's
      going to dive into the depths of CSS and the language's most unhinged
      features.
    </Text>
    <Text>
      <strong>Samantha Wildman</strong> and <strong>Ian Zant-Boer</strong> are
      going to share insights from their work advising high-growth technology
      businesses on how to build a financial foundation that attracts investors,
      supports innovation, and maximises long-term value. From idea to
      investment to exit.
    </Text>
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

const renderEmailNewsletter_2026_01_27 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2026_01_27 };
