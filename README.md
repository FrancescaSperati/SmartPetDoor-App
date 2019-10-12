# SmartPetDoor-App

The mobile application that connects with the Smart Pet Door, TBC

This app is a single page application where sections are hidden and shown:


- home-nopet
  shows a card with no picture and a message saying "No pets at your door, All good so far!"
  
when the classification happening in the server recognizes a new pet, the picture is sent to the app (through a Firebase Cloud Messaging API) and a notification will appear on the user phone:
- pendingpet-img
  shows a card with the pet image, and a message saying "New Pet at the door!, Please select an action:"
  and two buttons: "Authorize" and "Deny"
  
when the user choose "Authorize", the server is triggered to open the door, and the user is asked to upload new pictures of the new pet:
- upload-pet
  shows a new section saying "Door open! , Now, upload pictures of your pet"
  and two buttons: "Select from Album" and "Upload!"
- upload-success
  shows a successful message "Door Open and Upload Success"
- error
  just an error page, with a "Back" button
