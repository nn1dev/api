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
      NN1 Dev Club #7: "The Future Needs More You" by Natalie de Weerd and
      "Charge or Cheat? The Ethics of Billing for AI-Generated Work" by Dr Kardi
      Somerfield
    </Heading>
    <Text>
      Come and join us in two weeks for our last meetup before we take a longer
      summer break. We have two speakers lined up, each covering a
      thought-provoking and perhaps even slightly controversial subject. Is job
      security a real concern for software engineers? What is the healthy
      balance between relying on AI and human input, and how much should we
      charge for work created with Copilot? Is there still room for creativity?
    </Text>
    <Text>
      There’s plenty to discuss over pizza and drinks, which, as always, are on
      us. Tickets are capped at 100, and half of them have already gone. Hurry
      up, save your spot, and we’ll see you in a couple of weeks.
    </Text>
    <Text>
      🗓️ Thursday, 29/05/2025, 18:00
      <br />
      📍 Vulcan Works, Northampton, NN1 1EW
      <br />
      💰 Free (ticket required, limited to 100)
    </Text>
    <Button href="https://nn1.dev/events/7">Get your ticket</Button>
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

const renderEmailNewsletter_2025_05_15 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2025_05_15 };
