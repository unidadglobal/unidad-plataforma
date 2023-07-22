import React from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from 'react-router-dom'
import "./card.css";
import { LazyLoadImage } from 'react-lazy-load-image-component'

function Card({ imageSource, title, idNoticia }) {
  const navigate = useNavigate()
  const { id } = useParams()

  const handleClick = () => {
    navigate(`/noticias/${id}/nota/${idNoticia}`)
  }

  return (
    <div className="card animate__animated animate__fadeInUp" onClick={handleClick}>
      <div className="overflow">
        <LazyLoadImage src={imageSource} width={"100%"} className="card-noticia-img-top" effect='blur'/>
      </div>
      <div className="card-body text-light">
      
        <p className="card-text text-light font-weight-bold" >
        {title ?? ""}
        </p>
        
        
      </div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  imageSource: PropTypes.string
};

export default Card;
/*

<a
          href={url ? url : "#!"}
          target="_blank"
          className="btn btn-outline-secondary border-0"
          rel="noreferrer"
        >
          
        </a>

*/