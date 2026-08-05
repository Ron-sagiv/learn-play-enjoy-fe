import { useState } from 'react';
import { Navigate } from "react-router";

const initialState = { email: '', password: '' };
const SignUpForm = () => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [signedin,setSignedin]=useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    //console.log(e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const email = form.email;
      const password = form.password;

      if (!email) throw new Error('Email should not be blank ');
      if (!password) throw new Error('Password should not be blank ');

      const callApi = async () => {
        try {
          const rawResponse = await fetch('http://localhost:3001/api/users', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          //console.log(rawResponse);

          const content = await rawResponse.json();
          //console.log(content);
          if (content.error) {
            console.log(error);
            setError('Signup failed! ' + content.error);
          } else {
            setForm(initialState);
            setSignedin(true);
          }
        } catch (error) {
          console.log(error);
          setError('Signup failed! ' + error);
        }
      };
      callApi();
    } catch (error) {
      console.log(error);
      setError('Signup failed! ' + error);
    }
  };

  if(signedin){
  return <Navigate to="/login" />;
}
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
      <legend className="fieldset-legend text-center text-xl ">Sign Up</legend>
      <form onSubmit={handleSubmit}>
        <label className="label">Email:</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="input"
          // placeholder="Email"
        />

        <label className="label">Password:</label>
        <input
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          className="input"
          // placeholder="Password"
        />
        <label className="label mt-0.75" for="check">
          <input
            id="check"
            type="checkbox"
            value={showPassword}
            onChange={() => setShowPassword((prev) => !prev)}
          />
          Show Password
        </label>
        <br />
        <button name="submit" type="submit" className="btn btn-neutral mt-4">
          Register
        </button>
        <br />
        <div className="text-red-500 mt-2">{error && <p>{error}</p>}</div>
      </form>
    </fieldset>
  );
};

export default SignUpForm;
