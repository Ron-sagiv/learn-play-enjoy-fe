import { Link } from 'react-router';

const StemCard = ({ stem }) => {
  return (
    <Link
      to={`/stems/${stem.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="card bg-base-100 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">{stem.inputFile}</h2>
          <p>{stem.inputFile}</p>
          <div className=" ">
            <span>
              
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StemCard;