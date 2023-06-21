import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      'https://api.clickup.com/api/v2/list/180828250/task?archived=false&include_closed=false/',
      {
        headers: {
          Authorization: process.env.CLICKUP_API_TOKEN,
        },
      }
    );
    const tasks = response.data.tasks;
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}
