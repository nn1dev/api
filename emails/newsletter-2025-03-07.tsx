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
    <Heading>Introducing Spotlight: Get to know your fellow members!</Heading>
    <Text>
      Meeting each other at meetups a few times a year is great for forming new
      connections, but not enough to get to know each other well. We would like
      to make it easier, so we came up with the Spotlight series. It is a
      bi-weekly, short-form series of interviews with NN1 Dev Club community
      members. The same questions every time but a different face and story!
    </Text>
    <Text>
      Let's start with{" "}
      <Link href="https://nn1.dev/spotlight/rob-hough/">Rob Hough</Link>, the
      mastermind behind this initiative, alongside{" "}
      <Link href="https://nn1.dev/spotlight/oliver-ash/">Oliver Ash</Link>, a
      great programmer, speaker from one of our past events, and a great
      contributor to the community. That should give you a little bit of a
      taster. Expect some more every other Friday!
    </Text>
    <Button href="https://nn1.dev/spotlight">Meet our members</Button>
    <Hr />
    <Heading>NN1 Dev Club #6 Meetup</Heading>
    <Text>
      Did you get your ticket for the March event already? Half of them are
      gone! Discover how AI agents can turn your ideas into working products in
      hours, and learn firsthand wisdom about running a successful tech
      business. Two great talks by Eric Bye and Rehan Butt. Of course, as
      always, FREE!
    </Text>
    <Text>
      🗓️ Thursday, 27/03/2025, 18:00
      <br />
      📍 Vulcan Works, Northampton, NN1 1EW
      <br />
      💰 Free (ticket required, limited to 100)
    </Text>
    <Button href="https://nn1.dev/events/6/">Get your ticket</Button>
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

const renderEmailNewsletter_2025_03_07 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2025_03_07 };
