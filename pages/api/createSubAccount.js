// Import the Axios library to make HTTP requests
import axios from 'axios';

export default async function handler(req, res) {
  // Check that the HTTP method used is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  // Destructure the parentAccountID and subAccountName from the request body
  const { parentAccountID, subAccountName } = req.body;

  if (!parentAccountID || !subAccountName) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }

  try {
    // Create the sub-account using the Canvas LMS API
    const response = await axios.post(
      `https://stackle.instructure.com/api/v1/accounts/${parentAccountID}/sub_accounts`,
      { 
        account: { 
          name: subAccountName 
        } 
      },
      {
        headers: {
          // Assuming your BEARER_TOKEN is stored as an environment variable
          'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
        }
      }
    );

    // Send the created sub-account as the response
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to create sub-account' });
  }
}
