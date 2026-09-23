import { render } from "react-email";
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
      <strong>NN1 Dev Club #13</strong> is tomorrow and we are looking forward
      to seeing you. Just a quick reminder with all the details, a link to your
      ticket and a schedule.
    </Text>
    <Text>
      🗓️ Thursday, 24/09/2026, 18:00
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

    <Button href={ticketUrl}>Open your ticket</Button>
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
          title: '"Scrubs to scripts" by Diana Silva',
          descriptoin:
            'What happens when a healthcare worker accidentally falls down the coding rabbit hole? An interactive talk about changing careers at 25, learning to code, surviving imposter syndrome, and why saying "yes" to CS50 changed my life.',
        },
        {
          timeStart: "19:00",
          timeEnd: "19:15",
          title: "Break",
        },
        {
          timeStart: "19:15",
          timeEnd: "19:45",
          title: '"I spared no expense" by Ana Rodrigues',
          descriptoin:
            "A talk about the projects I built for my own tiny corner of the web that I did not need, that nobody asked for, and that I built anyway despite my bank account telling me not to. Some of them still work. All of them have a story. No expense was spared.",
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

const renderEmailEvent_13_2026_09_23 = async ({ ticketUrl }: EmailProps) => ({
  html: await render(<Email ticketUrl={ticketUrl} />),
  text: await render(<Email ticketUrl={ticketUrl} />, { plainText: true }),
});

export default Email;
export { renderEmailEvent_13_2026_09_23 };
