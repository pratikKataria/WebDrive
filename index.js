var db = firebase.firestore();

function getClientList() {
    console.log("initn");
    db.collection("user").doc("user-name").get().then((snapshot) => {
        console.log(snapshot);
    })

}