import { render } from "react-email";
import Hr from "../components/Hr";
import Link from "../components/Link";
import Text from "../components/Text";
import Layout from "../components/Layout";
import Socials from "../components/Socials";

interface EmailProps {
  unsubscribeUrl: string;
}

export const Email = ({ unsubscribeUrl }: EmailProps) => (
  <Layout>
    <Text>
      If you work in tech, chances are you work from home every day and rarely
      get to hang out with other like-minded geeks. That's why we run a free
      coworking day on the last Friday of every month, and the next one is
      tomorrow.
    </Text>

    <Text>
      Swap your home office for a day in a room full of software craftspeople,
      designers, and all sorts of interesting people. Meet great folks, learn
      from each other, and grab lunch together. Need to jump on a call or want
      some quiet? There are plenty of soundproof booths on hand.
    </Text>

    <Text>
      Join us tomorrow, and on the last Friday of every month, at{" "}
      <Link href="https://maps.app.goo.gl/q7RFeDME5cLZWPFA7">Vulcan Works</Link>{" "}
      in the second (big) coworking room. The lovely folks at reception will
      point you towards the NN1 Dev Club crowd if you can't find us.
    </Text>

    <Text>
      Any questions? Use the{" "}
      <Link href="https://discord.com/channels/1299747820156354651/1310930531822735371">
        #coworking-day channel on our Discord server
      </Link>
      , reply to this email, or drop us a line on social media.
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
  unsubscribeUrl: "https://nn1.dev",
} as EmailProps;

const renderEmailNewsletter_2026_07_30 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2026_07_30 };
