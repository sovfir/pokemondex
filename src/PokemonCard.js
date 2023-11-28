import './PokemonCard.css'
import React, { useContext } from "react";
import { ThemeContext } from "./App.js";

export default function PokemonCard({ pokemon, onDelete }) {
  const forms = JSON.stringify(pokemon.forms);
  const themeContextValue = useContext(ThemeContext); // Получаем значение темы

  const handleDelete = () => {
    onDelete(pokemon.id); // Передача уникального идентификатора для удаления
  };

  return (
    <div className={`maindiv ${themeContextValue.isLight ? "light-theme" : "dark-theme"}`}>
      <img src={pokemon?.sprites?.front_default} alt={pokemon.name}></img>
      <p>Name: {pokemon.name}</p>
      <ul>
        Forms ({pokemon.forms.length}):
        {pokemon.forms.map((form, index) => (
          <li key={index}>{form.name}</li>
        ))}
      </ul>
      <button onClick={handleDelete}>X</button>
    </div>
  );
}

