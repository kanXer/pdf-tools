export async function POST(req) {
  try {
    const { msg } = await req.json();

    if (!msg) {
      return Response.json({ success: false, error: "Message missing" });
    }

    const encoded = encodeURIComponent(msg);

    const apiURL = `https://tele-bridge.vercel.app/api/send?msg=${encoded}`;

    const res = await fetch(apiURL);
    const json = await res.json();

    return Response.json(json);
  } catch (err) {
    return Response.json({ success: false, error: "SERVER_FAILED" });
  }
}