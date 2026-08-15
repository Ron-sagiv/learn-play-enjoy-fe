import { useState } from 'react';
import { useAuthenticationContext } from '../context/AuthenticationContext';
import { Navigate } from "react-router";

const CreateStem = () => {
  //const { token } = useAuthenticationContext();
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

    //console.log('Token: ', token);
    //console.log('formData: ', formData);
    //const token=JSON.parse(localStorage.getItem('token')) || '';
    //if(token){
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
    //}else{
     // setRedirect('/login');
    //}   
  };

  if(redirect){
  return <Navigate to={redirect} />;
}
  return (
    <div className="">
      <div className="">
        <div className="">
          <h2 className="">
            Create New Song Stem Analysis
          </h2>

          <form className="">
            <input id="file" type="file" onChange={handleFileChange} />
            
            {file && (
                <button  onClick={handleSubmit} className="" >StartAnalysis</button>
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