# sentence-registry
英語の文法学習用に文章を登録し、登録した文章をsplitした上でシャッフルしたものを提供するAPIサーバ

## INSTALL
### 前提
データの保存にRedisを利用しているため、Redisサーバの導入が必要。

導入の仕方は[Redisの公式サイト](http://redis.io/)などを参考にしてください。  

homebrew(Mac) や apt-get (Linux)などのパッケージ管理ツールを利用すると導入が容易です。  
```
//例 (Mac)
$ brew install redis
```
### アプリケーションのダウンロード
```
$ git clone git@github.com:ginoh/sentence-registry.git
$ cd sentence-registry && npm install
```

### 初期化 (初回起動時のみ)
```
$ npm run-script initialize
```

### 起動
```
$ npm start
```

### 終了
```
$ npm stop
```

## API仕様

### RDL
(TBD)
将来的に、仕様は[RDL(Resource Description Language)](https://ardielle.github.io/)としてドキュメントよりもソースコードとして残せるようにする予定です。

### データ保存
format
```
//ローカルホストで起動している場合
//ex. curlコマンドを利用
curl -X POST --data-urlencode "text=This is Sample Sentence." localhost:3000/v1/item/
```
|エントリポイント|
|:--|
|/v1/item/|

|method|
|:--|
|POST|

|パラメータ|説明|備考|
|:--|:--|:--|
|text|登録する文章|textはURLエンコードされていること|

response  
登録に成功した場合、登録されたデータがレスポンスとして返却される。
```
{
  "data": {
    "item": {
      "id": 1,
      "origin": "This is Sample Sentence.",
      "shuffle": [
        "This",
        "Sentence",
        "Sample",
        "is"
      ]
    }
  }
}
```
|key|説明|備考|
|:--|:--|:--|
|item.id|登録された文章を示すID。データを取得する際に指定するIDとなる||
|item.origin|登録した文章||
|item.shuffle|文章を単語で区切り、要素をシャッフルした配列。||

### データ取得(1件)
|エントリポイント|
|:--|
|/v1/item/{id}/|

|パラメータ|説明|備考|
|:--|:--|:--|
|id|登録された文章を示すID|idは数値。|

|method|
|:--|
|GET|

format
```
//ローカルホストで起動している前提
//ex. curlコマンドを利用
curl http://localhost:3000/v1/item/1/
```
response
```
{
  "data": {
    "item": {
      "id": 1,
      "origin": "This is Sample Sentence.",
      "shuffle": [
        "This",
        "Sentence",
        "Sample",
        "is"
      ]
    }
  }
}
```
### データ取得 (全件)
|エントリポイント|
|:--|
|/v1/items/|

|method|
|:--|
|GET|

format
```
//ローカルホストで起動している前提
//ex. curlコマンドを利用
curl http://localhost:3000/v1/items/
```
response
```
{
  "data": {
    "items": [
      {
        "id": 1,
        "origin": "This is Sample Sentence.",
        "shuffle": [
          "This",
          "Sentence",
          "Sample",
          "is"
        ]
      },
      {
        "id": 2,
        "origin": "This is Sample Sentence2.",
        "shuffle": [
          "This",
          "Sample",
          "is",
          "Sentence2"
        ]
      }
    ]
  }
}
```

### データ削除 (1件)
|エントリポイント|
|:--|
|/v1/item/{id}/|

|パラメータ|説明|備考|
|:--|:--|:--|
|id|登録された文章を示すID|idは数値。|

|method|
|:--|
|DELETE|

```
//ローカルホストで起動している前提
//ex. curlコマンドを利用
curl -X DELETE localhost:3000/v1/item/2/
```
response
```
{
  "statusCode": 200,
  "message": "item (id=2) has been deleted."
}
```

### エラーレスポンス
エラー時にはエラーレスポンスを返却する。  
現状、[boomモジュール](https://github.com/hapijs/boom)を利用したレスポンスが返却される。

## ToDo
### テストの作成
unit テストがないので作成する必要がある。mocha, jenkins-mochaの利用を検討する。

### ストレージ再考
実装のしやすさの点からRedisを選択したが、複数件の取得の場合などはRDBの方が向いていると思われたので、  
MySQLなども視野に入れて再考する。

### RDL対応
仕様はRDLとしてソースコード化する。

### 長文対応
元来の目的から長文に対応する必要性があるかは疑問だが、検討する。

### エラーレスポンス見直し
現状、boomモジュールそのままなので、エラーレスポンスを見直すことも検討する。
