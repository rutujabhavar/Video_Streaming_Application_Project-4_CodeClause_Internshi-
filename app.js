import {useState,useEffect} from "react";
import axios from "axios";

function App() {
  const[token,setToken]=useState("");
  const[videos,setVideos]=useState([]);
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");

  function login(){
    axios.post("http://localhost:5000/api/auth/login",{email,password})
    .then(res=>setToken(res.data.token));
  }

  function load(){
    axios.get("http://localhost:5000/api/videos/public")
    .then(res=>setVideos(res.data));
  }

  useEffect(()=>{load();},[]);

  return (
    <div>
      <h2>Video Streaming App</h2>

      {!token &&
        <div>
          <input placeholder="email" onChange={e=>setEmail(e.target.value)}/>
          <input placeholder="password" onChange={e=>setPassword(e.target.value)}/>
          <button onClick={login}>Login</button>
        </div>
      }

      <h3>Public Videos</h3>
      {videos.map(v=>
        <div key={v.id}>
          <p>{v.title} — Views: {v.views}</p>
          <video width="300" controls src={`http://localhost:5000/uploads/${v.filename}`}></video>
        </div>
      )}
    </div>
  );
}
export default App;
