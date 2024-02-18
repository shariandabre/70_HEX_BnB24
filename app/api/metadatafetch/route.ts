import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import ogs from "open-graph-scraper";

export const GET = async (req: NextRequest) => {
  const {searchParams} = new URL(req.url);
    const param = searchParams.get("url");
    

  if (!param) return new Response("Error", { status: 400 });

  const options = { url: param };

  const { error, html, result, response } = await ogs(options);

  return NextResponse.json({ result });
};
