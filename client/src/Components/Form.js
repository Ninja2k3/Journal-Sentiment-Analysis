import { useState } from "react";

function Form(){
    const [text,SetText] = useState()
    const [s,setS] = useState()
    

    const getAPIData = async()=>{
        const url = 'http://127.0.0.1:5000/analysis'
        let result = await fetch(url)
        result = await result.json()
        SetText(result.text)
        console.log(text)
    }
    
  
    const saveAPIData = async()=>{
      const url = 'http://127.0.0.1:5000/create'
      let formData = new FormData()
      formData.append('title',text)
      formData.append('string',s)
      await fetch(url,{
          method:"POST",
          body:formData
      })
    window.location.href = '../entries';  
  //   window.location.reload()       
  }
  
      return(
      <div>
          <label>Title :</label>
          <input type="text" onChange={(e)=>SetText(e.target.value)} value={text}  required></input>
          <label>Content :</label>
          <textarea type="text" onChange={(e)=>setS(e.target.value)} value={s} required/>
          <button onClick={saveAPIData}>Submit</button>
        <img src="http://127.0.0.1:5000/video" alt="video" style={{marginLeft:"30%"}}/>
      </div>
  )   
  }
  
export default Form;