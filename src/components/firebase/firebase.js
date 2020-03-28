import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyBSGRjXJyXwp3aM15owMCEYrdjShC1g0rg",
  authDomain: "huitziil-meny.firebaseapp.com",
  databaseURL: "https://huitziil-meny.firebaseio.com",
  projectId: "huitziil-meny",
  storageBucket: "huitziil-meny.appspot.com",
  messagingSenderId: "401680083099",
  appId: "1:401680083099:web:ec634eda169fa99ccb3e3e"
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.firestore = app.firestore();
  }
}

export default Firebase;