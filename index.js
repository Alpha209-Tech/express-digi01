
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const app = express();

const port = Number(process.env.PORT ?? 3000);
app.use(express.json());

let teaData = []

let nextId = 1;

//add a new tea
app.post("/teas", (req, res) => {
    const { name, price } = req.body;
    const newTea = { id: nextId++, name, price };
    teaData.push(newTea);
    res.status(201).send(newTea);
});

//get all tea
app.get("/teas", (req, res) => {
    res.status(200).send(teaData);
});

//get a tea by id
app.get("/teas/:id", (req, res) => {
    const tea = teaData.find(t => t.id === parseInt(req.params.id));
    if (!tea) {
        res.status(404).send({ error: "Tea not found" });
    } else {
        res.status(200).send(tea);
    }
});

//update a tea by id
app.put("/teas/:id", (req, res) => {
    const tea = teaData.find(t => t.id === parseInt(req.params.id));
    if (!tea) {
        return res.status(404).send({ error: "Tea not found" });
    }

    const { name, price } = req.body;
    tea.name = name;
    tea.price = price;
    return res.status(200).send(tea);
});

//delete a tea
app.delete("/teas/:id", (req, res) => {
    const teaIndex = teaData.findIndex(t => t.id === parseInt(req.params.id));
    if (teaIndex === -1) {
        return res.status(404).send ({ error: "Tea not found" });
    }

    const [deletedTea] = teaData.splice(teaIndex, 1);
    return res.status(200).send({ message: "Tea deleted", tea: deletedTea });
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
