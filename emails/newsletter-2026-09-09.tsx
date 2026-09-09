import { render } from "react-email";
import Hr from "../components/Hr";
import Link from "../components/Link";
import Text from "../components/Text";
import Layout from "../components/Layout";
import Socials from "../components/Socials";
import Button from "../components/Button";

interface EmailProps {
  unsubscribeUrl: string;
}

export const Email = ({ unsubscribeUrl }: EmailProps) => (
  <Layout>
    <Text>
      Women in tech are taking over the stage at the September event, and this
      one is going to be a busy one. Internationally known speaker{" "}
      <strong>Ana Rodrigues</strong> is going to share her passion for personal
      side projects with us. <strong>Diana Silva</strong> hopes to inspire
      others with her story of how she transitioned from being a healthcare
      worker to becoming one of the most accomplished software engineers on the
      West Northamptonshire Council team.
    </Text>

    <Text>
      <Link href="https://nn1.dev/events/13/">Book your ticket now</Link> and
      join us on 24 September at 6 pm at Vulcan Works. There are only 30 spots
      left, so you’d better be quick! As always, the event is completely free
      and 100% passion-driven. From devs, for devs!
    </Text>

    <Button href="https://nn1.dev/events/13/">Register now</Button>

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
  unsubscribeUrl: "https://nn1.dev",
} as EmailProps;

const renderEmailNewsletter_2026_09_09 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2026_09_09 };
