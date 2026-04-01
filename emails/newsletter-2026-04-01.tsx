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
      #12: "Resilient Payment Systems: How bank transfers actually work (most of
      the time)" by Jacek Miloszewski and "There's No Such Thing As Plain Text"
      by Dylan Beattie
    </Heading>
    <Text>
      We would like to invite you all to the upcoming May meetup, and this one
      is going to be geeky! We have two talks by incredible speakers lined up, a
      top community of passionate geeks, pizza, beers, and all the usual jazz
      you can expect from a good meetup.
    </Text>
    <Text>
      <strong>Dylan Beattie</strong> is an organiser of the London .NET User
      Group, creator of the Rockstar programming language, musician and
      international keynote speaker. He is going to take us on a journey to the
      hidden world of text files, from the history of mechanical teletypes to
      how emoji skin tones actually work.
    </Text>
    <Text>
      <strong>Jacek Miloszewski</strong> from FORM3 is a good friend of the
      meetup and regular attendee from day one. He is going to cover the
      practical side of running a mission-critical payment system, including:
      scaling teams, regulatory hurdles, and hardened security.
    </Text>
    <Text>
      🗓️ Thursday, 28/05/2026, 18:00
      <br />
      📍 Vulcan Works, Northampton, NN1 1EW
      <br />
      💰 Free (registration required)
    </Text>
    <Button href="https://nn1.dev/events/12">Register now</Button>
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

const renderEmailNewsletter_2026_04_01 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2026_04_01 };
