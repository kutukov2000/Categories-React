import React from 'react';
import ContainerDefault from "./containers/default/ContainerDefault.tsx";
import { Route, Routes } from 'react-router-dom';
import CategoriesListPage from './components/categories/list/CategoriesListPage.tsx';
import NoMatch from './components/pages/Nomatch.tsx';

const App: React.FC = () => {
    return (
      <Routes>
        <Route path='/' element={<ContainerDefault/>}>
          <Route index element={<CategoriesListPage/>} />
          <Route path='*' element={<NoMatch/>} />
        </Route>
      </Routes>
    );
};

export default App;