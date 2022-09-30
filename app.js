const express = require("express");
const axios = require("axios");
const pokemon = require("pokemon");

const app = express();
const PORT = 3000;

// respond with "hello world" when a GET request is made to the homepage
app.get("/", (req, res) => {
  res.send("hello world");
});

const capitalize = (word) => {
  const to_lower = word.toLowerCase();
  return to_lower[0].toUpperCase() + to_lower.substring(1);
};

app.get("/query", (req, res) => {
  try {
    const pokemon_query_name = req.query.name;
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
      .catch((error) => res.send("Error al buscar el pokemon."));
  } catch (error) {
    res.send("Error al buscar el pokemon.");
  }
});

app.listen(PORT, () => console.log("Server listening"));
