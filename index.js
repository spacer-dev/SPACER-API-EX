const https = require('https')
const api_key = 'YOUR_API_KEY'
// const api_key = 'UXbix0Dg8MBswViH1pdE9dyiOJ4PXKhpl1h4uva' ← 

const error_dict = {
  'E90000001' : '予期しないエラーが発生',
  'E11001010' : '無効なパラメータです',
  'E11002002' : 'api keyは存在しません',
  'E11002102' : 'api keyに企業が設定されておりません',
  'E11002202' : 'api keyにホワイトIPリストが設定されておりません',
  'E11002203' : 'api keyに設定されているwhite ipsはアクセスが禁止されています',
  'E11004002' : '企業は存在しません',
  'E11004003' : '企業の有効期限が切れてます',
  'E11005002' : 'ユーザーは存在しません',
  'E11005102' : 'ユーザーに企業が設定されておりません',
  'E11005103' : 'ユーザーに設定されている企業は正しくありません',
  'E11006001' : 'マイロッカーは既に存在します',
  'E11006002' : 'マイロッカーは存在しません',
  'E11007002' : 'ロッカーは存在しません',
  'E11007101' : 'ロッカーのステータスは「利用可能」ではありません',
  'E11007102' : 'ロッカーのステータスは「予約中」ではありません',
  'E11007103' : 'ロッカーのステータスは「利用中」ではありません',
  'E11007104' : 'ロッカーのステータスは「制限中」です',
  'E11008002' : '使用中のロッカーは存在しません',
  'E11007113' : 'ロッカーのステータスが「利用中」です',
  'E11008003' : '使用中のロッカーはお客様企業で作成されたものではありません',
  'E11008004' : '使用中のロッカーは有効期限が切れました',
  'E11008102' : '使用中のロッカーのステータスは「予約中」ではありません',
  'E11008103' : '使用中のロッカーのステータスは「利用中」ではありません',
  'E11009001' : '使用中のロッカーは既に存在します',
  'E11009002' : '使用中のロッカーは存在しません',
  'E11009003' : '使用中のロッカーは存在しません',
  'E11010011' : '鍵の生成に失敗しました',
  'E11010012' : 'BLE読み込み結果が正しくありません',
  'E11010013' : '施錠に失敗しました',
  'E11008113' : '使用中のロッカーのステータスが「利用中」です',
}

const express = require('express')
const app = express()

const server = app.listen(777, function(){
  console.log( 'Node.js is listening to PORT:' + server.address().port )
})

// No.1 ユーザー作成API sample
app.get('/createUser', async function(req, res, next){
  // クライアントIDは任意の値を設定できます。
  const user = {
    "clientUserId": "client_001"
  }
  const result = await reqestTemplate('/user/create', user)
  // エラーの場合
  if( !result.hasOwnProperty('result') || !result['result'] ){
    const error_code = result['error']['code']
    console.log( error_dict[error_code] )
//  エラー処理の記述
// error response
// {
//     "result": false,
//     "error": {
//         "code": "E11002202",
//         "message": "api key white ips dose not exist"
//     }
// }
    res.send('failure')
  }else{
//  成功した場合の記述(貴社ユーザーIDとの紐付けなど)
    console.log(result)
// {
//     "userId": "-M_raQ0RH4y_XNofQBtP",
//     "result": true
// }
    res.send('success')
  }
})

// No.2 マイロッカー取得API sample
app.get('/myLocker', async function(req, res, next){
  const user = {
    // No.1 で作成したuserIDを指定して下さい。
    "userId": "-M_cV764CdpiEBu5PEn4"
  }
  const result = await reqestTemplate('/myLocker/get', user)
  // エラーの場合
  if( !result.hasOwnProperty('result') || !result['result'] ){
    const error_code = result['error']['code']
    console.log( error_dict[error_code] )
    res.send('failure')
  }else{
    console.log(result)
// {
//   "myLockers": [
//     {
//       "id": "SPACER051",
//       "isReserved": true,
//       "reservedAt": "2021-05-17 09:29:14",
//       "expiredAt": "2021-05-19 09:29:14",
//       "lockedAt": null,
//       "urlKey": "eH53K12ATKbHYnqt47"
//     },
//     {
//       "id": "SPACER055",
//       "isReserved": true,
//       "reservedAt": "2021-05-17 09:26:27",
//       "expiredAt": "2021-05-19 09:26:27",
//       "lockedAt": null,
//       "urlKey": "hRZQiCl57B331Tcs6L"
//     }
//   ],
//   "result": true
// }
    res.send('success')
  }
})

