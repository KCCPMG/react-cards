import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Card from './Card';
import './CardWrapper.css';

function AutoCardsWrapper() {
  const [deckId, setDeckId] = useState(null);
  const [currentCard, setCurrentCard] = useState({});
  const [nextCard, setNextCard] = useState({})
  const [done, setDone] = useState(false);
  // const [remainingDeck, setRemainingDeck] = useState([])


  function drawCard() {
    setCurrentCard(nextCard);
    setNextCard({});
    axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw`)
    .then(res => {
      if (res.data.success) {
        if (res.data.cards[0]) {
          setNextCard({
            ...res.data.cards[0]
          })
        } else {
          setNextCard({});
        }
      } else {
        setDone(true);
      }
    })
  }

  // after component load
  useEffect(function() {
    // load deck
    const loadDeck = async () => {
      const deckRes = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      if (deckRes.data.success) {
        setDeckId(deckRes.data.deck_id);
        const cardRes = await axios.get(`https://deckofcardsapi.com/api/deck/${deckRes.data.deck_id}/draw`);
        if (cardRes.data.success) {
          setNextCard({
            ...cardRes.data.cards[0]
          })
        }
      }
    }
    loadDeck();
  }, [])

  function drawCardButton() {
    return (
      <button onClick={drawCard}>Draw a Card</button>
    )
  }

  return(
    <div className="CardsWrapper">
      <div className="CardWrapper-button-div">
        {(Object.entries(nextCard).length > 0) ? drawCardButton() : undefined }
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
