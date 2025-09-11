export default function Gallery({ images }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`gallery-${idx}`}
          className="rounded-lg shadow-md object-cover w-full h-60"
        />
      ))}
    </div>
  );
}
