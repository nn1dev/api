import { render } from "react-email";
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
    <Heading>Merged Futures 8</Heading>
    <Text>
      You'd better save this date, folks! The 8th edition of Merged Futures is
      happening on Friday, 26th June 2026. It's the biggest tech innovation
      showcase in Northamptonshire, with over 20 presentations and workshops
      spread across 5 stages, dozens of exhibitors, but most importantly, a day
      full of learning and networking with the local geeks. Yes, it's completely
      free!
    </Text>
    <Text>
      We feel extremely honoured that NN1 Dev Club is taking over one of the
      stages this year, and we have a brilliant lineup of talks and workshops
      planned. Check the{" "}
      <Link href="https://digitalnorthants.com/events2/merged-futures-8">
        Digital Northants website for the official announcement and full agenda
      </Link>
      , and{" "}
      <Link href="https://www.eventbrite.co.uk/e/merged-futures-8-digital-northants-8th-annual-innovation-showcase-tickets-1985378303952">
        book your ticket now
      </Link>
      . We're looking forward to seeing you there!
    </Text>
    <Text>
      🗓️ Friday, 26/06/2026, 10:00
      <br />
      📍
      <Link href="https://maps.app.goo.gl/c33gNVQ6AUwR9uCw5">
        Learning Hub, Waterside Campus England, NN1 5PH
      </Link>
      <br />
      💰 Free (registration required)
    </Text>
    <Button href="https://www.eventbrite.co.uk/e/merged-futures-8-digital-northants-8th-annual-innovation-showcase-tickets-1985378303952">
      Register now
    </Button>
    <Text>
      If you're coming, please let folks in your network know about it and tag
      us on social media with{" "}
      <Link href="https://www.linkedin.com/search/results/all/?keywords=%23mergedfutures8">
        #mergedfutures8
      </Link>{" "}
      and{" "}
      <Link href="https://www.linkedin.com/search/results/all/?keywords=%23nn1dev">
        #nn1dev
      </Link>
      .
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

const renderEmailNewsletter_2026_04_30 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2026_04_30 };
