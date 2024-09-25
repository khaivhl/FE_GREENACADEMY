// src/components/Input.js
import React from "react";
import PropTypes from "prop-types";

const Input = ({ type, name, value, onChange, placeholder, disabled }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="form-control"
      disabled={disabled}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

Input.defaultProps = {
  type: "text",
  placeholder: "",
};

export default Input;
