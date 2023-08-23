import { GameCard } from './App';

interface CardProps {
  card: GameCard,
  onClick: () => void,
  isCheatMode: boolean,
}

export default function Card({ card, onClick, isCheatMode }: CardProps) {

  return (
    <div onClick={(event) => { event.preventDefault(); onClick() }} style={{ position: 'relative', display: 'flex', transform: card.isVisible ? 'rotateY(0)' : 'rotateY(180deg)', transformStyle: 'preserve-3d', transition: 'transform 0.6s' }}>
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', color: card.color, fontSize: '3rem', }}>{card.value}</div>
      <div style={{ position: 'absolute', inset: 0, background: 'grey', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>{isCheatMode && (card.color + ' ' + card.value)}</div> {/* back */}
    </ div>
  )
}