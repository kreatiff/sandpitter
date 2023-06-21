export default async function handler(req, res) {
  try {
    const response = await fetch('https://www.dinopass.com/password/simple');
    const password = await response.text();

    res.status(200).json({ password });
  } catch (error) {
    console.error('Error generating password:', error);
    res.status(500).json({ error: 'Error generating password' });
  }
}
