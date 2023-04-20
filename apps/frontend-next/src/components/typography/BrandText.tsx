import { PropsWithChildren } from "react";
import { Text } from "@mantine/core";
import { useFont } from "@/hooks";

interface Props {
  full?: boolean;
  prefix?: string;
  suffix?: string;
}

const BrandText = ({ prefix, full, suffix }: PropsWithChildren<Props>) => {
  const brandFont = useFont({ type: "brand" });
  return (
    <Text
      component="span"
      sx={{
        ...brandFont.style,
        fontSize: "125%",
      }}
    >
      {prefix}
      {full ? "WriteRite" : "Wr"}
      {suffix}
    </Text>
  );
};

export default BrandText;