// No.3 マイロッカー予約API sample
app.get('/reserve', async function(req, res, next){
  const user = {
    "userId": "-M_cV764CdpiEBu5PEn4",
    "spacerId": "SPACER055"
  }
  // ? 仕様書の確認
  const result = await reqestTemplate('/myLocker/reserve', user)
  // エラーの場合
  if( !result.hasOwnProperty('result') || !result['result'] ){
    const error_code = result['error']['code']
    console.log( error_dict[error_code] )
    res.send('failure')
  }else{
    console.log(result)
// {
//   "myLocker": {
//     "id": "SPACER055",
//     "isReserved": true,
//     "reservedAt": "2021-05-17 09:13:49",
//     "expiredAt": "2021-05-19 09:13:49",
//     "lockedAt": null,
//     "urlKey": "uspGlWUcTboXpRFOyL"
//   },
//   "result": true
// }
  res.send('success')
  }
})

// No.4 マイロッカー予約キャンセルAPI sample
app.get('/reserveCancel', async function(req, res, next){
  const user = {
    // No.1 で作成したuserIDを指定して下さい。
    "userId": "-M_cV764CdpiEBu5PEn4",
    "spacerId": "SPACER055"
  }
  // ? 仕様書の確認
  const result = await reqestTemplate('/myLocker/reserveCancel', user)
  // エラーの場合
  if( !result.hasOwnProperty('result') || !result['result'] ){
    const error_code = result['error']['code']
    console.log( error_dict[error_code] )
    res.send('failure')
  }else{
    console.log(result)
// {
//     "result": true
// }
    res.send('success')
  }
})

// No.5 マイロッカー鍵共有API sample (鍵共有した際に、必ず呼び出して下さい。)
app.get('/shared', async function(req, res, next){
  const user = {
    // カギ共有を受けた人のUserIDを指定して下さい。
    "userId": "-M_cUbnQRIMS3wkt0EuB",
    // 予約や施錠時に発行されるurlKeyを指定して下さい。
    "urlKey": "cSzO4y7YuE1Dswi22r"
  }
  const result = await reqestTemplate('/myLocker/shared', user)
  // エラーの場合
  if( !result.hasOwnProperty('result') || !result['result'] ){
    const error_code = result['error']['code']
    console.log( error_dict[error_code] )
    res.send('failure')
  }else{
    console.log(result)
// {
//   "myLocker": {
//     "id": "SPACER055",
//     "isReserved": false,
//     "reservedAt": "2021-05-17 09:36:44",
//     "expiredAt": null,
//     "lockedAt": "2021-05-17 09:42:13",
//     "urlKey": "cSzO4y7YuE1Dswi22r"
//   },
//   "result": true
// }
    res.send('success')
  }
})

// No.6 鍵生成API sample
app.get('/generate', async function(req, res, next){
  const user = {
    "userId": "-M_cV764CdpiEBu5PEn4",
    "spacerId": "SPACER055",
    // 筐体側のBLE端末より取得できるreadDataを指定して下さい。
    "readData": "2478699286901811"
  }
  const result = await reqestTemplate('/key/generate', user)
  // エラーの場合
  if( !result.hasOwnProperty('result') || !result['result'] ){
    const error_code = result['error']['code']
    console.log( error_dict[error_code] )
    res.send('failure')
  }else{
    console.log(result)
// {
// こちらのprefixとkeyを足し合わせた文字列をBLEを通して、筐体側に送ります。
// prefixに関してはお問い合わせ下さい。
//     "key": 5074526098001984,
//     "result": true
// }
    res.send('success')
  }
})

// No.7 鍵施錠API sample
app.get('/generateResult', async function(req, res, next){
  const user = {
    "userId": "-M_cV764CdpiEBu5PEn4",
    "spacerId": "SPACER055",
    // 施錠コマンドをBLEで送信後、再度BLEでReadした結果をこちらに追加します。
    "readData": "rwsuccess"
  }
  const result = await reqestTemplate('/key/generateResult', user)
  // エラーの場合
  if( !result.hasOwnProperty('result') || !result['result'] ){
    const error_code = result['error']['code']
    console.log( error_dict[error_code] )
    res.send('failure')
  }else{
    console.log(result)
// {
//   "myLocker": {
//     "id": "SPACER055",
//     "isReserved": false,
//     "reservedAt": null,
//     "expiredAt": null,
//     "lockedAt": "2021-06-01 11:13:02",
//     "urlKey": "lQOQEWpaLSELiam8bN"
//   },
//   "result": true
// }
    res.send('success')
  }
})

