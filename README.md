<!-- Much thanks to https://github.com/othneildrew/Best-README-Template for the template -->
<!-- And to https://github.com/alexandresanlim/Badges4-README.md-Profile for the badges -->
<img id="top" src="https://i.imgur.com/iW7JeHC.png" width="200" align="right" />

# Multi-User Distributed Text Editor

[![Contributors][contributors-shield]][contributors-url]
  
#### This is a Distributed Computing Project in the Faculty of Engineering, Ain Shams University; for Spring 2022.

<details>
  <summary><b>Table of Contents</b></summary>
	<ol>
		<li><a href="#Introduction">Introduction</a></li>
    <li><a href="#Project Description">Project Description</a></li>
		<li><a href="#Getting Started">Getting Started</a></li>
    <li><a href="#Beneficiaries of The Project">Beneficiaries of The Project</a></li>
		<li><a href="#System Architecture and Design">System Architecture and Design</a></li>
		<li><a href="#Testing Scenarios and Results">Testing Scenarios and Results</a></li>
        <li><a href="#End-User Guide">End-User Guide</a></li>
        <li><a href="#Youtube Video">Youtube Video</a></li>
        <li><a href="#Milestones">Milestones</a></li>
		<li><a href="#Acknowledgments">Acknowledgments</a></li>
	</ol>
</details>
<p id="Introduction"></p>

## Introduction

Real-time collaboration makes work go faster, encourages everyone to participate, and may lead to great outcomes.
So, our goal is to build a Shared document editing, in the style of Google docs. 

#### Built With

 ![Node][Node]
 ![socket][socket] 
 ![Redis][Redis]
 ![React][React] 
 ![Mongo][Mongo] 

<p id="Project Description"></p>

## Project Description


We were asked to design, implement, and thoroughly test a distributed system. Our assigned task was a multi-user distributed text editor.
Our output is a responsive web app that lets you edit and save docs on the go. Changes are persistent and the document gets saved automatically in real time.
It is a rich text editor with smart editing and styling tools to help you easily format text and paragraphs. 
 
Link to the [Web App](https://text-editor-project.netlify.app/)

Link to the [Web App with Redis](https://text-editor-redis.netlify.app)

<p id="Getting Started"></p>

## Getting Started
Firstly clone this repo 

### Prepare environment

Then, you need to install all dependencies and devDependencies from the package.json files:
navigate to client folder and run the following command then navigate to server folder and run it again.


  ```sh
  npm i
  ```
  
### Run project

Go to server folder and run the following command 

  ```sh
  npm run devStart
  ```
  
OR 

  ```sh
  nodemon server.js
  ```
Go to client folder and run the following command 

  ```sh
  npm start
  ```
Finally the app should be running on your localhost 3000 

<p align="right">(<a href="#top">back to top</a>)</p>
<p id="Beneficiaries of The Project"></p>

## Beneficiaries of The Project 

All kinds of people who want to work collaboratively could benefit from this project. It allows them to create content, collaborate with their friends, family, or colleagues, and get things done.
This tool could help empower all sorts of technical, business, and non-technical teams to collaborate at high velocity. It allows them to respond to changes fast without the need to keep sending the document through different channels. 


<p id="System Architecture and Design"></p>

## System Architecture and Design

Our architecture is a three-tier layered architecture where a Client is deployed in a tier, the server on different tier, and database/cache is in a separate tier. Calls between the layers are done through socket api calls.

<p id="Testing Scenarios and Results"></p>

## Testing Scenarios and Results


Several Scenarios were tested including:

- Editing functionalities are working properly
- Incrementing the number of users as users are connected and decrementing them as users are disconnected and dispalying the output correctly.
- Each new document is defined by a differrent Id generated randomly.
- Synchronization between users; changes are displayed real-time.
- Fault Handling; Error displayed to user when internet is disconnected and user is prevented from editing.
- Fault Handling; 3 databases working properly so that when one falls the other works.
- Caching working properly using Redis to reduce API calls to the database.    

<p id="End-User Guide"></p>

## End-User Guide

Step 1: This project is a web app, to use this project you go to one of the following two links :

Link to the [Web App](https://text-editor-project.netlify.app/)

Link to the [Web App with Redis](https://text-editor-redis.netlify.app)

Step 2: When the website opens it shows a landing page as the one below

![user-guide-explaine][user-guide]

Step 3: As you open the document you’ll find the following

- The Copy to Clipboard button copies the Id of the document if you want to pass it to some one this is an easy shortcut to copy it.
- The Number of Current Users shows you how many users are working of the document in the time being.
- Then you have the toolbar this contains the options you need to edit your document.

<p id="Youtube Video"></p>

## Youtube Video

For Video Click [Here][video]

<p id="Milestones"></p>

### Milestones


- [x] Take time to search for components that can be used, any libraries and frameworks that would help us in our implementation and design.
- [x] Implemented Client-Server model to communicate with each other’s using sockets where:
	- - Initialized client and server sides
	- - Initiated the server to get changes and allow multi-users mode
	- - Synchronize multiple instances of the same document together
	- - Created Local database using mongo
- [x] Changing the local database to be global and replicated. Added functionality of Number of users in the system. Added local caching using Redis
- [x] Globalizing Redis Caching instead of being local to prepare the system to be deployed. Added Landing page, handled internet connection faults. And Finally, Deploying the system.


<p align="right">(<a href="#top">back to top</a>)</p> 

<p id="Acknowledgments"></p>

## Acknowledgments

Special Thanks to 

* **Course Instructor:** [Prof. Dr. Ayman Bahaa](https://eng.asu.edu.eg/public/staff/ayman.bahaa)
* **Course Teaching Assistant:** Eng. Mostafa Ashraf




[contributors-shield]: https://img.shields.io/github/contributors/Nouran-saad/Distributed-Text-Editor.svg?style=for-the-badge
[contributors-url]: https://github.com/Nouran-saad/Distributed-Text-Editor/graphs/contributors


[socket]: https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white
[Node]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Mongo]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[React]: https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[Redis]: https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white
[user-guide]: README-images/user-guide.jpeg
[video]: https://youtu.be/ajgiDuLFyG8
