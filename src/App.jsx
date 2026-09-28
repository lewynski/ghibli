import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Archive from './pages/Archive'
import RecipeDetail from './pages/RecipeDetail'
import MoodMatcher from './pages/MoodMatcher'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/archive/:slug" element={<RecipeDetail />} />
          <Route path="/mood" element={<MoodMatcher />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}
