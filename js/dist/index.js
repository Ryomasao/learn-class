// ES2015より前の構文
// ブラウザで実行する場合は、Babelを使わなくても、IE11で実行することができる形
// もちろんNode.jsでも実行することができる
function Member(firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
  this.age = 23

  this.getName = function() {
    return firstName + lastName
  }
}

// jsのクラスはクラスというより、ただの関数
// newをつけて呼ぶことで、ただん関数をコンストラクタとして実行することができる
// コンストラクタとして呼ぶと、空のオブジェクト(this)を作って、暗黙的に作成したオブジェクを返す。
// ※コンストラクタでreturn を定義することで、返却するオブジェクトをさわることもできるが、あんまりやらない。
// またprototypeの継承とかも行う。
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/new
// より噛み砕いた記事。
// https://qiita.com/takeharu/items/809114f943208aaf55b3

// 上記挙動から、thisを固定するアロー関数をコンストラクタとして定義することはできない
// ex) const Member = () => {}
//     const member = new Member()
// なるほどと思った。

var member = new Member('tarou', 'yamada')
console.log(member.getName()) // tarou yamada

// ただの関数なので、new演算子をつけないで実行することもできる。
// とはいえ、できるだけであって推奨はされない。
var directCall = Member('fail', 'fail')

// この場合、コンストラクタとして実行した場合の暗黙的に新しいオブジェクトを返すということはしない。
console.log(directCall) // undefined
// また、関数として実行した場合、thisのコンテキストがかわるのでグローバルオブジェクトとして、変数名がつかわれてしまう
console.log(firstName)

// ちょっと横道、thisのコンテキストの話

// thisのコンテキストは、以下をおぼえとく！
// トップ:グローバル
// 関数:グローバル →なんとなく関数そのものをさすと思ってた。コンストラクタと違うから注意。
// コンストラクタ:生成したインスタンス、
// メソッド:レシーバ
// イベントリスナー: イベントの発生元
// bind・apply: 引数で指定したオブジェクト

// 以下、うろ覚えだった、オブジェクトのthis
// メソッドの場合、メソッドを呼び出している、オブジェクトがthisになる
// 以下の記事がわかりやすい
// https://qiita.com/takkyun/items/c6e2f2cf25327299cf03
var obj = {
  a:1,
  b: function (){
    console.log(this)
  }
}
console.log(obj.b()) // {a: 1, b: [Function: b]}

// 振り返りからのprototypeの話
//
// javascritpのクラスはただの関数
// 関数のプロパティの値が関数であればそれが、メソッドになる
// new 演算子をつけると、新しいオブジェクトを返してくれる
// 新しいオブジェクトをつくると、オブジェクトのプロパティにセットされる関数も毎回生成されることになる
// メモリがもったいない。javascriptはprototypeというものを用意してくれている。

// 以下のようにprotyotypeとして定義すると、クラスから生成されたインスタンスは、インスタンスのプロパティに
// 同名がなければ、prototypeを参照するようになる。
// 同名があると、インスタンスプロパティを参照するようになる。
Member.prototype.getAge = function () {
  return this.age
}
console.log('age:',member.getAge()) // 23

// static

// クラスにプロパティを持たせることは可能。ただし、インスタンスには引き継がれない。
Member.address = 'shizuoka'
console.log('from Class',Member.address) // shizuoka
console.log('from instance', member.address) // undefind

// プロパティに関数を渡して、static methodっぽいこともできる
Member.getAddress = function () {
  // 当然、コンストラクタで設定するプロパティは参照できない
  // console.log(this.firstName) // undefinde
  return this.address
}
console.log(Member.getAddress()) // shizuoka

// prototypeを定義する際には、オブジェクトリテラルで一括で設定する方がわかりやすい
var Bot = function() {}
Bot.prototype = {
  sayHello:function() {
    console.log('Hello')
  }
}
var bot = new Bot
bot.sayHello()

//　継承の話
var Animal = function (name) {
  this.name = name
}

Animal.prototype = {
  walk: function () {
    console.log(this.name, 'is waking....')
  }
}

// Animalを継承する
var Cat = function (name) {
  // この発想がすごい！
  // Animalでcallすると、関数Animalが実行される
  // コンストラクタしてではなく、関数として実行されるんだ
  // 関数として実行されると、thisはグローバルスコープになっちゃんだけど、callを使うことでthisを変更している
  // このthisは、Carがコンストラクタとして実行されることで生成されるオブジェクトを指すようになる
  Animal.call(this, name)
}

// メソッドを継承するために、子のprototypeに親のインスタンスをセットする
// これにより、Cat.methodを実行したときに、自身のインスタンス→自身のprototype→親のprototypeと検索することができる
// ふと、Cat.prototype = Animal.prototypeでもいいんじゃない？って思ったけど、その場合、CatとAnimalが同じprototypeを参照してしまう。
// Cat.prototype.hogeで追加したものが、Animalでも使えちゃうことになるので、避けるべき。
Cat.prototype = new Animal()
Cat.prototype.bark = function() {
  console.log(this.name, '> nyaan')
}

var mycat = new Cat('mike')
mycat.walk() // mike is waking...
mycat.bark() // mike > nyaan