// No.8 鍵取得API sample
app.get('/keyGet', async function(req, res, next){
  const user = {
    "userId": "-M_cV764CdpiEBu5PEn4",
    "spacerId": "SPACER055"
  }
  const result = await reqestTemplate('/key/get', user)
  // エラーの場合
  if( !result.hasOwnProperty('result') || !result['result'] ){
    const error_code = result['error']['code']
    console.log( error_dict[error_code] )
    res.send('failure')
  }else{
    console.log(result)
// {
//     "key": "829487542789526",
//     "result": true
// }
    res.send('success')
  }
})

// No.9 鍵解錠API sample
app.get('/keyGetResult', async function(req, res, next){
  const user = {
    "userId": "-M_cV764CdpiEBu5PEn4",
    "spacerId": "SPACER055",
    // 解錠コマンドをBLEで送信後、再度BLEでReadした結果をこちらに追加します。
    "readData": "rwsuccess"
  }
  const result = await reqestTemplate('/key/getResult', user)
  // エラーの場合
  if( !result.hasOwnProperty('result') || !result['result'] ){
    const error_code = result['error']['code']
    console.log( error_dict[error_code] )
    res.send('failure')
  }else{
    console.log(result)
// {
//     "result": true
// }
    res.send('success')
  }
})

// No.10 ロッカーボックス取得API sample
app.get('/lockerGet', async function(req, res, next){
  const user = {
    "userId": "-M_cV764CdpiEBu5PEn4",
    "spacerIds":["SPACER055","SPACER057"]
  }
  const result = await reqestTemplate('/locker/spacer/get', user)
  // エラーの場合
  if( !result.hasOwnProperty('result') || !result['result'] ){
    const error_code = result['error']['code']
    console.log( error_dict[error_code] )
    res.send('failure')
  }else{
    console.log(result)
// {
//   "spacers": [
//     {
//       "id": "SPACER055",
//       "status": "available",
//       "size": "小"
//     },
//     {
//       "id": "SPACER057",
//       "status": "restricted",
//       "size": "小"
//     }
//   ],
//   "result": true
// }
    res.send('success')
  }
})

// No.11 ロッカーユニット取得API sample
app.get('/lockerUnitGet', async function(req, res, next){
  const user = {
    "userId": "-M_cV764CdpiEBu5PEn4",
    "unitIds":["05","06"],
  }
  const result = await reqestTemplate('/locker/unit/get', user)
  // エラーの場合
  if( !result.hasOwnProperty('result') || !result['result'] ){
    const error_code = result['error']['code']
    console.log( error_dict[error_code] )
    res.send('failure')
  }else{
    console.log(result)
// {
//     "units": [
//         {
//             "id": "05",
//             "open": null,
//             "close": null,
//             "address": "東京都渋谷区代々木神園町２−２",
//             "spacers": [
//                 {
//                     "id": "SPACER051",
//                     "status": "available",
//                     "size": "M"
//                 },
//                 {
//                     "id": "SPACER052",
//                     "status": "available",
//                     "size": "M"
//                 },
//                 {
//                     "id": "SPACER053",
//                     "status": "available",
//                     "size": "M"
//                 },
//                 {
//                     "id": "SPACER054",
//                     "status": "limited",
//                     "size": "M"
//                 },
//                 {
//                     "id": "SPACER055",
//                     "status": "available",
//                     "size": "M"
//                 },
//                 {
//                     "id": "SPACER056",
//                     "status": "limited",
//                     "size": "M"
//                 },
//                 {
//                     "id": "SPACER057",
//                     "status": "available",
//                     "size": "M"
//                 }
//             ]
//         },
//         {
//             "id": "06",
//             "open": null,
//             "close": null,
//             "address": "546 台湾 南投縣仁愛鄉新生村",
//             "spacers": [
//                 {
//                     "id": "SPACER061",
//                     "status": "available",
//                     "size": "M"
//                 },
//                 {
//                     "id": "SPACER062",
//                     "status": "using",
//                     "size": "M"
//                 },
//                 {
//                     "id": "SPACER063",
//                     "status": "available",
//                     "size": "M"
//                 },
//                 {
//                     "id": "SPACER064",
//                     "status": "available",
//                     "size": "M"
//                 },
//                 {
//                     "id": "SPACER065",
//                     "status": "available",
//                     "size": "M"
//                 },
//                 {
//                     "id": "SPACER066",
//                     "status": "available",
//                     "size": "M"
//                 }
//             ]
//         }
//     ],
//     "result": true
// }
    res.send('success')
  }
})

