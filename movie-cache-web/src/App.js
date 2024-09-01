// import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './SharedComponents/Navbar';
import HomePage from './Pages/Homepage';
import AboutPage from './Pages/About';
import ProfilePage from './Pages/ProfilePage';
// import Sidebar from './SharedComponents/Sidebar';
import Watchlist from './Pages/Watchlist';
import TrendingPage from './Pages/Trending';
import UsersPage from './Pages/Users';
import MoviePage from './Pages/MoviePage';
import NotFoundPage from './Pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <h1>It's Time to Rebuild my brothers</h1>
      <Navbar></Navbar>
      {/* <Sidebar></Sidebar> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/movie:/:movieId" element={<MoviePage />} />
        <Route path="/profile/:profileId" element={<ProfilePage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/userSearch" element={<UsersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
