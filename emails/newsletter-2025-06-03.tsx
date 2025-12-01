import { render } from "@react-email/render";
import Button from "../components/Button.tsx";
import Hr from "../components/Hr.tsx";
import Link from "../components/Link.tsx";
import Text from "../components/Text.tsx";
import Layout from "../components/Layout.tsx";
import Socials from "../components/Socials.tsx";

interface EmailProps {
  unsubscribeUrl: string;
}

export const Email = ({ unsubscribeUrl }: EmailProps) => (
  <Layout>
    <Text>
      The well-received "Hack & Share" format is returning on 25th September!
      We’ll have six short-form presentations (15 minutes max) delivered by our
      community members. The topics can be anything: a side project, a recent
      exploration, or simply something the speaker is deeply passionate about.
      <br />
      <br />
      We still have two speaker slots available, so let us know if you’d like to
      present. We’re looking forward to seeing you in September, but in the
      meantime, enjoy your summer break!
    </Text>

    <Text>
      🗓️ Thursday, 25/09/2025, 18:00
      <br />
      📍 Vulcan Works, Northampton, NN1 1EW
      <br />
      💰 Free (ticket required, limited to 100)
    </Text>
    <Button href="https://nn1.dev/events/8">Get your ticket</Button>
    <Hr />
    <Text>
      If you like what we do,{" "}
      <Link href="https://opencollective.com/nn1-dev">
        please consider supporting us on Open Collective
      </Link>
      . Your donations help us strengthen the community and save us a great deal
      of time that would otherwise be spent chasing sponsors. Every penny raised
      beyond what we need for the event will be donated to a local charity. All
      transactions, both incoming and outgoing, are public—so there are no
      secrets and complete transparency.
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
  unsubscribeUrl: "#",
} as EmailProps;

const renderEmailNewsletter_2025_06_03 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2025_06_03 };
