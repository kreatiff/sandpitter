// Import the Axios library to make HTTP requests
import axios from 'axios';

export default async function handler(req, res) {
  // Check that the HTTP method used is GET
  if (req.method !== 'GET') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  try {
    // Make the GraphQL query to fetch the parent accounts
    const response = await axios.post(
      'https://stackle.instructure.com/api/graphql',
      {
        query: `
          query MyQuery {
            first: account(id: "1") {
              name
              subAccountsConnection {
                edges {
                  node {
                    name
                    _id
                  }
                }
              }
            }
            second: account(id: "109") {
              name
              subAccountsConnection {
                edges {
                  node {
                    name
                    _id
                  }
                }
              }
            }
          }
        `,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.CANVAS_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the relevant data from the response
    const parentAccounts = [
      ...response.data.data.first.subAccountsConnection.edges.map(edge => ({
        id: edge.node._id,
        name: edge.node.name,
      })),
      ...response.data.data.second.subAccountsConnection.edges.map(edge => ({
        id: edge.node._id,
        name: edge.node.name,
      })),
    ];

    // Send the parent accounts as the response
    res.status(200).json(parentAccounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to fetch parent accounts' });
  }
}