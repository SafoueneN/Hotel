import { PHOTO_CREDITS } from '../data/photoCredits';

export default function PhotoCreditsModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fermer">×</button>
        <h2>Crédits photos</h2>
        <p className="muted">Photographies sous licence Creative Commons, via Wikimedia Commons / Flickr.</p>
        <ul className="credits-list">
          {PHOTO_CREDITS.map((c) => (
            <li key={c.url}>
              <a href={c.url} target="_blank" rel="noreferrer">{c.title}</a>
              <span className="muted"> — {c.creator} · {c.license}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
