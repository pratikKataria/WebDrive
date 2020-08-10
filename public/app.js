var db = firebase.firestore();

db.collection("clients").doc("client-names").get().then((doc) => {
    
    var namesObject = JSON.stringify(doc.data());
    var names = JSON.parse(namesObject)['names'];
     
    for(var i =0; i < names.length; i++) {
        console.log(names[i]);
    }

});