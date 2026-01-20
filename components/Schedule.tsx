import { Section, Text } from "@react-email/components";

function NN1Text({
  items,
}: {
  items: Array<{
    timeStart: string;
    timeEnd: string;
    title: string;
    descriptoin?: string;
  }>;
}) {
  return items.map((item, index) => (
    <Section key={index} style={{ marginBottom: "26px" }}>
      <Text
        style={{
          color: "#ccc",
          margin: "0",
          fontSize: "14px",
          lineHeight: "26px",
        }}
      >
        {item.timeStart} - {item.timeEnd}
      </Text>
      <Text
        style={{
          color: "#f8f7ff",
          margin: "0 ",
          fontSize: "16px",
          lineHeight: "26px",
          fontWeight: "700",
        }}
      >
        {item.title}
      </Text>
      {item.descriptoin ? (
        <Text
          style={{
            color: "#f8f7ff",
            margin: "0 ",
            fontSize: "16px",
            lineHeight: "26px",
          }}
        >
          {item.descriptoin}
        </Text>
      ) : null}
    </Section>
  ));
}

export default NN1Text;
