import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://champions-45262-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementInDB = ref(database, "endorsements")

const inputEl = document.getElementById("input-field")
const publishBtn = document.getElementById("publish-btn")
const messages = document.getElementById("messages")
const fromInputEl = document.getElementById("from-input")
const toInputEl = document.getElementById("to-input")




publishBtn.addEventListener("click", function() {


    let message = {
        mainText: inputEl.value,
        fromText: fromInputEl.value,
        toText: toInputEl.value,
        likes: 0
    }
    
    if (inputEl.value != "") {
        push(endorsementInDB, message)
        
        clearInputText(inputEl)
        clearInputText(fromInputEl)
        clearInputText(toInputEl)
    }
    
})

onValue(endorsementInDB, function(snapshot) {
    if (snapshot.exists()) {
        
        let endorsementArray = Object.entries(snapshot.val())

        clearMessages()
        
        for (let i = 0; i < endorsementArray.length; i++) {
            let endorsementItem = endorsementArray[i]
            
            addEndorsement(endorsementItem)
        }
    } else {
        messages.innerHTML = "No endorsements to show"
    }
})

function addEndorsement(item) {
    let itemID = item[0]
    let itemText = item[1].mainText
    let itemFrom = item[1].fromText
    let itemTo = item[1].toText
    let likes = item[1].likes
    
    let newEndorsement = document.createElement("div")
    
    newEndorsement.innerHTML += `
        <p style="font-weight: bold;">From ${itemFrom}</p>
        <p>${itemText}</p>
        <span>
            <p style="font-weight: bold;">To ${itemTo}</p>
            <p id="like">❤️ ${likes}</p>
        </span>
    `

    let exactLocationOfEndorsement = ref(database, `endorsements/${itemID}`)

    newEndorsement.addEventListener("dblclick", function() {
        
        remove(exactLocationOfEndorsement)
    })

    newEndorsement.addEventListener("click", function() {
        update(exactLocationOfEndorsement, {
            likes: likes++
        })
    })
    
    messages.append(newEndorsement)
    
}


function clearInputText(input) {
    input.value = ""
}

function clearMessages() {
    messages.innerHTML = ""
}
