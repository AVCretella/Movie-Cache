import watchlist from '../test_data/test_watchlist'
import { Link } from 'react-router-dom'

const TrendingPage = () => {
    const trending = watchlist



    
    return (
        <>
        <h1> Trending </h1>
        {trending.map(movie => (
            <div>
                <Link to={`/movie/${movie.id}`}><h3>{movie.movieName}</h3></Link>
                <img src={movie.posterURL}></img>
                <p>{movie.Summary}</p>
            </div>
            ))
        }
        </>
    )
}

export default TrendingPage;