import * as React from "react";
import { render } from "@react-email/render";
import Layout from "../components/Layout.tsx";
import Text from "../components/Text.tsx";
import Button from "../components/Button.tsx";
import Link from "../components/Link.tsx";
import Heading from "../components/Heading.tsx";
import Hr from "../components/Hr.tsx";
import Socials from "../components/Socials.tsx";

interface EmailProps {
  ticketUrl: string;
}

export const Email = ({ ticketUrl }: EmailProps) => (
  <Layout>
    <Text>
      We are looking forward to seeing you tomorrow at the{" "}
      <strong>
        #5: Hack & Share - a rundown of side projects by Northamptonshire geeks
      </strong>
      . This is just a handy reminder with mandatory info and a link to your
      ticket.
    </Text>
    <Text>
      🗓️ Thursday, 30/01/2025, 18:00
      <br />
      📍{" "}
      <Link href="https://maps.app.goo.gl/q7RFeDME5cLZWPFA7">
        Vulcan Works, Northampton, NN1 1EW
      </Link>
      <br />
      🅿️{" "}
      <Link href="https://maps.app.goo.gl/fk3jpaPLSLGrHNmH6">
        St. John's Multi Storey Car Park
      </Link>
    </Text>

    <Button href={ticketUrl}>View Your Ticket</Button>
    <Hr />
    <Heading>Schedule</Heading>
    <Text>
      18:00-18:30: Meet and Greet
      <br />
      18:30-20:00: Rundown of side projects by Northamptonshire geeks
    </Text>
    <Hr />
    <Text>
      Looking forward to seeing you there!
      <br />
      <br />
      NN1 Dev Club Crew,
      <br />
      Pawel & Darren
    </Text>
    <Socials />
  </Layout>
);

Email.PreviewProps = {
  ticketUrl: "https://nn1.dev/events/5/123",
} as EmailProps;

const renderEmailEvent_5_2025_01_29 = async ({ ticketUrl }: EmailProps) => ({
  html: await render(<Email ticketUrl={ticketUrl} />),
  text: await render(<Email ticketUrl={ticketUrl} />, { plainText: true }),
});

export default Email;
export { renderEmailEvent_5_2025_01_29 };
