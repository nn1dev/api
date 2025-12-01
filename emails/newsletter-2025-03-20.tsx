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
    <Heading>NN1 Dev Club #6 is coming next week!</Heading>
    <Text>
      We're pumped about the meetup next week! Our superb speakers, Eric and
      Rehan, are ready to share their wisdom about AI agents and first-hand tips
      about running a successful tech business. In today's tech landscape this
      one is not to be missed! As always, we'll have food, snacks, and drinks
      prepared for you all. And yes, it's all FREE - from devs for devs!
    </Text>
    <Text>
      🗓️ Thursday, 27/03/2025, 18:00
      <br />
      📍 Vulcan Works, Northampton, NN1 1EW
      <br />
      💰 Free (ticket required, limited to 100)
    </Text>
    <Button href="https://nn1.dev/events/6/">Get your free ticket</Button>
    <Text>
      Due to venue capacity restrictions, attendance is limited to 100 people.
      While admission is free, registration is mandatory to comply with mass
      event regulations. Please be prepared to present your ticket at the
      entrance. Your email address will be used solely for critical
      communications regarding this event and nothing else.
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

const renderEmailNewsletter_2025_03_20 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2025_03_20 };
