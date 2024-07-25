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
        if(score>=0.6)
            return 'green'
        else
            return 'black'

    }

    let {id} = useParams()

    function myFunction(value, index, array) {
        array[index] = [value,anscore[index]]; 
      }
      
    const getAPIData = async()=>{
      const url = 'http://127.0.0.1:5000/analysis/'+id
      let result = await fetch(url)
      result = await result.json()
      var sent = result.s
      var ans = result.anscore
      console.log(ans)
      setAnscore(result.anscore)
      setArr(result.s)
      sent.forEach(myFunction)
      setArr(sent)
      console.log(sent)
      return 1;
  }

  useEffect(() => {
    getAPIData();
  }, []);


    return(
    <div>
        {arr.map((i)=>
        <p style={{marginLeft:"10%",fontSize:"24px",fontWeight:"bold",color:col(parseFloat(anscore[x++]))}}>
            {i[0]}
        </p>
        )}
        {console.log(analysis)}
        
        

    </div>
)   
}

export default Analysis