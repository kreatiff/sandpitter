export default async function handler(req, res) {
  // Check that the HTTP method used is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  // Destructure the subAccountID and course details from the request body
  const { subAccountID, courseName } = req.body;

  if (!subAccountID || !courseName) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }

  try {
    // Create the course using the Canvas LMS API
    const response = await fetch(`https://stackle.instructure.com/api/v1/accounts/${subAccountID}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CANVAS_API_TOKEN}`,
      },
      body: JSON.stringify({
        course: {
              name: courseName,
            code: courseName,
          default_view: 'feed',
          },
          offer: true
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create course');
    }

    const responseData = await response.json();

    // Send the created course as the response
    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to create course' });
  }
}
