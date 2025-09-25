export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json([{ id: 1, name: "Shubham" }]);
  } else if (req.method === "POST") {
    const user = req.body;
    res.status(201).json({ message: "User created", user });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
