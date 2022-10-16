import { createStyles, Tabs, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { MagnifyingGlassIcon, UploadIcon } from "@radix-ui/react-icons";
import { FC, useState } from "react";
import { ManageDeckProps } from "../../manageDeck/types/ManageDeckProps";
import { ManageDeckSubdecksAddSubdeck } from "./SubdecksAddSubdeck";
import { ManageDeckSubdecksBrowse } from "./SubdecksBrowse";

// TODO: WIP
export const ManageDeckSubdecks: FC<ManageDeckProps> = ({ deck }) => {
  const [activeTab, setActiveTab] = useState<string | null>("view");
  const theme = useMantineTheme();
  const matches = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);
  return (
    <Tabs orientation="vertical" value={activeTab} onTabChange={setActiveTab} keepMounted={false}>
      <Tabs.List>
        <Tabs.Tab value="view" icon={<MagnifyingGlassIcon />} aria-label="View Subdecks">{matches && "View Subdecks"}</Tabs.Tab>
        <Tabs.Tab value="add" icon={<UploadIcon />} arial-label="Add More Subdecks">{matches && "Add More Subdecks"}</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="view" pl="md">
        <ManageDeckSubdecksBrowse deck={deck} />
      </Tabs.Panel>
      <Tabs.Panel value="add" pl="md">
        <ManageDeckSubdecksAddSubdeck deck={deck} />
      </Tabs.Panel>
    </Tabs>
  );
}
