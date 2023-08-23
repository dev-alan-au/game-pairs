import { useCallback, useEffect, useMemo, useState } from 'react';
import Card from './Card';
import './App.css';

type Color = 'red' | 'black';

interface Card {
  color: Color;
  value: string;
}

export interface GameCard extends Card {
  isVisible: boolean;
  isMatched: boolean;
  index: number;
}

const symbols = ['A', 'K', 'Q', 'J'];

const shuffleBaseCards = (cards: Array<Card>) => {
  const mixedSet: Array<Card> = [];

  do {
    const randomIndex = Math.floor(Math.random() * cards.length);
    mixedSet.push(...cards.splice(randomIndex, 1));
  } while (cards.length)

  return mixedSet;
}

const getBaseCards = () => {
  const set = [...symbols, ...symbols];
  const redSet: Array<Card> = set.map(symbol => ({ color: 'red', value: symbol } as Card));
  const blackSet: Array<Card> = set.map(symbol => ({ color: 'black', value: symbol } as Card));
  const combinedSet = [...redSet, ...blackSet];
  return shuffleBaseCards(combinedSet);
}

const initCards: () => Array<GameCard> = () => getBaseCards().map((baseCard, index) => ({ ...baseCard, isVisible: false, isMatched: false, isActive: false, index }));

function App() {
  const [cards, setCards] = useState(initCards());
  const [activeCardIndices, setActiveCardIndices] = useState<Array<number>>([]);
  const [incorrectAttempts, setIncorrectAttempts] = useState<number>(0);
  const unmatchedCardsRemaining = useMemo(() => cards.filter(card => !card.isMatched).length, [cards]);
  const [isCheatMode, setIsCheatMode] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);

  const handleClick = useCallback((selectedCardIndex: number) => {
    if (activeCardIndices.length <= 1 && !~activeCardIndices.indexOf(selectedCardIndex)) {
      setActiveCardIndices(activeCardIndices => [...activeCardIndices, selectedCardIndex]);
    };
  }, [activeCardIndices]);

  useEffect(() => {
    setCards(cards => cards.map((card) => ({ ...card, isVisible: ~activeCardIndices.indexOf(card.index) ? true : card.isMatched })));
  }, [activeCardIndices]);

  useEffect(() => {
    let timeout;
    if (activeCardIndices.length == 2) {
      const card1 = cards.find(card => card.index == activeCardIndices[0]);
      const card2 = cards.find(card => card.index == activeCardIndices[1]);
      if (card1 && card2 && card1.color == card2.color && card1.value == card2.value) {
        // match
        setCards(cards => cards.map(card => {
          if (~activeCardIndices.indexOf(card.index)) {
            return { ...card, isMatched: true, isVisible: true }
          }
          return card;
        }));
        setActiveCardIndices([]);
      } else {
        setIncorrectAttempts(attempts => attempts + 1);
        timeout = setTimeout(() => {
          setActiveCardIndices([]);
        }, 1000);
      }
    }

    return void timeout && clearInterval(timeout);
  }, [activeCardIndices.length == 2]);

  useEffect(() => {
    setHasWon(unmatchedCardsRemaining == 0);
  }, [unmatchedCardsRemaining != 0]);

  const reset = () => {
    setCards(initCards);
    setActiveCardIndices([]);
    setIncorrectAttempts(0);
    setHasWon(false);
  }

  return (
    <>
      <header>
        <h1 style={{ fontSize: '2rem' }}>Incorrect Attempts: {incorrectAttempts}</h1>
        <p>Use cheatmode: <input type="checkbox" checked={isCheatMode} onChange={(ev) => setIsCheatMode(ev.target.checked)} /> <button onClick={() => reset()}>Reset</button></p>
      </header>
      {!hasWon ? <div style={{ maxWidth: '1200px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', width: '70vw', height: '70vh', gap: '1rem' }}>
        {cards.map((card, i) => <Card key={i} card={card} onClick={() => handleClick(card.index)} isCheatMode={isCheatMode} />)}
      </div> : <div>
        <p>Congrats! You win 🎉🎉🎉</p>
        <button onClick={() => reset()}>Go again! </button>
      </div>
      }
    </>
  )
}

export default App
