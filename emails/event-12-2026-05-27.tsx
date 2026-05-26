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
      <strong>NN1 Dev Club #12</strong> is tomorrow and we are looking forward
      to seeing you. Just a quick reminder with all the details, a link to your
      ticket and a schedule.
    </Text>
    <Text>
      🗓️ Thursday, 28/05/2026, 18:00
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
          title:
            '"Resilient Payment Systems: How bank transfers actually work (most of the time)" by Jacek Miloszewski',
          descriptoin:
            "Ever wondered what happens behind the scenes when you send money? In this talk, I’ll take you under the hood of how Form3 helps banks handle inter-bank transfers at scale. We’ll dive into the high-stakes world of security, compliance, and volume, and how we’ve built the architecture (and the teams) to handle it all. I'll cover the practical side of running a mission-critical system, including: scaling teams, regulatory hurdles and hardened security.",
        },
        {
          timeStart: "19:00",
          timeEnd: "19:15",
          title: "Break",
        },
        {
          timeStart: "19:15",
          timeEnd: "19:45",
          title: '"There\'s No Such Thing As Plain Text" by Dylan Beattie',
          descriptoin:
            "When we say something is a plain text file, we’re relying on a huge number of assumptions - about operating systems, editors, file formats, language, culture, history… and, most of the time, that’s OK. But when it goes wrong, good old plain text can lead to some of the weirdest bugs you’ve ever seen. Join Dylan Beattie for a fascinating look into the hidden world of text files - from the history of mechanical teletypes, to how emoji skin tones actually work.",
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

const renderEmailEvent_12_2026_05_27 = async ({ ticketUrl }: EmailProps) => ({
  html: await render(<Email ticketUrl={ticketUrl} />),
  text: await render(<Email ticketUrl={ticketUrl} />, { plainText: true }),
});

export default Email;
export { renderEmailEvent_12_2026_05_27 };
