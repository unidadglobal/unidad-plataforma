import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom'
import "./card.scss";
import { LazyLoadImage } from 'react-lazy-load-image-component'

function Card({ imageSource, title, categoria, tipo, redireccion }) {
  const navigate = useNavigate()
  const handleClick = () => {
    if (tipo === 0){
      navigate(`/noticias/${categoria}`)
    }
    else if (tipo === 1){
      navigate(`/watch/cat-${categoria}`)
    }
    else if (tipo === 2){
      window.open(redireccion, "_blank")
    }
  }

  return (
    
    <div className="card text-center animate__animated animate__fadeInUp bg-dark" onClick={handleClick}>
      <div className="overflow">
        <LazyLoadImage src={imageSource} width={"100%"} className="card-img-top" effect='blur'/>
      </div>
      <div className="card-body text-light bg-dark">
        <span className="card-title">{title}</span>
      </div>
    </div>
    
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  imageSource: PropTypes.string
};

export default Card;