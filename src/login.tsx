import React, { useState } from 'react';
import auths from './firebaseCofig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


const auth = getAuth(auths.app);

const Login: React.FC = () => {
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Do something with userCredential
      console.log("hello");
      // Navigate to /home after successful login
      window.location.replace("./home")
    } catch (error) {
      setError("Email or password Inccorect");

    }
  };


  return (
    <div>
      <div className='image-login'><img className='image-login-only' src="https://images.squarespace-cdn.com/content/v1/54fa0a0be4b07dff5dca897a/4d9f6aa6-f51d-451d-b49d-646fc967c2d0/FF_blk_circle_tx.png" alt="" /></div>
      <form onSubmit={handleLogin} className='login-form'>
        <div>
          <Input
          className='input-login'
            placeholder="Email" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <Input
          className='input-login'

            placeholder="Password" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <Button className='login-btn' type="submit" 
        
        >Login</Button>
      </form>
      <br />

      {error && <p className='error-login'>{error}</p>}
    </div>
  );
};

export default Login;
