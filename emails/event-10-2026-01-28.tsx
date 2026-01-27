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
      <strong>NN1 Dev Club #10</strong> is tomorrow and we are looking forward
      to seeing you. Just a quick reminder with all the details and the link to
      your ticket.
    </Text>
    <Text>
      🗓️ Thursday, 29/01/2026, 18:00
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
          title: '"Bad at CSS" by Keith Cirkel',
          descriptoin:
            'CSS is a beautiful nightmare of cascading chaos. To be truly bad at it requires mastery of arcane syntax. Together we’ll dive into the depths of the cascade to explore the "wrong" ways to write CSS - the hacks, the horrors, and the head-scratchers - and uncover the logic (or lack thereof) behind the language’s most unhinged features. You’ll leave this talk worse at CSS… and somehow better for it.',
        },
        {
          timeStart: "19:00",
          timeEnd: "19:15",
          title: "Break",
        },
        {
          timeStart: "19:15",
          timeEnd: "19:45",
          title:
            '"Start-Up to Exit: The Journey for Tech Companies" by Samantha Wildman and Ian Zant-Boer',
          descriptoin:
            "From idea to investment to exit, every stage of a tech company’s journey brings new financial and strategic challenges. In this session, Samantha Wildman and Ian Zant-Boer share insights from their work advising high-growth technology businesses on how to build a finance foundation that attracts investors, supports innovation, and maximises long-term value. Samantha will explore the key financial levers that drive growth, how to prepare for fundraising rounds and exits. Ian Zant-Boer will offer a legal and investor lens on scaling, sharing his experience as a venture capital founder and adviser to scale-ups on how to structure for investment and avoid common legal pitfalls during growth and exit.",
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

const renderEmailEvent_10_2026_01_28 = async ({ ticketUrl }: EmailProps) => ({
  html: await render(<Email ticketUrl={ticketUrl} />),
  text: await render(<Email ticketUrl={ticketUrl} />, { plainText: true }),
});

export default Email;
export { renderEmailEvent_10_2026_01_28 };
