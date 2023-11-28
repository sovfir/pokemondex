import React, { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import PokemonCard from "./PokemonCard.js";
import logo from "./logo.png";
import "./App.css";

export const ThemeContext = createContext();

function App() {
  const [formData, setFormData] = useState("");
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [isLight, setIsLight] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.trim()) {
      alert("Please enter a Pokemon name");
      return;
    }
    console.log("Form submitted", formData);
    fetchData();
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${formData.toLowerCase()}`
      );
      const isPokemonAlreadyAdded = pokemonList.some(
        (pokemon) => pokemon.id === response.data.id
      );
  
      if (isPokemonAlreadyAdded) {
        alert("This Pokemon is already in the list!");
        return;
      }
  
      // Обновление состояния
      setPokemonData(response.data);
      setPokemonList((prevList) => [response.data, ...prevList]);
  
      // Обновление localStorage
      localStorage.setItem(
        "pokemonList",
        JSON.stringify([response.data, ...pokemonList])
      );
    } catch (error) {
      console.log(error.message);
      alert(`No such Pokemon!`);
    }
  };

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const storedPokemonList = localStorage.getItem("pokemonList");

        if (storedPokemonList) {
          // Если в localStorage уже есть список, используйте его
          setPokemonList(JSON.parse(storedPokemonList));
        } else {
          // Если в localStorage нет списка, запросите данные с сервера
          const response = await axios.get(
            "https://pokeapi.co/api/v2/pokemon?limit=20"
          );
          const results = response.data.results;

          // Получите детальную информацию о каждом покемоне
          const detailedPokemonList = await Promise.all(
            results.map(async (pokemon) => {
              const detailedResponse = await axios.get(pokemon.url);
              return detailedResponse.data;
            })
          );

          // Обновите состояние и сохраните в localStorage
          setPokemonList(detailedPokemonList);
          localStorage.setItem(
            "pokemonList",
            JSON.stringify(detailedPokemonList)
          );
        }
      } catch (error) {
        console.error("Error fetching Pokemon data:", error.message);
      }
    };

    fetchPokemonData();
  }, []);

  useEffect(() => {
    if (pokemonData) {
      setPokemonList((prevList) => {
        const updatedList = prevList.map((item, index) =>
          index === 0 ? pokemonData : item
        );
        return updatedList;
      });
    }
  }, [pokemonData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(value);
  };

  const handleDelete = (id) => {
    setPokemonList((prevList) =>
      prevList.filter((pokemon) => pokemon.id !== id)
    );
  
    // Обновление localStorage
    localStorage.setItem(
      "pokemonList",
      JSON.stringify(pokemonList.filter((pokemon) => pokemon.id !== id))
    );
  };
  //управление переключением темы
  const themeContextValue = {
    isLight,
    themeChange: () => setIsLight((prevIsLight) => !prevIsLight),
  };
  const themeClass = isLight ? "light-theme" : "dark-theme";
  const changeBodyColor = () => {
    document.body.style.color = isLight ? "#353b45" : "#282c34";
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <>
        <div className={`App ${themeClass}`}>
          <div className="navbar">
            <button
              className="themeButton"
              onClick={() => {
                themeContextValue.themeChange();
                changeBodyColor();
              }}
            >
              Theme change
            </button>
          </div>
          <div className="appHeader">
            <img src={logo} alt="Logo"></img>
            <form onSubmit={handleSubmit}>
              <label>
                Search: <input name="search" onChange={handleChange}></input>
              </label>
              <button type="submit">Catch!</button>
            </form>
          </div>
          <div className="cardsdiv">
            {pokemonList.map((pokemon, index) => (
              <PokemonCard
                key={index}
                pokemon={pokemon}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </>
    </ThemeContext.Provider>
  );
}

export default App;
