import { render } from "@react-email/render";
import Layout from "../components/Layout.tsx";
import Text from "../components/Text.tsx";
import Button from "../components/Button.tsx";
import Socials from "../components/Socials.tsx";

interface EmailSubscriberConfirmProps {
  url: string;
}

export const EmailSubscriberConfirm = ({
  url,
}: EmailSubscriberConfirmProps) => (
  <Layout>
    <Text>
      Thanks for signing up for our newsletter. We don't like bots, so to ensure
      you are not one, please confirm your email address by clicking the button
      below. You will be all set up!
    </Text>
    <Button href={url}>Confirm your email</Button>

    <Text>Questions? Reach out on social media or reply to this email!</Text>
    <Socials />
  </Layout>
);

EmailSubscriberConfirm.PreviewProps = {
  url: "#",
} as EmailSubscriberConfirmProps;

const renderEmailSubscriberConfirm = async (
  props: EmailSubscriberConfirmProps,
) => ({
  html: await render(<EmailSubscriberConfirm {...props} />),
  text: await render(<EmailSubscriberConfirm {...props} />, {
    plainText: true,
  }),
});

export default EmailSubscriberConfirm;
export { renderEmailSubscriberConfirm };
