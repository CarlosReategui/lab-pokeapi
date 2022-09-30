const express = require("express");
const axios = require("axios");
const pokemon = require("pokemon");
const sgMail = require("@sendgrid/mail");

const app = express();
const PORT = 3000;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// respond with "hello world" when a GET request is made to the homepage
app.get("/", (req, res) => {
  res.send("hello world");
});

const sendMail = (pokemon) => {
  const msg = {
    to: "cbalbuena@utec.edu.pe",
    from: "maor.roizman2000@gmail.com", // Change to your verified sender
    subject: "Error 500",
    text: `Hubo un error al buscar el pokemon ${pokemon}`,
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(error);
    });
};

const capitalize = (word) => {
  const to_lower = word.toLowerCase();
  return to_lower[0].toUpperCase() + to_lower.substring(1);
};

app.get("/query", (req, res) => {
  const pokemon_query_name = req.query.name;
  try {
    const pokemon_id = pokemon.getId(capitalize(pokemon_query_name));
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemon_id}`)
      .then((pokemon_res) => {
        const types = pokemon_res.data.types;
        const abilities = pokemon_res.data.abilities;
        const filtered_types = [];
        const filtered_abilities = [];
        types.forEach((e) => {
          filtered_types.push(e.type.name);
        });
        abilities.forEach((e) => {
          filtered_abilities.push(e.ability.name);
        });
        res.send({
          types: filtered_types,
          abilities: filtered_abilities,
        });
      })
      .catch((error) => {
        sendMail(pokemon_query_name);
        res.statusCode = 500;
        res.send("Error al buscar el pokemon.");
      });
  } catch (error) {
    sendMail(pokemon_query_name);
    res.statusCode = 500;
    res.send("Error al buscar el pokemon.");
  }
});

app.listen(PORT, () => console.log("Server listening"));
