import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import CartPage from './Pages/CartPage';
import CatalogPage from './Pages/CatalogPage';
import ProfilePage from './Pages/ProfilePage';
import IndexPage from './Pages/IndexPage';
import ProductPage from './Pages/ProductPage';
import Header from './Components/Header/Header';
import AppContainer from './Components/AppContainer/AppContainer';
import { getUser } from './store/actions/authActions';

const App = () => {
	const dispatch = useDispatch();

	useEffect(() => dispatch(getUser()));

	return (
		<AppContainer>
			<Header />
			<Switch>
				<Route exact path="/">
					<IndexPage />
				</Route>
				<Route path="/cart">
					<CartPage />
				</Route>
				<Route path="/catalog">
					<CatalogPage />
				</Route>
				<Route path="/profile">
					<ProfilePage />
				</Route>
				<Route
					path="/products/:itemNo"
					render={({ match }) => {
						return (
							match && <ProductPage productNoParam={match.params.itemNo} />
						);
					}}
				/>
			</Switch>
		</AppContainer>
	);
};

export default App;
