import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Card from './Card';
import './CardWrapper.css';

function AutoCardsWrapper() {
  const [deckId, setDeckId] = useState(null);
  const [currentCard, setCurrentCard] = useState({});
  const [done, setDone] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [remainingDeck, setRemainingDeck] = useState([])
  const [drawTimer, setDrawTimer] = useState(null);

  // after component load, draw entire deck
  useEffect(function() {
    // load deck
    const loadDeck = async () => {
      const deckRes = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      if (deckRes.data.success) {
        setDeckId(deckRes.data.deck_id);
        const cardRes = await axios.get(`https://deckofcardsapi.com/api/deck/${deckRes.data.deck_id}/draw/?count=52`);
        if (cardRes.data.success) {
          setRemainingDeck(cardRes.data.cards)
        }
      }
    }
    loadDeck();
  }, [])


  useEffect(function(){
    if (drawing) {
      // let now = new Date(); // for testing timing
      setDrawTimer(setInterval(function(){
        // let then = now; // for testing timing
        // now = new Date(); // for testing timing
        // console.log(now, then, now-then); // for testing timing
        setRemainingDeck(() => {
          if (remainingDeck.length === 0) {
            setDrawing(false);
            setDone(true);
            return [];
          } else {
            setCurrentCard(remainingDeck.pop());
            return remainingDeck;
          }
        });
      }, 1000))
    } else {
      clearInterval(drawTimer);
    }
  }, [drawing, done])



  function drawCardButton() {
    if (remainingDeck.length > 0) {
      if (drawing) {
        return (
          <button onClick={() => { setDrawing(false) }}>Stop Drawing</button>
        ) 
      } else {
        return (
          <button onClick={() => { setDrawing(true) }}>Draw Cards</button>
        )
      }
    } else return undefined;
    
  }

  return(
    <div className="CardsWrapper">
      <div className="CardWrapper-button-div">
        { drawCardButton() }
      </div>
      {(Object.entries(currentCard).length > 0)
        ? <Card image={currentCard.image} value={currentCard.value} suit={currentCard.suit} code={currentCard.code} /> 
        : undefined
      }
      <div className="CardWrapper-finished-div">{done ? <h1>Deck Finished</h1> : undefined}</div>
    </div>
  )
}

export default AutoCardsWrapper;
