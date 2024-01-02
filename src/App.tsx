import React from 'react';
import ContainerDefault from "./containers/default/ContainerDefault.tsx";
import { Route, Routes } from 'react-router-dom';
import CategoriesListPage from './components/categories/list/CategoriesListPage.tsx';
import NoMatch from './components/pages/Nomatch.tsx';
import CategoryCreatePage from './components/categories/create/CategoryCreatePage.tsx';
import CategoriesEditPage from './components/categories/edit/CategoriesEditPage.tsx';

const App: React.FC = () => {
    return (
      <Routes>
        <Route path='/' element={<ContainerDefault/>}>
          <Route index element={<CategoriesListPage/>} />
          <Route path='create' element={<CategoryCreatePage/>} />
          <Route path='edit/:id' element={<CategoriesEditPage/>} />
          <Route path='*' element={<NoMatch/>} />
        </Route>
      </Routes>
    );
};

export default App;