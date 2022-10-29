import React from 'react';

function Card({image, suit, value, code}){

  return (
    <img id={code} className="Card" src={image} alt={value + " of " + suit}>

    </img>
  )

}

export default Card;