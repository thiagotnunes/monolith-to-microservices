/*
Copyright 2019 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;

// Configures the Cloud Spanner client
const {Spanner} = require('@google-cloud/spanner');
const spanner = new Spanner({projectId: 'span-cloud-testing'});
const instance = spanner.instance('thiagotnunes-test-instance');
const database = instance.database('gke');

//Serve website
app.use(express.static(path.join(__dirname, "..", "public")));

//Get all products
app.get("/service/products", async (req, res) => {
  const [rows] = await database.run("SELECT * FROM products");
  res.send(rows);
});

//Get products by ID
app.get("/service/products/:id", async (req, res) => {
  const id = req.params.id;
  const query = {
    sql: "SELECT * FROM products WHERE id = @id",
    params: { id: id }
  };
  const rows = await database.run(query);
  res.send(rows);
});

//Get all orders
app.get("/service/orders", async (req, res) => {
  const [rows] = await database.run("SELECT * FROM orders");
  res.send(rows);
});

//Get orders by ID
app.get("/service/orders/:id", async (req, res) => {
  const id = req.params.id;
  const query = {
    sql: "SELECT * FROM orders WHERE id = @id",
    params: { id: id }
  };
  const [rows] = await database.run(query);
  res.send(rows[0]);
});

//Client side routing fix on page refresh or direct browsing to non-root directory
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

//Start the server
app.listen(port, () => console.log(`Monolith listening on port ${port}!`));
