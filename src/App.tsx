import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import userService from './services/user';
import { BorrarUser, CreateUser, User } from './pages/User/user';
import { Login } from './pages/Login/login';
import { Home, CreateCategory, EditCategory, DeleteCategory } from './pages/Home/home';
import {
  BorrarPlatillo,
  CreatePlatillo,
  EditPlatillo,
  MostrarPlatillo,
  Platillo,
} from './pages/platillo/platillo';
import { Information } from './pages/Information/Information';

function App() {
  const [adminLoggedIn, setadminLoggedIn] = useState(false);

  const VerifyLoggedIn = async () => {
    const resultVerify = await userService.verify();
    resultVerify === true ? setadminLoggedIn(true) : setadminLoggedIn(false);
  };

  useEffect(() => {
    VerifyLoggedIn();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {!adminLoggedIn && (
          <>
            <Route path="/" element={<Login handleauth={() => setadminLoggedIn(true)} />} />
          </>
        )}
        {adminLoggedIn && (
          <>
            <Route
              path="/category"
              element={<Home handleauth={() => setadminLoggedIn(false)} />}
            />

            <Route
              path="/category/create"
              element={<CreateCategory handleauth={() => setadminLoggedIn(false)} />}
            />

            <Route
              path="/category/delete"
              element={<DeleteCategory handleauth={() => setadminLoggedIn(false)} />}
            />

            <Route
              path="/category/edit"
              element={<EditCategory handleauth={() => setadminLoggedIn(false)} />}
            />

            <Route
              path="/platillo"
              element={<Platillo handleauth={() => setadminLoggedIn(false)} />}
            />

            <Route
              path="/platillo/create"
              element={<CreatePlatillo handleauth={() => setadminLoggedIn(false)} />}
            />

            <Route
              path="platillo/edit"
              element={<EditPlatillo handleauth={() => setadminLoggedIn(false)} />}
            />

            <Route
              path="platillo/delete"
              element={<BorrarPlatillo handleauth={() => setadminLoggedIn(false)} />}
            />

            <Route
              path="platillo/show"
              element={<MostrarPlatillo handleauth={() => setadminLoggedIn(false)} />}
            />

            <Route
              path="/user"
              element={<User handleauth={() => setadminLoggedIn(false)} />}
            />

            <Route
              path="/user/create"
              element={<CreateUser handleauth={() => setadminLoggedIn(false)} />}
            />

            <Route
              path="/user/delete"
              element={<BorrarUser handleauth={() => setadminLoggedIn(false)} />}
            />

            <Route
              path="/information"
              element={<Information handleauth={() => setadminLoggedIn(false)} />}
            />
          </>
        )}

        <Route path="*" element={<Navigate to={adminLoggedIn ? '/category' : '/'} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
