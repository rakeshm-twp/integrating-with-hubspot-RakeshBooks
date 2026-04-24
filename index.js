const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("dotenv").config();
process.env.PRIVATE_APP_ACCESS;


app.get("/", async (req, res) => {
  const url = "https://api.hubapi.com/crm/v3/objects/games";

  const headers = {
    Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    const resp = await axios.get(url, {
      headers,
      params: {
        properties: "name,publisher,price",
      },
    });
    console.log("reps", resp);
    const data = resp.data.results;
    console.log("data", data);

    res.render("homepage", {
      title: "Custom Object Table",
      data,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send("Error fetching data");
  }
});

app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Practicum",
  });
});

app.post("/update-cobj", async (req, res) => {
  const url = "https://api.hubapi.com/crm/v3/objects/games";

  const headers = {
    Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  const newObject = {
    properties: {
      name: req.body.name,
      publisher: req.body.publisher,
      price: req.body.price,
    },
  };

  try {
    await axios.post(url, newObject, { headers });
    res.redirect("/");
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send("Error creating record");
  }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));