# Ticket Importer

WordCampのチケットデータを [wp-checkin](https://github.com/wct2019/wp-checkin) に取り込みます。

## 用意する情報

- Firebaseのデータベース（`https://wordcamptokyo2019app.firebaseio.com` みたいなの）と[サービスアカウント](https://firebase.google.com/docs/admin/setup?hl=ja#initialize_the_sdk)
- Node JS（LTSの新しいやつ v10 とか）
- Tickesというコレクションを作っておく（スキーマの定義は不要だという理解です）

## インポート

```bash
# インストール
npm install
# 実行
node index.js
```

## スキーマの定義

インポートするデータのスキーマはこちらで定義されています。

https://github.com/wct2019/TicketImporter/blob/master/index.js#L19-L33

ここを変更すると、データは変えられます。
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
```

## ライセンス

MIT