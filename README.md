# Hamming Distance in 2D
This is a web appliaction which can show the hamming distances between all input 5-digit numbers

## How to start
1. After you clone this repo, navigate to the folder ```my-app/node_modules``` and run the command in terminal:

     ```npm install --save react-d3-library```
     
   Because in this project, react-d3 is used to render the elements.
   
2. Go back to folder ```my-app```, and type in the command in terminal to start the app:
   
     ```npm start```
   
   Now you can see the interface in your browser by typing in the link ```localhost:3000``` 

## Interface

After you start this app, you will see a 2-D coordinate system at the middle of screen and a textfield at the top right corner.

- If you would like to enter some 5-digit numbers to calculate the hamming distance, just type one by one and click the ```submit``` button. The result will automatically displayed in the coordinate system.  **Attention: If your input is not a exactly 5-digit number, your input will not be processed.**

- If you want to know a circle is representing the hamming distance between which two numbers, you can hover your mouse on it. The exact coordinator if it will be shown along with the labels with number. So you would know it.

- If you want to clear all the circles that are already displayed on the interface, then just type in *'clear'* in the textfield. All the circles will be eliminated. 

## Need to do

- If there are two very close numbers (such as: 44441 and 44443), then the two dots which were used to represent them will be overlapped. I am considering add a feature *Zoom in and out* to solve this issue. But it needs to be investigated.

- Some code needs to be decoupled.
