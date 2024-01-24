import React from 'react';
import ContainerDefault from "./containers/default/ContainerDefault.tsx";
import { Route, Routes } from 'react-router-dom';
import CategoriesListPage from './components/categories/list/CategoriesListPage.tsx';
import NoMatch from './components/pages/Nomatch.tsx';
import CategoryCreatePage from './components/categories/create/CategoryCreatePage.tsx';
import CategoriesEditPage from './components/categories/edit/CategoriesEditPage.tsx';
import RegisterPage from './components/auth/register/RegisterPage.tsx';
import LoginPage from './components/auth/login/LoginPage.tsx';
import ProductsListPage from './components/products/list/ProductsListPage.tsx';
import ProductCreatePage from './components/products/create/ProductCreatePage.tsx';
import ProductEditPage from './components/products/edit/ProductEditPage.tsx';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<ContainerDefault />}>
        <Route index element={<CategoriesListPage />} />
        <Route path='create' element={<CategoryCreatePage />} />
        <Route path='edit/:id' element={<CategoriesEditPage />} />

        <Route path='register' element={<RegisterPage />} />
        <Route path='login' element={<LoginPage />} />

        <Route path='products' element={<ProductsListPage />} />
        <Route path='products/create' element={<ProductCreatePage />} />
        <Route path='products/edit/:id' element={<ProductEditPage />} />

        <Route path='*' element={<NoMatch />} />
      </Route>
    </Routes>
  );
};

export default App;