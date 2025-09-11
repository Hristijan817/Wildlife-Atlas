export default function VideoClips({ videos }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {videos.map((vid, idx) => (
        <div key={idx} className="aspect-video">
          <iframe
            src={vid}
            title={`video-${idx}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg shadow-md"
          />
        </div>
      ))}
    </div>
  );
}
