import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import {
	handleUserLogin,
	handleGetUser,
	checkProductsForCartAndFavorites,
} from '../../utils/API';
// eslint-disable-next-line import/no-cycle
import { setCartAction, updateCart } from './cartActions';
import { setWishlist } from './wishActions';
import {
	USER_LOGIN_ERROR,
	USER_LOGIN_INIT,
	USER_LOGIN_SUCCESS,
	USER_LOGOUT,
	USER_UPDATE_INIT,
	USER_UPDATE_ERROR,
	USER_UPDATE_SUCCESS,
	PASSWORD_UPDATE_ERROR,
	PASSWORD_UPDATE_INIT,
	PASSWORD_UPDATE_SUCCESS,
} from '../types/authTypes';

const userUpdateInit = () => ({
	type: USER_UPDATE_INIT,
});

const userUpdateSuccess = user => ({
	type: USER_UPDATE_SUCCESS,
	payload: user,
});

const userUpdateError = err => ({
	type: USER_UPDATE_ERROR,
	payload: err,
});

const userLoginInit = () => ({
	type: USER_LOGIN_INIT,
});

export const userLoginSuccess = user => ({
	type: USER_LOGIN_SUCCESS,
	payload: user,
});

export const userLoginError = error => ({
	type: USER_LOGIN_ERROR,
	payload: error,
});

const updatePasswordInit = () => ({
	type: PASSWORD_UPDATE_INIT,
});

const updatePasswordSuccess = customer => ({
	type: PASSWORD_UPDATE_SUCCESS,
	payload: customer,
});

export const updatePasswordError = err => ({
	type: PASSWORD_UPDATE_ERROR,
	payload: err,
});

export const userLogout = () => dispatch => {
	setAuthToken();
	if (!localStorage.getItem('cart')) {
		localStorage.setItem('cart', '[]');
	}
	dispatch(setCartAction([]));
	localStorage.setItem('cart', '[]');
	dispatch({ type: USER_LOGOUT });
};

export const getUser = () => dispatch => {
	const token = localStorage.getItem('token');

	if (token) {
		setAuthToken(token);
		handleGetUser(token)
			.then(customer => {
				axios
					.get('/api/cart')
					.then(result => {
						if (!result.data) {
							axios.post('/api/cart');
						} else {
							dispatch(setCartAction(result.data.products));
						}
					})
					.catch(err => err);
				axios
					.get('/api/wishlist')
					.then(result => {
						if (!result.data) {
							axios.post('/api/wishlist');
						} else {
							checkProductsForCartAndFavorites(
								result.data.products
							).then(products => dispatch(setWishlist(products)));
						}
					})
					.catch(err => err);
				dispatch(userLoginSuccess(customer.data));
			})
			.catch(() => {
				if (!localStorage.getItem('cart')) {
					localStorage.setItem('cart', '[]');
				}
				dispatch(setCartAction(JSON.parse(localStorage.getItem('cart'))));
			});
	} else {
		if (!localStorage.getItem('cart')) {
			localStorage.setItem('cart', '[]');
		}
		dispatch(setCartAction(JSON.parse(localStorage.getItem('cart'))));
	}
};

export const userLogin = ({ loginOrEmail, password }) => dispatch => {
	dispatch(userLoginInit());
	handleUserLogin(loginOrEmail, password)
		.then(res => {
			const { token } = res.data;
			setAuthToken(token);
			handleGetUser()
				.then(customer => {
					axios.get('/api/cart').then(result => {
						if (!result.data) {
							axios.post('/api/cart');
						} else {
							dispatch(setCartAction(result.data.products));
						}
						dispatch(updateCart(result.data));
					});
					axios.get('/api/wishlist').then(result => {
						if (!result.data) {
							axios.post('/api/wishlist');
						} else {
							checkProductsForCartAndFavorites(
								result.data.products
							).then(products => dispatch(setWishlist(products)));
						}
					});

					dispatch(userLoginSuccess(customer.data));
				})
				.catch(err => {
					dispatch(userLoginError(err.response.data));
				});
		})
		.catch(err => {
			if (!localStorage.getItem('cart')) {
				localStorage.setItem('cart', '[]');
			}
			dispatch(setCartAction(JSON.parse(localStorage.getItem('cart'))));
			dispatch(userLoginError(err.response.data));
		});
};

export const userRegister = data => async dispatch => {
	dispatch(userLoginInit());
	axios
		.post('/api/customers', JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then(customer => {
			const { login, password } = data;
			handleUserLogin(login, password)
				.then(res => {
					setAuthToken(res.data.token);

					axios.get('/api/cart').then(result => {
						if (!result.data) {
							axios.post('/api/cart');
						} else {
							dispatch(setCartAction(result.data.products));
						}
					});
					axios.post('/api/wishlist');
					dispatch(userLoginSuccess(customer.data));
				})
				.catch(err => {
					dispatch(userLoginError(err.response.data));
				});
		})
		.catch(err => {
			if (!localStorage.getItem('cart')) {
				localStorage.setItem('cart', '[]');
			}
			dispatch(setCartAction(JSON.parse(localStorage.getItem('cart'))));
			dispatch(userLoginError(err.response.data));
		});
};

export const updateUser = data => dispatch => {
	dispatch(userUpdateInit());
	axios
		.put('/api/customers', JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then(customer => dispatch(userUpdateSuccess(customer.data)))
		.catch(err => dispatch(userUpdateError(err.response.data)));
};

export const updatePassword = passwords => dispatch => {
	dispatch(updatePasswordInit());
	axios
		.put('/api/customers/password', passwords)
		.then(res => {
			if (Object.keys(res.data).length > 1) {
				dispatch(updatePasswordSuccess(res.data.customer));
			} else {
				dispatch(updatePasswordError(res.data));
			}
		})
		.catch(err => dispatch(userUpdateError(err)));
};
