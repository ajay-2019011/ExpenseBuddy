![expensebuddylogo](https://user-images.githubusercontent.com/54185164/130478352-2b4262c3-9e57-4b40-a562-6aa96bce0aa1.png)



# ExpenseBuddy

### About
***

A simple expense manager that helps users to track their expenses and view reports.

### Tech-Stack
***
* ReactJS
* NodeJS
* MongoDB
* Firebase

### Setting up the Project for Development
***

Open git bash, and clone this repository by running the following command

##### `git clone https://github.com/abhineetpandey10/ExpenseBuddy.git`

Now, open the command terminal, navigate into the directory where you cloned this repository using the **`cd`** command, and then hop into the **ExpenseBuddy** directory by using the command **`cd ExpenseBuddy`**
* Navigate into the **client** folder by using the command **`cd ExpenseBuddy/client`**, and run the command **`npm install`**. This would install all the required dependencies for the client side of the project.
* Now, navigate into the **server** folder by using the command **`cd ../server`**, and run the command **`npm install`**. 

You need to create a firebase project and register this webapp on that firebase project. You may look [**here**](https://firebase.google.com/docs/web/setup) for more details on that. Once that is done, you'll get the details of your firebase config object.

Thereafter, you will get the details of the firebase Config Object from your firebase project.Copy those details, and then in the **client** folder, 
create a **.env** file, and add the following ***environment variables***

##### **`REACT_APP_FIREBASE_API_KEY=apiKey`**
##### **`REACT_APP_FIREBASE_AUTH_DOMAIN=authDomain`**
##### **`REACT_APP_FIREBASE_PROJECT_ID=projectId`**
##### **`REACT_APP_FIREBASE_STORAGE_BUCKET=storageBucket`**
##### **`REACT_APP_FIREBASE_MESSAGING_SENDER_ID=messagingSenderId`**
##### **`REACT_APP_FIREBASE_APP_ID=appId`**

Now, go to [**MongoDB Atlas**](https://www.mongodb.com/cloud/atlas) and create a free-tier cluster here. From here, you need the ***MongoDB Connection String***. You may look [here](https://docs.mongodb.com/guides/cloud/connectionstring/) to know more on how to get the 
***MongoDB Connection String***. Copy the connection string, and then on your local machine inside the **ExpenseBuddy** folder, navigate to the **server** folder and create a
**.env** file with the following ***environment variables***

##### **`URI=MongoDB_Connection_String`**

***Congratulations! You've setup the project on your local machine for development.***

### Running and Testing the Project
***
* Open the command terminal, navigate into the **ExpenseBuddy/client** directory, and run the **`npm start`** command to start the React Development server on PORT 3000.
* Open the command terminal, navigate into the **ExpenseBuddy/server** directory, and run the **`npm start`** command to start the NodeJS Development server on default PORT 3001. The default port can be changed in the index.js file contained in the **src** folder.

### Screenshots

![1](https://user-images.githubusercontent.com/54185164/130480729-3e10b8e0-a17a-4c2e-9f4d-bc46526c2791.JPG)
![2](https://user-images.githubusercontent.com/54185164/130480743-387651fc-57b6-4fa0-a166-22d2de0613d8.JPG)
![3](https://user-images.githubusercontent.com/54185164/130480754-29e938b0-a255-4295-98a1-246b06506d82.JPG)
![5](https://user-images.githubusercontent.com/54185164/130480779-3a7da307-0de9-407f-8435-3d26de722a0a.JPG)
