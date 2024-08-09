import watchlist from '../test_data/test_watchlist'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useUser from '../hooks/useUser'

const TrendingPage = () => {
    const { user, isLoading } = useUser();

    // useEffect(() => {
    //     setMovieInfo
    // })
    const trending = watchlist




    return (
        <>
        <h1> Trending </h1>
        {user //Only if the user is signed in will we show the trending page
            ? trending.map(movie => (
                <div>
                    <Link to={`/movie/${movie.id}`}><h3>{movie.movieName}</h3></Link>
                    <img src={movie.posterURL} alt={`Poster for ${movie.movieName}`}></img>
                    <p>{movie.Summary}</p>
                </div>
                ))
            
            : <h1>you need to log in</h1>
        }
        
        </>
    )
}

export default TrendingPage;