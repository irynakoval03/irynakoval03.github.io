// import 'react-devtools';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/login/login'
import Main from './pages/main/main'
import Signup from './pages/signup/signup'
import ModPage from './pages/mod_page/mod_page'
import MyPage from './pages/my_page/my_page'
import EditPage from './pages/edit_page.jsx/edit_page'
import EditReservation from './pages/edit_rsrv/edit_rsrv'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Signup />} />
        <Route exact path='/main' element={<Main />} />
        <Route exact path='/signup' element={<Signup />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/mod_page' element={<ModPage />} />
        <Route exact path='/my_page' element={<MyPage />} />
        <Route exact path='/edit_page' element={<EditPage />} />
        <Route exact path='/edit_rsrv' element={<EditReservation />} />
      </Routes>
    </Router>
  );
}

export default App;
