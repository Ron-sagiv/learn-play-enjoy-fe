import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { Route, Routes } from 'react-router';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Welcome from './pages/Welcome';
import SongsPage from './pages/SongsPage';
import ProtectedLayout from './layouts/ProtectedLayout';
import SingleSongPage from './pages/SingleSongPage';
import StemDetails from './pages/StemDetails';
import StemAnalyzerPage from './pages/StemAnalyzerPage';
import CreateStem from './pages/CreateStemPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/songs" element={<SongsPage />} />
            <Route path="/songs/:id" element={<SingleSongPage />} />
            <Route path="/stems" element={<StemAnalyzerPage />} />
            <Route path="/stems/:id" element={<StemDetails/>} />
            <Route path="/createstem" element={<CreateStem/>}/>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
