import {
	USER_LOGIN_ERROR,
	USER_LOGIN_INIT,
	USER_LOGIN_SUCCESS,
	USER_LOGOUT,
	USER_UPDATE_INIT,
	USER_UPDATE_ERROR,
	USER_UPDATE_SUCCESS,
} from '../types/authTypes';

const initialState = {
	currentUser: null,
	isLoading: false,
	error: null,
};

export const authReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case USER_LOGIN_INIT:
			return { ...state, isLoading: true };
		case USER_LOGIN_SUCCESS:
			return { ...state, currentUser: payload, error: null, isLoading: false };
		case USER_LOGIN_ERROR:
			return { ...state, error: payload, isLoading: false };
		case USER_UPDATE_INIT:
			return { ...state, isLoading: true };
		case USER_UPDATE_SUCCESS:
			return { ...state, currentUser: payload, error: null, isLoading: false };
		case USER_UPDATE_ERROR:
			return { ...state, error: payload, isLoading: false };
		case USER_LOGOUT:
			return { ...state, currentUser: null };
		default:
			return state;
	}
};
