import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "../hooks/useForm";
import { PokemonContext } from "./PokemonContext";

export const PokemonProvider = ({ children }) => {

    const [allPokemons, setAllPokemons] = useState([]);
    const [globalPokemons, setGlobalPokemons] = useState([]);
    const [offset, setOffset] = useState(0);

    //Utilizar CustomHook - useForm

    const {valueSearch, onInputChange, onResetForm} = useForm({
        valueSearch : ''
    })

    //Estados para aplicacion simples 
    const [loading, setLoading] = useState(true); //cargar la página
    const [active, setActive] = useState(false); //filtrado

    //Llamar 50 pokemones a la API
    const getAllPokemons = async(limit = 50) => {
        const baseURL = 'https://pokeapi.co/api/v2/';

        const res = await fetch(`${baseURL}pokemon?limit=${limit}&offset=${offset}`);
        const data = await res.json();
        
        const promises = data.results.map(async(pokemon) => {
            const res = await fetch(pokemon.url)
            const data = await res.json();
            return data
        })
        const results = await Promise.all(promises);
        setAllPokemons([
            ...allPokemons,
            ...results
        ]);
        setLoading(false);
    }

    
    //Llamar todos los pokemones
    
    const getGlobalPokemons = async() =>{
        const baseURL = 'https://pokeapi.co/api/v2/';
        
        const res = await fetch(`${baseURL}pokemon?limit=100000&offset=0`);
        const data = await res.json();
        
        const promises = data.results.map(async(pokemon) => {
            const res = await fetch(pokemon.url)
            const data = await res.json();
            return data
        })
        const results = await Promise.all(promises);
        setGlobalPokemons(results);
        setLoading(false);
    }

    //Llamar a un pokemon por ID

    const getPokemonsByID = async (id) => {
        const baseURL = 'https://pokeapi.co/api/v2/';

        const res = await fetch(`${baseURL}pokemon/${id}`);
        const data = await res.json();

        return data
    }
    
    useEffect(() => {
        getAllPokemons()
    }, [])
    
    useEffect(() => {
        getGlobalPokemons()
    }, [])
    
    return(
        <PokemonContext.Provider 
        value={{
           valueSearch,
           onInputChange,
           onResetForm,
           allPokemons,
           globalPokemons,
           getPokemonsByID
        }}>
            {children}
        </PokemonContext.Provider>
    )
}
