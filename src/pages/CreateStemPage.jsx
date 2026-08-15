import { useState } from 'react';
import { NavLink } from "react-router";


const CreateStem = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [redirect,setRedirect]=useState('');

    const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
        const formData  = new FormData();
        const bodyText={stemType: 'Guitar'};

        formData.append("body",JSON.stringify(bodyText));
        formData.append('file', file);

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stems`, {
          method: 'POST',
          headers: {
             Accept: 'application/json'
          },
          body: formData,
        }).catch((err) => {
          console.error('Error creating stem details:', err);
          setError('Error creating stem , check console log for more details...');
        });

        if (response.ok) {
          alert('Stem analyzer successfully triggered!');
          setError(null);
          setRedirect('/stems');
        } else {
          setError('Error creating stem , check console log for more details...');
        }
  };

  if(redirect){
  return <Navigate to={redirect} />;
}
  return (
    <div className="">
      <NavLink to="/stems" className="btn gap-1 px-2 text-xl font-bold">
                Back to StemAnalyzer
    </NavLink>
      <div className="">
        <div className="">
          <h2 className="text-xl font-bold mb-4">
            Upload New Song Stem Analysis
          </h2>

          <form className="">
            <input id="file" type="file" onChange={handleFileChange} className="text-sm text-stone-500
                  file:mr-5 file:py-1 file:px-3 file:border-[1px]
                    file:text-xs file:font-medium
                       file:bg-stone-50 file:text-stone-700
                            hover:file:cursor-pointer hover:file:bg-blue-50
                         hover:file:text-grey-700"/>
            
            {file && (
                <button  onClick={handleSubmit} className="p-1 btn btn-sm text-primary font-semibold" >StartAnalysis</button>
            )}
            
          </form>

          {error && (
            <div className="">
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CreateStem;