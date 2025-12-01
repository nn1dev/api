import * as React from "react";
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
      Let’s kick 2025 off with something different. We are excited to invite you
      to our next meet-up where members of our community will present the
      results of their weekend hacks. Due to very limited slots, please reach
      out as soon as possible if you would like to present something. We really
      hope you will like the new format. Registration is, as always, free and
      open now. Hurry up because the number of tickets is capped at 100.
    </Text>
    <Text>
      🗓️ Thursday, 30/01/2025, 18:00
      <br />
      📍 Vulcan Works, Northampton, NN1 1EW
      <br />
      💰 FREE
    </Text>
    <Button href="https://nn1.dev/events/5#get-your-free-ticket">
      Register now
    </Button>
    <Text>
      If you have questions, ping us on social media or reply to this email.
    </Text>
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

const renderEmailNewsletter_2024_12_09 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2024_12_09 };
