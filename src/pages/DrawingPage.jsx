import { useParams } from 'react-router-dom';

export default function DrawingPage() {
  const { pageNumber } = useParams();
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Drawing Page</h1>
      <p className="text-lg">Page Number: <span className="font-semibold">{pageNumber}</span></p>
      <p className="text-gray-600 mt-2">Draw and create here!</p>
    </div>
  );
}