import { useState } from "react"

function Login(){
    const [text,SetText] = useState('Temp')
    const [analysis,SetAnalysis] = useState('')
    const [s,setS] = useState()
    const [arr,setArr] = useState([])
    const [anscore,setAnscore] = useState([])
    var x = 0;
    function col(score){
        if(score<0)
            return 'red'
        if(score>0)
            return 'green'
        else
            return 'black'

    }


    const getAPIData = async()=>{
      const url = 'http://127.0.0.1:5000/'
      let result = await fetch(url)
      result = await result.json()
      SetText(result.text)
      console.log(text)
  }
  

  const saveAPIData = async()=>{
    const url = 'http://127.0.0.1:5000/'
    let formData = new FormData()
    setArr(s.split('.'))
    formData.append('string',s)
    let result = await fetch(url,{
        method:"POST",
        body:formData
    })
   result = await result.json()
   setAnscore(result.anscore)

//   window.location.reload()       
}

    return(
    <div>
        <button onClick={getAPIData}>
            GET
        </button>
        <p>
            {text}
        </p>
        
        <textarea type="text" onChange={(e)=>setS(e.target.value)} value={s}/>
        <button onClick={saveAPIData}>Submit</button>
        {arr.map((i)=>
        <p style={{color:col(parseFloat(anscore[x++]))}}>
            {i}
        </p>
        )}
        {console.log(analysis)}
        
        

    </div>
)   
}

export default Login