export default function Tooltip({ text }: { text: string }) {
  return (
    <div className="absolute z-30 w-[80vw] p-3 text-xs text-gray-800 bg-white border border-gray-300 rounded shadow-md top-full left-1/2 -translate-x-1/2 mb-2 whitespace-pre-wrap">
      {text}
    </div>
  );
}
