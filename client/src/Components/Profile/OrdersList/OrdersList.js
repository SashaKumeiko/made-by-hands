// import React, { useState, useEffect } from 'react';
import React, { useEffect } from 'react';
import {} from './styles';

const OrdersList = () => {
	// const [orders, setOrders] = useState([]);
	// const [isFetching, setFetching] = useState(false);
	useEffect(() => {}, []);
	return <></>;
};

export default OrdersList;

// order data model
// const order = {
// 	customerId: customerId || null,
// 	email: String,
// 	mobile: String,
// 	deliveryAddress:
// 		{
// 			country: 'Ukraine',
// 			city: 'Kyiv', // only Kyiv may be there
// 			address: 'Kreshchatic Street 56//A',
// 		} || null,
// 	postalDelivery:
// 		{
// 			city: String,
// 			postalOffice: String,
// 		} || null,
// 	status: 'Pending', // (Обрабатывается)
// 	letterSubject: String,
// 	letterHTML: String,

// 	// for non-authenticataed user
// 	firstName: String,
// 	lastName: String,
// 	products: [], // Array of products,must have the same structure,
// 	// as in cart, but the full data about product instead of only ObjectId.
// };
