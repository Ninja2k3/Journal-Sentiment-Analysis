import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function Analysis(){
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

    let {id} = useParams()

    const getAPIData = async()=>{
      const url = 'http://127.0.0.1:5000/analysis/'+id
      let result = await fetch(url)
      result = await result.json()
      setArr(result.s)
      console.log(result)
      setAnscore(result.anscore)
      return 1;
  }
  useEffect(() => {
    getAPIData();
  }, []);
  

  const saveAPIData = async()=>{
    const url = 'http://127.0.0.1:5000/analysis/'+id
    console.log(url)
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
        {arr.map((i)=>
        <p style={{color:col(parseFloat(anscore[x++]))}}>
            {i}
        </p>
        )}
        {console.log(analysis)}
        
        

    </div>
)   
}

export default Analysis