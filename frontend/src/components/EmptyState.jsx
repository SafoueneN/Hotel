export default function EmptyState({ icon, title, children }) {
  return (
    <div className="empty-state">
      {icon}
      <strong>{title}</strong>
      {children && <p className="muted">{children}</p>}
    </div>
  );
}
