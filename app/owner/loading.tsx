export default function OwnerLoading() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F4F6FB',
      }}
    >
      <span
        aria-label="Cargando"
        style={{
          width: 34,
          height: 34,
          borderRadius: '999px',
          border: '3px solid #E2E8F0',
          borderTopColor: '#2563EB',
          display: 'inline-block',
          animation: 'ownerspin .7s linear infinite',
        }}
      />
      <style>{`@keyframes ownerspin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
