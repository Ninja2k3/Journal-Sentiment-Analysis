import { useEffect, useState } from "react"

function Plot(){
    const [base,setBase] = useState()
    const fetchImg = async()=>{
        const url = 'http://127.0.0.1:5000/plot'
        let result = await fetch(url)
        result = await result.json()
        setBase(result.img)
        console.log(result)
    }
    useEffect(() => {
        fetchImg();
      }, []);
    return(
        <div>
            <img src={`data:image/png;base64,${base}`} alt="plot"/>
        </div>
    )
}
export default Plot