import * as React from "react";
import { render } from "@react-email/render";
import Layout from "../components/Layout";
import Text from "../components/Text";
import Button from "../components/Button";
import Link from "../components/Link";
import Heading from "../components/Heading";
import Hr from "../components/Hr";
import Socials from "../components/Socials";
import Schedule from "../components/Schedule";

interface EmailProps {
  ticketUrl: string;
}

export const Email = ({ ticketUrl }: EmailProps) => (
  <Layout>
    <Text>
      <strong>NN1 Dev Club #11</strong> is tomorrow and we are looking forward
      to seeing you. Just a quick reminder with all the details, a link to your
      ticket and a schedule.
    </Text>
    <Text>
      🗓️ Thursday, 26/03/2026, 18:00
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

    <Button href={ticketUrl}>Open Your Ticket</Button>
    <Hr />
    <Heading>Schedule</Heading>
    <Schedule
      items={[
        {
          timeStart: "18:00",
          timeEnd: "18:30",
          title: "Meet and Greet",
        },
        {
          timeStart: "18:30",
          timeEnd: "19:00",
          title: '"Compiling JavaScript ahead-of-time" by Oliver Medhurst',
          descriptoin:
            "Existing JavaScript (and TypeScript) is compiled just-in-time, compiled from source on user's machines, but what about ahead-of-time, compiled in advance like C++ or Rust? This talk will explore the pros and cons of this upcoming paradigm with real-world examples and working demos!",
        },
        {
          timeStart: "19:00",
          timeEnd: "19:15",
          title: "Break",
        },
        {
          timeStart: "19:15",
          timeEnd: "19:45",
          title: '"Future of Work is Async" by Rob Hough',
          descriptoin:
            "The way developers work is changing. Remote work, AI, and automation mean we have more leverage than ever — yet many teams are still trapped in endless meetings, interruptions, and slow-moving projects. This talk explores why smaller, async teams are becoming a competitive advantage, and what it takes to work this way effectively.",
        },
      ]}
    />

    <Hr />
    <Text>
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

const renderEmailEvent_11_2026_03_25 = async ({ ticketUrl }: EmailProps) => ({
  html: await render(<Email ticketUrl={ticketUrl} />),
  text: await render(<Email ticketUrl={ticketUrl} />, { plainText: true }),
});

export default Email;
export { renderEmailEvent_11_2026_03_25 };
