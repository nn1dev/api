import { render } from "react-email";
import Button from "../components/Button";
import Hr from "../components/Hr";
import Link from "../components/Link";
import Text from "../components/Text";
import Layout from "../components/Layout";
import Socials from "../components/Socials";
import Schedule from "../components/Schedule";

interface EmailProps {
  unsubscribeUrl: string;
}

export const Email = ({ unsubscribeUrl }: EmailProps) => (
  <Layout>
    <Text>
      Join us for the{" "}
      <Link href="https://digitalnorthants.com/events2/merged-futures-8">
        Merged Futures 8
      </Link>
      , an annual celebration of everything Northamptonshire tech-related at the
      Learning Hub of the University of Northampton on Friday 26 June 2026. It
      is a free event, full of insightful talks spread across 5 rooms and an
      opportunity to talk to exhibitors (all sorts, from big brands like
      Microsoft, Dell and AWS to great little local agencies like Toru Digital).
      Most importantly, it is a chance to socialise with the local community of
      geeks!
    </Text>
    <Text>
      This year we have been invited to take care of one of the event tracks.
      Room 4 is where NN1 Dev Club folks are going to be! You know the drill —
      no nonsense, good practical talks and workshops for you all, totally free!
      Here is the agenda.
    </Text>

    <Schedule
      items={[
        {
          timeStart: "11:00",
          timeEnd: "11:45",
          title:
            '"From Task to Invention: A Hands-on Sprint to Find New Value in AI" by Eric Bye (Erictron AI)',
          descriptoin:
            "Most AI conversations are about efficiency and that's a fine starting point but it's also where most people stop. The more interesting question is what a task enables when you remove the old constraints on scale and scope, because that'show a simple task becomes an asset, something new that didn't exist before you started looking. In this hands-on workshop you'll take an AI use case and work it through a structured exercise that pushes from task all the way to invention. You'll walk away with a map of value you hadn't spotted and a way of thinking you'll keep using long after this.",
        },
        {
          timeStart: "12:00",
          timeEnd: "12:45",
          title:
            "What a Load of Crap: The Complex Tech Behind Collecting Your Bins and Clearing Up Your Mess” by Kevin White (West Northamptonshire Council)",
          descriptoin:
            "Collecting bins and clearing up rubbish may seem like the least technical and definitely least glamorous activities a developer could work on. But behind every missed bin, dog poo report, and 'when's my collection?' call sits a stack of AWS services, chatbots, and automations that will hopefully surprise you.",
        },
        {
          timeStart: "13:30",
          timeEnd: "14:15",
          title: "ull Stack Speedrun” by Roger Hughes (Sign In Solutions)",
          descriptoin:
            "Roger Hughes will talk about his side-project workflow, building a PWA rapidly from scratch using the free tier AI/backend/frontend. Other than a GitHub and OpenCode account, not much more is needed to follow along and leave the session with a working app.",
        },
        {
          timeStart: "14:30",
          timeEnd: "15:15",
          title:
            '"Product Management is Not a Secret Society: A Jargon-Free Guide to Thinking Like a PM" by Kiran Patel',
          descriptoin:
            'Mention you’re a Product Manager and you’ll get anything from a blank stare to a lecture on LinkedIn "thought leadership." But beneath the buzzwords and the corporate mystique, Product Management isn’t a secret society, it’s just a way of working that actually makes sense. It’s the art of stopping the "busy work" to focus on the problems that actually matter. In this interactive session, Kiran will be stripping away the jargon to show you how anyone, in any role, can use these basic habits to get better results without the fancy title.',
        },
      ]}
    />
    <Hr />
    <Text>
      And this is only an agenda for our room. There are 4 more to cherry-pick
      other great talks. Afterwards, stick around for a pizza, drink and good
      chat at the Waterside Bar and Restaurant. Register today and see you on
      Friday 26 June 2026.
    </Text>
    <Text>
      🗓️ Friday, 26/06/2026, 9:30AM - 3:30PM
      <br />📍 Learning Hub, Waterside Campus, NN1 5PH
      <br />💰 Free (registration required)
    </Text>
    <Button href="https://www.eventbrite.co.uk/e/merged-futures-8-digital-northants-8th-annual-innovation-showcase-tickets-1985378303952?aff=oddtdtcreator">
      Get your free ticket
    </Button>
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
  unsubscribeUrl: "https://nn1.dev",
} as EmailProps;

const renderEmailNewsletter_2026_06_19 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2026_06_19 };
