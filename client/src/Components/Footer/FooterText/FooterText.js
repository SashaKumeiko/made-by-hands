import React from 'react';
import { FooterTextDiv } from './style';
import PropTypes from 'prop-types';

export const FooterText = ({ type, text, href }) => {
	return (
		<FooterTextDiv href={href} type={type}>
			{text}
		</FooterTextDiv>
	);
};
FooterText.propTypes = {
	type: PropTypes.oneOf(['title', 'link', 'copy']),
	text: PropTypes.string.isRequired,
	href: PropTypes.string,
};
FooterText.defaultProps = {
	type: 'title',
	href: '',
};
