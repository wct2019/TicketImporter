# Ticket Importer

WordCampのチケットデータを [wp-checkin](https://github.com/wct2019/wp-checkin) に取り込みます。

## 用意する情報

- Firebaseのデータベース（`https://wordcamptokyo2019app.firebaseio.com` みたいなの）と[サービスアカウント](https://firebase.google.com/docs/admin/setup?hl=ja#initialize_the_sdk)
- Node JS（LTSの新しいやつ v10 とか）
- Tickesというコレクションを作っておく（スキーマの定義は不要だという理解です）

上記の情報を `setting.json` に記載してください。サンプルとして `setting-sample.json` があります。

## インポート

```bash
# インストール
npm install
# 実行
npm start
```

## スキーマの定義

インポートするデータのスキーマはコールバックによって定義されています。

https://github.com/wct2019/TicketImporter/blob/master/schema/tokyo2019.js

同様のJSを作成し（e.g. osaka2019.js ）、コールバックで返すものを変えればドキュメントも変わります。コールバック関数へのパスは `setting.json` で指定してください。
コールバックを変更すると、データは変えられます。
ただし、スキーマを変えた場合はチェックインシステムも多少いじる必要があるので、そこに留意してください。

WordCampサイトに限らず固定のものは次の通りです。

- _id: チケットの投稿ID
- category: チケット種別（post_title）
- givenname: 名
- familyname: 姓
- email: メールアドレス
- date: 購入日
- changedate: 更新日
- status: 購入ステータス
- coupon: 利用したクーポンコード

## ライセンス

MIT
