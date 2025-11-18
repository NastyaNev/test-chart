import { http, HttpResponse } from "msw";
import { data } from "./data";

export const handlers = [
  http.get("https://example.com/api/data", () => {
    return HttpResponse.json(data);
  }),

  http.post("https://example.com/api/data", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: Date.now(), ...body });
  }),
];
