/**
 * CSVの各行をオブジェクトにして返す
 */
module.exports = function( response ) {
  return {	
    _id:        response[0], // ここは必須
    category:   response[1], // 9までは各Campで共通項目
    givenname:  response[2],
    familyname: response[3],
    email:      response[4],
    date:       response[5],
    changedate: response[6],
    status:     response[7],
    coupon:     response[9],
    u20:        response[16], // 名前間違い。実際はover20
    tshirtsize: response[18],
  };
};
