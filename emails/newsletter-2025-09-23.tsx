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
      Our meetup is coming to your town this Thursday at 6pm at Vulcan Works. You can expect six lightning talks by our community members.</Text>

    <Text>
      Paul Maddern is going to talk about Z80 assembly and explain the structure of an actual retro game. Richard is going to share his experience and provide some insights after working in the industry for over two decades. Dennis K Bijo is going to go through cybersecurity concepts. Robert Jamborski made a super cool Spotify utility app that he will share with others. Gabriel is going to explain how to make your home networking more secure and private. Nabbil Abbas wants to share his vision of more decentralised networks than the ones we tend to use. Plenty of great stuff!
    </Text>

    <Text>
      Grab your ticket if you haven't already. Pizza, some snacks, and drinks on us. Everything is, as always, free, and we cannot wait to see you all. This one is going to be a crowded one! 🫶
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

const renderEmailNewsletter_2025_09_23 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2025_09_23 };
