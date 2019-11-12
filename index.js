const fs = require ( 'fs' );
const admin = require("firebase-admin");
const settings = require( './setting.json' );
const csvSync = require( 'csv-parse/lib/sync' )

// 設定ファイルの読み取り
try {
  if ( ! settings ) {
    throw new Error( 'ファイルがありません' );
  }
  if ( ! settings.serviceAccount || ! fs.statSync( settings.serviceAccount ) ) {
    throw new Error( '設定ファイルにserviceAccountを設定してください。' );
  }
  if ( ! settings.databaseURL || ! settings.databaseURL.match( /^https?:\/\// ) ) {
    throw new Error( '設定ファイルにdatabaseURLを設定してください。' );
  }
  if ( ! settings.csv || ! fs.statSync( settings.csv ) ) {
    throw new Error( '設定ファイルにCSVを設定してください。' );
  }
  if ( ! settings.callback || ! fs.statSync( settings.callback ) ) {
    throw new Error( 'コールバック用の関数が定義されていません。' );
  }  
  console.log( '設定OK: %o', settings );
}catch(e){
  console.error(e);
}

// DB接続
const serviceAccount = require( settings.serviceAccount );
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: settings.databaseURL
});
const db = admin.firestore()

// ファイルの読み込み
// 登録件数によって失敗することがありそうです。うまくいかないときはファイルを分割してみてください。
const file = settings.csv; 
let data = fs.readFileSync( file ) //csvファイルの読み込み
let responses = csvSync( data )//parse csv
let objects = [] //この配列の中にパースしたcsvの中身をkey-value形式で入れていく。

// 各行をコールバック関数で処理
const callback = require( settings.callback ); 
responses.forEach(function(response) {
  objects.push( callback( response ) );
}, this)

objects.shift();//ヘッダもインポートされてしまうから、配列の一番最初のelementは削除します。

return db.runTransaction(function(transaction){
  return transaction.get(db.collection('Tickets')).then(doc => {
    objects.forEach(function(object){
      if(object["_id"] != ""){
        let id = object["_id"]
        delete object._id
        transaction.set(db.collection('Tickets').doc(id), object)
      }else{
        delete object._id
        transaction.set(db.collection('Tickets').doc(), object)
      }
    }, this)
  })
}).then(function(){
  console.log("success")
}).catch(function(error){
  console.log('Failed', error)
})
