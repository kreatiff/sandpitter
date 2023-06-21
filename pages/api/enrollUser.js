// Import the Axios library to make HTTP requests
import axios from 'axios';

export default async function handler(req, res) {
  // Check that the HTTP method used is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  // Destructure the required fields from the request body
  const { courseId, userId, type } = req.body;

  if (!courseId || !userId || !type) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }

  try {
    // Enroll the user in the course using the Canvas LMS API
    const response = await axios.post(
      `https://stackle.instructure.com/api/v1/courses/${courseId}/enrollments`,
      {
        enrollment: {
          user_id: userId,
          type: type,
          enrollment_state: 'active',
        }
      },
      {
        headers: {
          // Assuming your BEARER_TOKEN is stored as an environment variable
          'Authorization': `Bearer ${process.env.CANVAS_API_TOKEN}`
        }
      }
    );

    // Send the enrollment confirmation as the response
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to enroll user' });
  }
}
