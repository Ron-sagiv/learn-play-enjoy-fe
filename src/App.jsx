import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { Route, Routes } from 'react-router';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Welcome from './pages/Welcome';
import SongsPage from './pages/SongsPage';
import ProtectedLayout from './layouts/ProtectedLayout';

const App = () => {
    return (
        <div>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/songs" element={<SongsPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default App;