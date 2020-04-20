import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import { handleUserLogin, handleGetUser } from '../../utils/API';

export const USER_LOGIN_INIT = 'USER_LOGIN_INIT';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_LOGIN_ERROR = 'USER_LOGIN_ERROR';

const userLoginInit = () => ({
	type: USER_LOGIN_INIT,
});

const userLoginSuccess = user => ({
	type: USER_LOGIN_SUCCESS,
	payload: user,
});

const userLoginError = error => ({
	type: USER_LOGIN_ERROR,
	payload: error,
});

export const userLogout = () => dispatch => {
	setAuthToken();
	dispatch({ type: USER_LOGOUT });
};

export const userLogin = ({ loginOrEmail, password }) => dispatch => {
	dispatch(userLoginInit());
	handleUserLogin(loginOrEmail, password)
		.then(res => {
			const { token } = res.data;
			setAuthToken(token);
			handleGetUser(token)
				.then(customer => {
					dispatch(userLoginSuccess(customer.data));
				})
				.catch(err => {
					dispatch(userLoginError(err));
				});
		})
		.catch(err => {
			dispatch(userLoginError(err));
		});
};

export const userRegister = data => async dispatch => {
	dispatch(userLoginInit());
	axios
		.post('/customers', JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then(customer => {
			const { login, password } = data;
			handleUserLogin(login, password)
				.then(res => {
					setAuthToken(res.data.token);
					dispatch(userLoginSuccess(customer.data));
				})
				.catch(err => {
					dispatch(userLoginError(err));
				});
		})
		.catch(err => {
			dispatch(userLoginError(err));
		});
};
