import React, {useState, useEffect} from 'react'

function Chatroom() {

    function handleBeforeUnload(event) {
        event.preventDefault()
        event.returnValue = "Are you sure you want to leave? All chat data will be deleted!"
    }

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeUnload", handleBeforeUnload)
    })
    
    return(
        <div>

        </div>
    )
}

export default Chatroom