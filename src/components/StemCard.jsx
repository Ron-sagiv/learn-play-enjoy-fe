import { Link } from 'react-router';

const StemCard = ({ stem }) => {
  let inFile = stem.inputFile;
  inFile = inFile.split('/').pop();
  inFile = inFile.split('-')[1];

  return (
    <Link
      to={`/stems/${stem.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
      className="group block h-full"
    >
      <div className="h-full rounded-box border border-base-300 bg-base-200 p-5 transition-colors hover:border-primary hover:bg-base-100">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif font-semibold truncate text-primary transition-colors group-hover:text-highlight">
            {inFile}
          </h2>
          <span
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-neutral transition-transform group-hover:translate-x-0.5 group-hover:text-highlight"
          >
            &rarr;
          </span>
        </div>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-neutral">
          Guitar stem
        </p>
      </div>
    </Link>
  );
};

export default StemCard;
