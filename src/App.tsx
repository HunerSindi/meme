// App.tsx
import './App.css';
import NavBar from './navbar';
import { LangProvider } from './langContext';
import MainBody from './MainBody';
import CategoryList from './catogryList';
import Login from './login';

import{BrowserRouter,Routes ,Route} from 'react-router-dom';


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={
          <LangProvider>
            <NavBar />
            <MainBody/>
            <p className='the-app-bar-padd'></p>
            <CategoryList/>
          </LangProvider>
        }></Route>
          <Route path='/home' element={
          <LangProvider>
            <NavBar />
            <MainBody/>
            <br></br>
            <CategoryList/>
          </LangProvider>
        }></Route>
          <Route path='/login' element={
          <LangProvider>
            <Login></Login>
          </LangProvider>
        }></Route>
      </Routes>
    
    </BrowserRouter>
    

  );
}

export default App;


