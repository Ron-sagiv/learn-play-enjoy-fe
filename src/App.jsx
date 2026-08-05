import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedLayout from "./layouts/ProtectedLayout";

const App = () => {
    return <div className='text-2xl'>
        <Routes>
			<Route element={<MainLayout />}>
				<Route path="/" element={<Home />} />
				<Route path="/signup" element={<SignUpPage/>} />
				<Route path="/login" element={<LoginPage/>} />
                
			</Route>						
			<Route path="*" element={<NotFound />} />
		</Routes>
    
    
    </div>;
};

export default App;