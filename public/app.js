
 var fileToUpload;
 var fileButton = document.getElementById("selectFile");
 fileButton.addEventListener('change', function(e) {
     fileToUpload = e.target.files[0];
 });

var subDirBuilder = [];
var inputs=document.querySelectorAll("input[type=radio]"),
    x=inputs.length;
while(x--)
    inputs[x].addEventListener('change', function() {
        var index = this.name.substring(5);
        popChecked(index)
        popValue(index);
        subDirBuilder[index] = this.value;
        console.log(subDirBuilder);

        // console.log("Checked: "+this.checked);
        // console.log("Name: "+this.name);
        // console.log("Value: "+this.value);
        // console.log("Parent: "+this.parent);
    },0);

function popChecked(index) {
    var intIndex = parseInt(index)
   var radioInputs = document.getElementsByName(`level${intIndex+1}`);
   
   for (var i = 0; i < radioInputs.length; i++) {
       if (radioInputs[i].type == "radio") {
           radioInputs[i].checked = false;
       }
    }
}

function popValue(index) {
    while(subDirBuilder.length-1 > index) {
        subDirBuilder.pop()
    }
}

populateYear();
// function for selection of year
function populateYear() {
    var start = new Date().getFullYear();
    var end = 1900;
    var option ="";
    for (year = start; year >= end; year--) {
        option += "<option>" + year +"</option>";
    }
    document.getElementById("year").innerHTML = option;
}

populateMonth();
// function for selection of month
function populateMonth() {
    var monthNames = [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];
    var option = "";
    for (month in monthNames) {
        option += "<option>"+monthNames[month]+"</option>";
    }
    document.getElementById("month").innerHTML = option;
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


function createDir() {
    var clientName = document.getElementById("clientNamesSelector");
    var selectedYear = document.getElementById("year");
    var selectedMonth = document.getElementById("month");
    var selectedNatureOfWork = document.getElementById("natureOfWork");

    var fileSubAddress = '';
    for(var i =0; i < subDirBuilder.length; i++) {
        fileSubAddress += subDirBuilder[i] +'/'
    }

    var completeAddress = clientName.options[clientName.selectedIndex].value +'/'+
                                    fileSubAddress+
                                    selectedYear.options[selectedYear.selectedIndex].value+'/'+
                                    selectedMonth.options[selectedMonth.selectedIndex].value+'/'+
                                    selectedNatureOfWork.options[selectedNatureOfWork.selectedIndex].value+"/";

    try {
        fileToUpload.name = clientName.options[clientName.selectedIndex].value + selectedYear.options[selectedYear.selectedIndex].value+selectedMonth.options[selectedMonth.selectedIndex].value
        uploadFile(completeAddress);
    } catch(err) {
        window.alert('Select file to upload');
    }
}

function uploadFile(location) {

    console.log('files ' + fileToUpload);

    console.log('uploaded ' + location + fileToUpload.name);
    
    var storageRef = firebase.storage();

    var storage = storageRef.ref(location + fileToUpload.name);


    var task = storage.put(fileToUpload);

    task.on('state_changed', 
        function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            
            if (percentage == 100) {
                window.alert('file uploaded');
            }
        }, 

        function error(err) {

        },

        function complete() {

        }
    );


    console.log('file uploaded ');
}







