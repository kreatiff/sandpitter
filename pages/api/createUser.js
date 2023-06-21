// Import the Axios library to make HTTP requests
import axios from 'axios';

export default async function handler(req, res) {
  // Check that the HTTP method used is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  // Destructure the required fields from the request body
  const { accountId, name, shortName, email, password } = req.body;

  if (!accountId || !name || !shortName || !email || !password) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }

  try {
    // Create the user using the Canvas LMS API
    const response = await axios.post(
      `https://stackle.instructure.com/api/v1/accounts/${accountId}/users`,
      { 
        user: {
          name: name,
          short_name: shortName,
          terms_of_use: true,
          skip_registration: true
        },
        pseudonym: {
          unique_id: email,
          password: password
        }
      },
      {
        headers: {
          // Assuming your BEARER_TOKEN is stored as an environment variable
          'Authorization': `Bearer ${process.env.CANVAS_API_TOKEN}`
        }
      }
    );

    // Send the created user as the response
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to create user' });
  }
}
