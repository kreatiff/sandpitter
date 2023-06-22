import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const { taskId, comment } = req.body;

  if (!taskId || !comment) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const response = await axios.post(
      `https://api.clickup.com/api/v2/task/${taskId}/comment`,
      {
        comment_text: comment,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.CLICKUP_API_TOKEN,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to post comment to ClickUp task" });
  }
}
