// src/Box.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import './Box.css';

const Box = ({ name, icon, link }) => {
  // Predefined set of colors including shades of black and other colors
  const colors = [
    'rgb(0, 0, 0)', 'rgb(34, 34, 34)', 'rgb(68, 68, 68)', // Shades of black
    'rgb(0, 128, 128)', 'rgb(128, 0, 128)', 'rgb(128, 128, 0)', // Teal, Purple, Olive
    'rgb(255, 69, 0)', 'rgb(34, 139, 34)', 'rgb(70, 130, 180)', // OrangeRed, ForestGreen, SteelBlue
  ];

  // Randomly select a color
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // Determine if the link is external by checking if it starts with "http"
  const isExternalLink = link.startsWith('http');

  return (
    <a
      href={link}
      className="box"
      style={{ backgroundColor: randomColor }}
      target={isExternalLink ? "_blank" : "_self"}
      rel={isExternalLink ? "noopener noreferrer" : ""}
    >
      <FontAwesomeIcon icon={icon} size="3x" className="box-icon" />
      <h2 className="box-title">{name}</h2>
    </a>
  );
};

Box.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
};

export default Box;
