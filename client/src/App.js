import TextEdtior from "./TextEdtior";
import {
  BrowserRouter as Router, 
  Routes,
  Route,
  Navigate,
  Link
} from 'react-router-dom'
import Home from './Home'

function App() {
  return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/documents/:id" element={<TextEdtior/>}>
          </Route>
          </Routes>
      </Router>
  )
}

export default App;