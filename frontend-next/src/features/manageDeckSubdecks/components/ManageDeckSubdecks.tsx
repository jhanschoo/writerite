import { Tabs, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { MagnifyingGlassIcon, UploadIcon } from "@radix-ui/react-icons";
import { FC, useState } from "react";
import { ManageDeckProps } from "../../manageDeck/types/ManageDeckProps";

// TODO: WIP
export const ManageDeckSubdecks: FC<ManageDeckProps> = ({ deck }) => {
  const [activeTab, setActiveTab] = useState<string | null>("view");
  const theme = useMantineTheme();
  const matches = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);
  return (
    <Tabs orientation="vertical" value={activeTab} onTabChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="view" icon={<MagnifyingGlassIcon />} aria-label="View Subdecks">{matches && "View Subdecks"}</Tabs.Tab>
        <Tabs.Tab value="add" icon={<UploadIcon />} arial-label="Add More Subdecks">{matches && "Add More Subdecks"}</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="view" pl="md">
      </Tabs.Panel>
      <Tabs.Panel value="add" pl="md">
      </Tabs.Panel>
    </Tabs>
  );
  // return <>
  //   <ManageDeckSubdecksAddSubdeckDialog deck={deck} open={open} onClose={() => setOpen(false)} />
  //   <Stack direction="row" spacing={2}>
  //     <Stack alignItems="stretch" spacing={2}>
  //       <Button size="large" variant="contained" onClick={() => setOpen(true)}>
  //         Create New
  //       </Button>
  //       <Button size="large" variant="contained" onClick={() => setOpen(true)}>
  //         Add Existing
  //       </Button>
  //     </Stack>
  //     <Paper>
  //       <Stack paddingX={2} paddingY={1}>
  //         <Typography variant="h5">Deck Title</Typography>
  //         <Typography variant="body1">last edited: 1234-56-78</Typography>
  //       </Stack>
  //     </Paper>
  //   </Stack>
  // </>;
}
