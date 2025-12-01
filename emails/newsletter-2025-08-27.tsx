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
      We needed a little summer break, but now we're ready to get back to the
      game. Our 8th meetup is coming to your town on 25th September. This one's
      going to be another in our "Hack & Share" series, where we let a few
      community members present whatever they want: side project, case study, or
      some recent exploration. The previous event of this kind was very well
      received by attendees, and we hope for the same this time.
    </Text>

    <Text>
      Good chats, pizza, and beverages of all kinds are on us. Of course, it's
      free, you just need to grab a ticket and move your arse to Vulcan Works.
      We hope to see you there! 😘
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

const renderEmailNewsletter_2025_08_27 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2025_08_27 };
