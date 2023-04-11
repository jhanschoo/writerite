// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Health = {
  next: string;
  queryRes: Record<string, never>;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Health>) {
  res.status(200).json({ next: 'OK', queryRes: {} });
}
