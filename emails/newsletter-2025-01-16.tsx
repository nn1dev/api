import * as React from "react";
import { render } from "@react-email/render";
import Button from "../components/Button.tsx";
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
    <Heading>
      Hack & Share - a rundown of side projects by Northamptonshire geeks
    </Heading>
    <Text>
      Ready to jumpstart 2025? Join us on 30th January at 18:00 at Vulcan Works
      for a showcase of community-built side projects! From technical deep dives
      to AI wizardry – with some cats and Pokémon thrown in. Experience the
      passion for software development in its purest form, shared by makers just
      like you. As always, our event is free, but tickets are very limited –
      secure your spot now!
    </Text>
    <Text>
      🗓️ Thursday, 30/01/2025, 18:00
      <br />
      📍 Vulcan Works, Northampton, NN1 1EW
      <br />
      💰 FREE
    </Text>
    <Button href="https://nn1.dev/events/5#get-your-free-ticket">
      Get your ticket
    </Button>
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

const renderEmailNewsletter_2025_01_16 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2025_01_16 };
