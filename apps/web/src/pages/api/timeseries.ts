import { Sensor } from "@/lib/kysely";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await Sensor.selectAll().execute();

  res.status(200).json(result);
};

export default handler;
