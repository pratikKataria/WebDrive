var subDirBuilder = [];
var inputs=document.querySelectorAll("input[type=radio]"),
    x=inputs.length;
while(x--)
    inputs[x].addEventListener('change', function() {
        var index = this.name.substring(5);

        popValue(index);
        subDirBuilder[index] = this.value;
        console.log(subDirBuilder);

        // console.log("Checked: "+this.checked);
        // console.log("Name: "+this.name);
        // console.log("Value: "+this.value);
        // console.log("Parent: "+this.parent);
    },0);


function popValue(index) {
    while(subDirBuilder.length-1 > index) {
        subDirBuilder.pop()
    }
}


var db = firebase.firestore();
db.collection("clients").doc("client-names").get().then((doc) => {
    
    var namesObject = JSON.stringify(doc.data());
    var names = JSON.parse(namesObject)['names'];
     
    var selectorMenu = document.getElementById("clientNamesSelector");
    for(var i =0; i < names.length; i++) {
        var option = document.createElement("option");
        option.text = names[i];
        selectorMenu.add(option);
        console.log(names[i]);
    }

});



uploadFile();
populateYear();




// function uploadFile() {

//     var fileButton = document.getElementById("selectFile");

//     fileButton.addEventListener('change', function(e) {

//         var file = e.target.files[0];
//         var storageRef = firebase.storage();

//         var storage = storageRef.ref('demo/' + file.name);

//         storage.put(file);

//         console.log('file uploaded ');
//     });
// }






// function for selection of year
function populateYear() {
    var start = new Date().getFullYear();
    var end = 1900;
    var option ="";
    for (year = start; year >= end; year--) {
        option += "<option>" + year +"</option>"
    }
    document.getElementById("year").innerHTML = option;
}
