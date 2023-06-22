import axios from "axios";

export default async function handler(req, res) {
  console.log("Fetching...");
  try {
    const response = await axios.get(
      "https://randomuser.me/api/?inc=name&nat=au,gb,nz&noinfo/"
    );

    const results = response.data.results; // Access the "results" array
    console.log(results);
    const firstName = results[0].name.first; // Access the first element of the "results" array
    const lastName = results[0].name.last; // Access the first element of the "results" array

    res.status(200).json({
      firstName,
      lastName,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Failed to generate student username and email" });
  }
}
