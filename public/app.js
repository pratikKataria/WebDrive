
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
        var yearWithNextyear = year + '-' + (year+1+'').substring(2);
        option += "<option>" + yearWithNextyear  +"</option>";
    }
    document.getElementById("year").innerHTML = option;
}

populateMonth();
// function for selection of month
function populateMonth() {
    var monthNames = [ "Apr-01", "May-01", "Jun-01", "Jul-01", "Aug-01", "Sep-01","Oct-01", "Nov-01", "Dec-01", "Jan-02", "Feb-02", "Mar-02" ];
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
    var directoryType = document.getElementById("DirectoryType");
    var selectedYear = document.getElementById("year");
    var selectedMonth = document.getElementById("month");
    var selectedNatureOfWork = document.getElementById("natureOfWork");

    var fileSubAddress = '';
    var fileNameAcro = '';
    for(var i =0; i < subDirBuilder.length; i++) {
        fileSubAddress += subDirBuilder[i] +'/';
        fileNameAcro += '-'+subDirBuilder[i].charAt(0);
    }

    var completeAddress = clientName.options[clientName.selectedIndex].value +'/'+
                                    directoryType.options[directoryType.selectedIndex].value +'/'+
                                    fileSubAddress+
                                    selectedYear.options[selectedYear.selectedIndex].value+'/'+
                                    selectedMonth.options[selectedMonth.selectedIndex].value+'/'+
                                    selectedNatureOfWork.options[selectedNatureOfWork.selectedIndex].value+"/";

    console.log(completeAddress);

    try {
        var fileNameBuilder = clientName.options[clientName.selectedIndex].value + fileNameAcro +'-'+ selectedYear.options[selectedYear.selectedIndex].value + '-' + selectedMonth.options[selectedMonth.selectedIndex].value +'-'+selectedNatureOfWork.options[selectedNatureOfWork.selectedIndex].value +'.'+ getFileExtention();
        uploadFile(fileNameBuilder, completeAddress);
    } catch(err) {
        window.alert('Select file to upload');
    }
}

function uploadFile(filename, location) {

    var storageRef = firebase.storage();

    var storage = storageRef.ref(location + filename);

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

function getFileExtention()  {
    var fileName = fileToUpload.name;
    return fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
}