// No.12 ユーザートークン発行API sample
app.get('/userToken', async function(req, res, next){
  const user = {
    "userId": "-M_cV764CdpiEBu5PEn4",
  }
  const result = await reqestTemplate('/user/token', user)
  // エラーの場合
  if( !result.hasOwnProperty('result') || !result['result'] ){
    const error_code = result['error']['code']
    console.log( error_dict[error_code] )
    res.send('failure')
  }else{
    console.log(result)
// {
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlLZXlJZCI6InA0Tmwwa1NhY1hWbnRlbUhnWk1hSFpyMXAyMlhSVExmaDNtYjd5TSIsInVzZXJJZCI6Ii1NX2NWNzY0Q2RwaUVCdTVQRW40IiwiaWF0IjoxNjIzNzM1OTgyLCJleHAiOjE2MjM4MjIzODJ9._5W7-gR-Eq7axgsCIVNHF3DMbJUEFcLU3efCDRrF3DQ",
//     "result": true
// }
    res.send('success')
  }
})

// No.13 拠点ID取得API sample
app.get('/location', async function(req, res, next){
  const user = {
    "locationId": "location101",
    "userId": "-M_cV764CdpiEBu5PEn4",
  }
  const result = await reqestTemplate('/location/get', user)
  // エラーの場合
  if( !result.hasOwnProperty('result') || !result['result'] ){
    const error_code = result['error']['code']
    console.log( error_dict[error_code] )
    res.send('failure')
  }else{
    console.log(result)
// {
//   "location": {
//     "id": "location101",
//     "name": "拠点名101",
//     "detail": "駅前 test555"
//     "open": "0:00",
//     "close": "24:00",
//     "address": "東京都渋谷区代々木神園町２−２",
//     "units": [
//       {
//         "id": "05",
//         "open": null,
//         "close": null,
//         "address": "東京都渋谷区代々木神園町２−１",
//         "dispOrder": 1,
//         "lockerType": 1,
//         "spacers": [
//           {
//             "id": "SPACER051",
//             "status": "available",
//             "size": null,
//           },
//           {
//             "id": "SPACER052",
//             "status": "available",
//             "size": null,
//           },
//           {
//             "id": "SPACER053",
//             "status": "touchpanel",
//             "size": "S"
//           },
//           {
//             "id": "SPACER054",
//             "status": "limited",
//             "size": null,
//           },
//           {
//             "id": "SPACER055",
//             "status": "available",
//             "size": "M",
//           },
//           {
//             "id": "SPACER056",
//             "status": "using",
//             "size": "S",
//           }
//         ]
//       },
//       {
//         "id": "06",
//         "open": null,
//         "close": null,
//         "address": "546 台湾 南投縣仁愛鄉新生村",
//         "dispOrder": 2,
//         "lockerType": 2,
//         "spacers": [
//           {
//             "id": "SPACER061",
//             "status": "restricted",
//             "size": "M",
//           },
//           {
//             "id": "SPACER062",
//             "status": "restricted",
//             "size": "M",
//           },
//           {
//             "id": "SPACER063",
//             "status": "restricted",
//             "size": "M",
//           },
//           {
//             "id": "SPACER064",
//             "status": "restricted",
//             "size": "M",
//           },
//           {
//             "id": "SPACER065",
//             "status": "restricted",
//             "size": "M",
//           },
//           {
//             "id": "SPACER066",
//             "status": "restricted",
//             "size": "M",
//           }
//         ]
//       }
//     ]
//   },
//   "result": true
// }
    res.send('success')
  }
})



async function reqestTemplate(path, obj){
  addApiKey(obj)
  return JSON.parse( await request(path, obj) )
}

function addApiKey(obj){
  obj['apiKey'] = api_key
}

async function request(path, obj){
  const options = {
    'method': 'POST',
    // 'hostname': 'ex-api.spacer.co.jp', // PROD
    'hostname': 'stg-ex-api.spacer.cc', // STG
    'port': null,
    'path': path,
    'headers': {
      'content-type': 'application/json',
    }
  }

  return await new Promise(function (resolve, reject) {
    const req = https.request(options, function (res) {
      const chunks = []
      res.on("data", function (chunk) {
        chunks.push(chunk)
      })

      res.on("end", function () {
        const body = Buffer.concat(chunks)
        resolve(body.toString())
      })
    })
    req.write(JSON.stringify( obj ))
    req.end()
  })
}
