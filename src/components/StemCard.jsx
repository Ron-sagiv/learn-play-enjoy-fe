import { Link } from 'react-router';

const StemCard = ({ stem }) => {
let inFile=stem.inputFile;
  inFile=inFile.split("/").pop();
  inFile=inFile.split('-')[1];

  return (
    <Link
      to={`/stems/${stem.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="divide-base-300 bg-base-200 border-base-300 rounded-box divide-y border">
        
          <h2 className="p-6 wrap-break-word font-serif text-primary group-hover:text-highlight block truncate font-semibold transition-colors">
            {inFile}</h2>
            
        
      </div>
    </Link>
  );
};

export default StemCard;