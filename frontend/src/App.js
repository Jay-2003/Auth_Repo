import './App.css'
import Content from './components/Content';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Signup from './components/Signup'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <Router>
    <Navbar />
    <Routes>
          <Route path='/' element={<Login />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/content" element={<Content />} />
    </Routes>
    {/* <Login /> */}
    </Router>
  );
}

export default App;













