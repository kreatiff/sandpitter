import axios from "axios";

export default async function handler(req, res) {
  const query = new URLSearchParams({
    archived: "false",
    page: "0",
    order_by: "updated",
    reverse: "false",
    subtasks: "false",
    status: ["demo requested"],
    include_closed: "false",
  }).toString();
  const listId = "180828250";
  try {
    const response = await axios.get(
      `https://api.clickup.com/api/v2/list/${listId}/task`,
      {
        params: {
          archived: "false",
          page: "0",
          order_by: "updated",
          reverse: "false",
          subtasks: "false",
          statuses: ["demo requested", "setup canvas"],
          include_closed: "false",
        },
        headers: {
          Authorization: process.env.CLICKUP_API_TOKEN,
        },
      }
    );
    const tasks = response.data.tasks;
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}
