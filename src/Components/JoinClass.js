import React, {useEffect, useState, useContext} from 'react'
import * as firebase from 'firebase'
import {AuthContext} from '../Auth'
import {Link} from 'react-router-dom'
let checks = []
let classtudents=[]
function JoinClass() {
    const rootRef = firebase.database().ref()
    const {currentUser} = useContext(AuthContext)
    const [classState, setClassState] = useState([])
    const userId = currentUser.uid
    let classes = []
    
    let count = 0
	
    function fetchData(data) {
        let counter = 0
        for (let value of Object.values(data)) {
            if (counter == 0) {
                for (let i = 0; i < value.length; i++) {
                        
                        if (!value[i]["students"].includes(userId)) {
                        classes.push(value[i])
                    	}
                        checks.push(0)
                        classtudents.push(value[i]["students"])
                        console.log(classtudents[i])
                }
                setClassState(classes)
            }
            counter ++
        }
    }
    
    useEffect(() => {
        rootRef.once("value")
        .then(snap => {
            console.log("Fetched data:")
            console.log(snap.val())
            fetchData(snap.val())
        })
    }, [])
	function massJoin()
	{

		for(let a=0;a<checks.length;a++)
		{
			console.log("loopin "+a+" so thats class ")
			if(checks[a]===1)
			{
				console.log("imagine this working")
				join(a,userId)
			}
		}
		console.log("finished joining classes, reloading")
		window.location.reload(false)
	}
	function clicked(e,ids)
	{
		
		if(e)
		{
			checks[ids]=1
			console.log("yes")
			
		}
		else
		{
			checks[ids]=0
			console.log("no")
		}
		console.log(checks)
	}
	function join(classid,uid)
	{	
	console.log("im running")
		var woah = classtudents[classid].length
		console.log(woah)	
		
		var updates={}
		updates['/classData/'+classid+'/students/'+woah] = uid
		
 		return firebase.database().ref().update(updates)
	}
	function countStudents(classid)
	{
		
	}
    const linkStyle = {
        color: "black",
        textDecoration: "none"
    }

    var classList = classState.map(cl => {
        return (
        	<div className="joinclasstest" key={cl.id}>
        		<div className="joinclass-list">
        			<input type="checkbox" name={cl.id} onChange={e=>clicked(e.target.checked,cl.id)}></input>
        		</div>
        		<div>
            		
                		<p>{cl.name}</p>
            
            	</div>
            </div>
            
        )
    })

    return (
        <div>
            <div className="joinclass-submit">
                <h1>Classes</h1>
            </div>
            <div className="class-list">
        		<button className="classjoinbutton" onClick ={massJoin}>Submit</button>
        	</div>
            <div className="class-list">
                {classList}
            </div>    
        </div>
    )
}

export default JoinClass