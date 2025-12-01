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
      NN1 Dev Club #6: "Move Fast and Build Things: A Non-Technical Guide to AI
      Agents" by Eric Bye and "Dark Side of the Moon" by Rehan Butt
    </Heading>
    <Text>
      We are stoked to invite you to our meetup on March 27th at 18:00 in Vulcan
      Works. Eric Bye will kick off by revealing practical strategies to use AI
      agents for rapid product development. Then, Rehan Butt will follow by
      sharing candid insights from two decades of experience in the tech
      business, exposing the hidden challenges and essential soft skills that
      can make or break your tech career.
    </Text>
    <Text>
      🗓️ Thursday, 27/03/2025, 18:00
      <br />
      📍 Vulcan Works, Northampton, NN1 1EW
      <br />
      💰 Free (ticket required, limited to 100)
    </Text>
    <Button href="https://nn1.dev/events/6/#get-your-ticket">
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

const renderEmailNewsletter_2025_02_03 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2025_02_03 };
