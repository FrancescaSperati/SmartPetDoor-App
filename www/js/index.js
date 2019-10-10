var pendingPetId = "";
var newPetName = "";
var newPetImages = [];
var imagesUploaded = 0;

// deviceready Event Handler
function onDeviceReady() {

    if(typeof window.FirebasePlugin !== "undefined"){
        console.log("firebase");
        window.FirebasePlugin.subscribe("newpet");
        window.FirebasePlugin.getToken(function(token) {
            console.log(token);
        }, function(error) {
            console.log(error);
        });    
    } else {
        console.log("NO firebase"); 
    }
    
    checkPendingPets();

    // click buttons listeners
    document.getElementById("unlockAndGoToUpload").addEventListener ("click", unlockAndGoToUpload); 
    document.getElementById("denyPet").addEventListener ("click", denyPet); 
    document.getElementById("cameraTakePicture").addEventListener ("click", cameraTakePicture); 
    document.getElementById("errorBackToHome").addEventListener ("click", checkPendingPets); 
    document.getElementById("thanksBackToHome").addEventListener ("click", checkPendingPets); 
    document.getElementById("startUpload").addEventListener ("click", startUpload); 

}

// Check Pending Pets function
function checkPendingPets() {
    $('.sectionpage').hide();
    $.getJSON("http://35.244.89.241/pendingpet.php", function(data) {
        if(data.length > 0){
            $('#home-pet').show();
            pendingPetId = data[0].id;
            $('#pendingpet-img').attr('src', 'data:image/jpeg;base64,' + data[0].file)
        } else {
            $('#home-nopet').show();
        }
    }).fail(function(error) {
        console.log(error);
        $('#home-nopet').show();
    });
}

function unlockAndGoToUpload() {

    $.getJSON("http://35.244.89.241/opendoor.php", function(data) {
        console.log(data);
    }).fail(function(error) {
        console.log(error);
    });

    $.getJSON("http://35.244.89.241/deletependingpet.php?filename=" + pendingPetId, function(data) {
        console.log(data);
    }).fail(function(error) {
        console.log(error);
    });

    $('.sectionpage').hide();
    $('#upload-pet').show();
}

function denyPet() {

    $.getJSON("http://35.244.89.241/deletependingpet.php?filename=" + pendingPetId, function(data) {
        console.log(data);
    }).fail(function(error) {
        console.log(error);
    });

    checkPendingPets();
}

function goToUploadSuccess() {
    $('.sectionpage').hide();
    $('#upload-success').show();
}

function cameraTakePicture() {
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });

    function onSuccess(imageURL) {
        var image = document.getElementById('myImage');
        image.src = imageURL;
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

function cameraTakePicture() {
    window.imagePicker.getPictures(
        function(results) {
            newPetImages = [];

            if(results.length > 0){
                $('.upload-example').hide();
                $('#startUpload').show();

                for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);
                    newPetImages.push(results[i]);
                    $('#upload-pictures').append('<img class="petuploadimg" src="'+results[i]+'">');
                }

            } else {
                $('.upload-example').show();
                $('#upload-pictures').html('');
                $('#startUpload').hide();
            }

        }, function (error) {
            console.log(error);
        }, {
            width: 800,
            quality: 80
        }
    );
}
    
function startUpload(){
    navigator.notification.prompt(
        'Please enter your pet\'s name',
        uploadImages,
        'Pet Name',
        ['SAVE'],
        ''
    );
}

function uploadImages(results) { 
    if(results.input1.length > 0){
        $("#loading").show();

        newPetName = results.input1.replace(/\s/g,'');

        for (var i = 0; i < newPetImages.length; i++) {
            window.plugins.Base64.encodeFile(newPetImages[i], function(base64image) {
    
                $.ajax({
                    type: "POST",
                    url: "http://35.244.89.241/newpet.php",
                    data: { petname: newPetName, petimage: base64image }
                }).done(function() {
                    imagesUploaded++;
                    checkUploadComplete();
                });
    
            }, function(error){
                console.log(error);
            });
        }

    } else {
        alert("Sorry, a name for your pet is mandatory");
        startUpload();
    }
}

function checkUploadComplete() {
    if(imagesUploaded < newPetImages.length) return;
    if(imagesUploaded == newPetImages.length){
        startRetrain();
        $("#loading").hide();
        imagesUploaded = 0;
        newPetImages = [];
        $('.upload-example').show();
        $('#upload-pictures').html('');
        $('#startUpload').hide();
        goToUploadSuccess();
    }
}

function startRetrain() {
    $.getJSON("http://35.244.89.241/startretrain.php", function(data) {
        console.log(data);
    }).fail(function(error) {
        console.log(error);
    });
}

document.addEventListener("deviceready", onDeviceReady, false);
