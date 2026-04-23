import { Column } from "react-email";
import { Img } from "react-email";
import { Link } from "react-email";
import { Row } from "react-email";

function Socials() {
  return (
    <Row style={{ display: "table-cell", paddingBottom: "26px" }}>
      <Column style={{ paddingRight: "9px" }}>
        <Link href="https://github.com/nn1dev">
          <Img
            src="https://nn1.dev/emails/github.png"
            width="36"
            height="36"
            alt="GitHub logo"
          />
        </Link>
      </Column>
      <Column style={{ paddingRight: "9px" }}>
        <Link href="https://www.linkedin.com/company/nn1dev/">
          <Img
            src="https://nn1.dev/emails/linkedin.png"
            width="36"
            height="36"
            alt="LinkedIn logo"
          />
        </Link>
      </Column>
      <Column style={{ paddingRight: "9px" }}>
        <Link href="https://instagram.com/nn1dev">
          <Img
            src="https://nn1.dev/emails/instagram.png"
            width="36"
            height="36"
            alt="Instagram logo"
          />
        </Link>
      </Column>
      <Column style={{ paddingRight: "9px" }}>
        <Link href="https://facebook.com/nn1dev">
          <Img
            src="https://nn1.dev/emails/facebook.png"
            width="36"
            height="36"
            alt="Facebook logo"
          />
        </Link>
      </Column>
      <Column style={{ paddingRight: "9px" }}>
        <Link href="https://mastodon.social/@nn1dev">
          <Img
            src="https://nn1.dev/emails/mastodon.png"
            width="36"
            height="36"
            alt="Mastodon logo"
          />
        </Link>
      </Column>
      <Column style={{ paddingRight: "9px" }}>
        <Link href="https://bsky.app/profile/nn1.dev">
          <Img
            src="https://nn1.dev/emails/bluesky.png"
            width="36"
            height="36"
            alt="Bluesky logo"
          />
        </Link>
      </Column>
      <Column style={{ paddingRight: "9px" }}>
        <Link href="https://chat.nn1.dev/">
          <Img
            src="https://nn1.dev/emails/discord.png"
            width="36"
            height="36"
            alt="Discord logo"
          />
        </Link>
      </Column>
    </Row>
  );
}

export default Socials;
