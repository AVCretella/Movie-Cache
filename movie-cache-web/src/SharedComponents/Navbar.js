import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/trending">Trending</Link></li>
                <li><Link to="/userSearch">Users</Link></li>
                <li><Link to="/watchlist">Watchlist</Link></li>
                <li><Link to="/favorites">Favorites</Link></li>
                <li><Link to="/yourLists">Your Lists</Link></li>
                <li><Link to="/profile/1">your profile</Link></li>
                <li><Link to="/profile/2">profile 2</Link></li>
                <li><Link to="/profile/3">profile 3</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar;