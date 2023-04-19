import React from 'react';
import PropTypes from 'prop-types';
function Button (props) {
  return <button className='button' onClick={props.onClickFunction}>{props.text}</button>
}
export default Button;
Button.propTypes = {
  text: PropTypes.string,
  onClickFunction: PropTypes.func
};
