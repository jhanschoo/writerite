import { Title } from "@mantine/core";
import { PropsWithChildren } from "react";

const HeroHeading = ({ children }: PropsWithChildren) => (
  <Title
    order={1}
    align="center"
    sx={{
      fontSize: "300%",
    }}
  >
    {children}
  </Title>
);

export default HeroHeading;
