import { Box, Button, Flex, Stack, Table, Text } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";

export const Instructions = ({
  onCancel,
  onNextStep,
}: {
  onCancel(): unknown;
  onNextStep(): unknown;
}) => {
  return (
    <Stack>
      <Text>
        You can import <strong>text cards</strong> from a <strong>.csv</strong>{" "}
        file to your deck. The contents of the .csv file will be used to create
        new cards that will be added to your deck.
      </Text>
      <Text>
        For example, consider a .csv representing the following table, where
        each row has up to 5 non-empty columns:
      </Text>
      <Table>
        <caption>Sample .csv contents</caption>
        <tbody>
          <tr>
            <td>Front 1</td>
            <td>Back 1</td>
            <td>Card 1 Alt. Ans. 1</td>
            <td>Card 1 Alt. Ans. 2</td>
            <td />
          </tr>
          <tr>
            <td>Front 2</td>
            <td>Back 2</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td>Front 3</td>
            <td>Back 4</td>
            <td>Card 3 Alt. Ans. 1</td>
            <td>Card 3 Alt. Ans. 2</td>
            <td>Card 3 Alt. Ans. 3</td>
          </tr>
        </tbody>
      </Table>
      <Text>
        With such a .csv file, importing will create a deck named{" "}
        <strong>demo</strong>, with the following 3 cards:
      </Text>
      <ul>
        <li>Card 1</li>
        <ul>
          <li>
            Front: <em>Front 1</em>
          </li>
          <li>
            Back: <em>Back 1</em>
          </li>
          <li>
            Alternative answers: <em>Card 1 Alt. Ans. 1</em>,{" "}
            <em>Card 1 Alt. Ans. 2</em>
          </li>
        </ul>
        <li>Card 2</li>
        <ul>
          <li>
            Front: <em>Front 2</em>
          </li>
          <li>
            Back: <em>Back 2</em>
          </li>
        </ul>
        <li>Card 3</li>
        <ul>
          <li>
            Front: <em>Front 3</em>
          </li>
          <li>
            Back: <em>Back 3</em>
          </li>
          <li>
            Alternative answers: <em>Card 3 Alt. Ans. 1</em>,{" "}
            <em>Card 3 Alt. Ans. 2</em>, <em>Card 3 Alt. Ans. 3</em>
          </li>
        </ul>
      </ul>
      <Flex gap="xs" wrap="wrap-reverse">
        <Button onClick={onCancel} variant="subtle">
          Cancel
        </Button>
        <Button
          onClick={onNextStep}
          rightIcon={<IconArrowRight />}
          sx={{ flexGrow: 1 }}
        >
          Proceed
        </Button>
      </Flex>
    </Stack>
  );
};
