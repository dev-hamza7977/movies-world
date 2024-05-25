import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import axios from 'axios';
import { setSelectionRange } from "@testing-library/user-event/dist/utils";

const MovieApp = () => {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, SetSortBy] = useState('popularity.desc');
    const [genres, SetGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [expandedMovieId, setExpandedMovieId] = useState('null');


    useEffect(() => {
        const fetchGenres = async () => {
            const response = await axios.get(
                'https://api.themoviedb.org/3/genre/movie/list',
                {
                    params: {
                        api_key: 'b08e40bfc2f5ff3d6eefd93b7c4efcae',

                    }
                }
            );
            SetGenres(response.data.genres);
            // console.log(response.data.genres)
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            // const response = async () => {
            const response = await axios.get(
                'https://api.themoviedb.org/3/discover/movie',
                {
                    params: {
                        api_key: 'b08e40bfc2f5ff3d6eefd93b7c4efcae',
                        sort_by: sortBy,
                        page: 1,
                        with_genres: selectedGenre,
                        query: searchQuery,

                    }
                },
            );
            setMovies(response.data.results)
            // };
        }
        fetchMovies();

    }, [searchQuery, sortBy, selectedGenre])

    const handleSortChange = (event) => {
        SetSortBy(event.target.value);
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    }

    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
    }

    const toggleDescription = (movieId) => {
        setExpandedMovieId(expandedMovieId === movieId ? null : movieId)
    }

    const handleSearchSubmit = async () => {
        const response = await axios.get(
            'https://api.themoviedb.org/3/search/movie',
            {
                params: {
                    api_key: 'b08e40bfc2f5ff3d6eefd93b7c4efcae',
                    query: searchQuery,
                }
            }
        );
        setMovies(response.data.results)
        // console.log(response.data.results)
    }
    return (
        <div>
            <h1>MovieWorld </h1>
            <div className="search-bar">
                <input type="text" placeholder="Search Movies..." value={searchQuery} onChange={handleSearchChange} className="search-input" ></input>
                <button onClick={handleSearchSubmit} className="search-button">
                    <AiOutlineSearch></AiOutlineSearch>
                </button>
            </div>
            <div className="filters">
                <label htmlFor="sort-by">Sort By</label>
                <select id="sort-by" value={sortBy} onChange={handleSortChange}>
                    <option value="popularty.desc">Popularity Descending</option>
                    <option value="popularty.asc">Popularity Ascending</option>
                    <option value="vote_average.asc">Rating Descending</option>
                    <option value="vote_average.asc">Rating Ascending</option>
                    <option value="realease_date.desc">Realease Date Descending</option>
                    <option value="realease_date.asc">Realease Date Ascending</option>
                </select>
                <label htmlFor="genre">Genre:</label>
                <select id="genre" value={selectedGenre} onChange={handleGenreChange}>
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}</option>
                    ))}
                </select>
            </div>
            <div className="movie-wrapped">
                {movies.map((movie) => (
                    <div key={movie.id} className="movie">
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                        <h2>{movie.title}</h2>
                        <p className="rating" > Rating: {movie.vote_average}</p>
                        {expandedMovieId === movie.id ? (
                            <p>{movie.overview}</p>) : (
                            <p>{movie.overview.substring(0, 150)}...</p>
                        )}
                        <button onClick={() => toggleDescription(movie.id)} className="read-more"> {expandedMovieId === movie.id ? 'show Less' : 'Read More'} </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MovieApp 