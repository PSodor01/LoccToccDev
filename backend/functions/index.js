/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
admin.initializeApp();

exports.getIndexData = functions.pubsub.schedule('every 5 minutes').onRun(async() => {

  try {
    const response = await axios.get('http://api.open-notify.org/astros.json')
    const { number, people } = response.data;

      const names = people.map((astronaut) => astronaut.name);
      const crafts = people.map((astronaut) => astronaut.craft);

    const writeResult = await admin
      .firestore()
      .collection("test")
      .doc("testDoc")
      .set({ 
          indexData: number, 
          names, 
          crafts,
          timeStamp:Date.now(),
        });

  } catch (error) {
    console.log(error);
  } 
  return null;

});
