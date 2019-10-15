var admin = require("firebase-admin");

var serviceAccount = require("./wordcamptokyo2019app-firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wordcamptokyo2019app.firebaseio.com"
});

const db = admin.firestore()
const fs = require('fs')
const csvSync = require('csv-parse/lib/sync')
const file = '/Users/ryu/Documents/dev/wordcamp/firebaseImport/camptix-export-2019-10-15.csv' //インポートしたいcsvファイルをindex.jsと同じ階層に入れてください
let data = fs.readFileSync(file) //csvファイルの読み込み
let responses = csvSync(data)//parse csv
let objects = [] //この配列の中にパースしたcsvの中身をkey-value形式で入れていく。

responses.forEach(function(response) {
  objects.push({
    _id:                    response[0],
    category:               response[1],
    givenname:               response[2],
    familyname:               response[3],
    email:               response[4],
    date:               response[5],
    changedate:               response[6],
    status:               response[7],
    u20:               response[16],
  })
}, this)

objects.shift();//ヘッダもインポートされてしまうから、配列の一番最初のelementは削除します。

return db.runTransaction(function(transaction){
  return transaction.get(db.collection('tickets')).then(doc => {
    objects.forEach(function(object){
      if(object["_id"] != ""){
        let id = object["_id"]
        delete object._id
        transaction.set(db.collection('tickets').doc(id), object)
      }else{
        delete object._id
        transaction.set(db.collection('tickets').doc(), object)
      }
    }, this)
  })
}).then(function(){
  console.log("success")
}).catch(function(error){
  console.log('Failed', error)
})
