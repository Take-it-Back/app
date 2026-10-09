export default function PageSkeleton({ title = true, tiles = 2, rows = 4 }: { title?: boolean; tiles?: number; rows?: number }) {
  return (
    <main className="app-main" aria-busy="true" aria-label="Loading">
      {title && <div className="skel" style={{ height: 40, width: 180, marginBottom: 20 }} />}
      {tiles > 0 && (
        <div className="grid-tiles" style={{ marginBottom: 20 }}>
          {Array.from({ length: tiles }).map((_, i) => <div key={i} className="skel" style={{ height: 104, borderRadius: 22 }} />)}
        </div>
      )}
      <div className="stack g12">
        {Array.from({ length: rows }).map((_, i) => <div key={i} className="skel" style={{ height: 64 }} />)}
      </div>
    </main>
  );
}
