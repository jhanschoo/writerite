import { FC } from 'react';
import { Stack, Table, Text } from '@mantine/core';

export const ManageDeckCardsUploadInstructions: FC = () => {
  return (
    <Stack>
    <Text>
      You can import a deck of <strong>text cards</strong> from a .csv file. When you import from .csv, the filename and contents of the .csv file will respectively be used to fill in the deck title and deck&lsquo;s cards (front, back, alternative answers).
    </Text>
    <Text>
      For example, consider a .csv representing the following table, where each row has up to 5 non-empty columns:
    </Text>
    <Table aria-label="contents of demo.csv">
      <thead>
        <tr>
          <th>Row 1 (front)</th>
          <th>Row 2 (back)</th>
          <th>Row 3 (optional: accepted answer)</th>
          <th>Row 4 (optional: accepted answer)</th>
          <th>Row 5 (optional: accepted answer)</th>
        </tr>
      </thead>
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
      With such a .csv file, importing will create a deck named <strong>demo</strong>, with the following 3 cards:
    </Text>
    <ul>
      <li>Card 1</li>
      <ul>
        <li>Front: <em>Front 1</em></li>
        <li>Back: <em>Back 1</em></li>
        <li>Alternative answers: <em>Card 1 Alt. Ans. 1</em>, <em>Card 1 Alt. Ans. 2</em></li>
      </ul>
      <li>Card 2</li>
      <ul>
        <li>Front: <em>Front 2</em></li>
        <li>Back: <em>Back 2</em></li>
      </ul>
      <li>Card 3</li>
      <ul>
        <li>Front: <em>Front 3</em></li>
        <li>Back: <em>Back 3</em></li>
        <li>Alternative answers: <em>Card 3 Alt. Ans. 1</em>, <em>Card 3 Alt. Ans. 2</em>, <em>Card 3 Alt. Ans. 3</em></li>
      </ul>
    </ul>
    </Stack>
  );
};
