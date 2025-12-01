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
      Somerfield{" "}
    </Heading>
    <Text>
      We are excited to invite you to our next meetup! Join us for two
      thought-provoking talks by <strong>Natalie de Weerd</strong> and{" "}
      <strong>Dr Kardi Somerfield</strong>. Connect with an incredible community
      of local software enthusiasts, enjoy food and drinks, and, most
      importantly, have tons of fun—all for FREE!
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
    <Heading>NN1 Dev Club Open Collective</Heading>
    <Text>
      We've poured our hearts (and probably too much caffeine) into growing the
      NN1 Dev Club into the awesome community it is today. But, truth be told,
      chasing event sponsors has started to feel a bit like herding cats. Each
      event sets us back about £500, and instead of running around, we'd love to
      turn to you—our amazing community—for a helping hand. Any extra funds will
      go to local charities, so it’s a win-win! With Open Collective, you can
      see exactly where every penny goes, because transparency is how we roll.
    </Text>
    <Button href="https://opencollective.com/nn1-dev">Support us</Button>
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

const renderEmailNewsletter_2025_04_25 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2025_04_25 };
