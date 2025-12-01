import * as React from "react";
import { render } from "@react-email/render";
import Layout from "../components/Layout.tsx";
import Text from "../components/Text.tsx";
import Button from "../components/Button.tsx";
import Socials from "../components/Socials.tsx";

interface EmailSignupConfirmProps {
  eventName: string;
  url: string;
}

export const EmailSignupConfirm = ({
  eventName,
  url,
}: EmailSignupConfirmProps) => (
  <Layout>
    <Text>
      Thanks for signing up for the upcoming NN1 Dev Club event,{" "}
      <strong>{eventName}</strong>. We don't like bots, so to ensure you are not
      one, please confirm your email address by clicking the button below. You
      will be all set up!{" "}
    </Text>
    <Button href={url}>Confirm your email</Button>

    <Text>Questions? Reach out on social media or reply to this email!</Text>
    <Socials />
  </Layout>
);

EmailSignupConfirm.PreviewProps = {
  eventName:
    '#1: "Boiling Nemo" by PJ Evans and "The Science of Software Engineering" by Junade Ali',
  url: "#",
} as EmailSignupConfirmProps;

const renderEmailSignupConfirm = async (props: EmailSignupConfirmProps) => ({
  html: await render(<EmailSignupConfirm {...props} />),
  text: await render(<EmailSignupConfirm {...props} />, { plainText: true }),
});

export default EmailSignupConfirm;
export { renderEmailSignupConfirm };
