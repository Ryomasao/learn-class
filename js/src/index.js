// ES2015より前の構文
// ブラウザで実行する場合は、Babelを使わなくても、IE11で実行することができる形
// もちろんNode.jsでも実行することができる
function Member(firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
  this.getName = function() {
    return firstName + lastName
  }
}

const member = new Member('ayane', 'fujisaki')
console.log(member.getName())

const directCall = Member('fail', 'fail')

console.log(firstName)

