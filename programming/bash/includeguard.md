## Motivation

たとえシェルスクリプトであっても、コードが育ってくるうちに、
関数や定数を別ファイルにまとめたくなることがある。  
その時C++の`#pragma once`のように、複数のスクリプトが同一の外部スクリプトを参照しているとき、
複数回読み込まないようにしたい。

## TL; DR: Use Python
冗談はともかく、Bashにこだわる意味はないと思う。
```bash
TOKEN=$(readlink -f "${BASH_SOURCE}" | md5sum)
if [[ -n "${INCLUDE_GUARD["TOKEN${TOKEN:0:32}"]}" ]]; then return; fi
INCLUDE_GUARD["TOKEN${TOKEN:0:32}"]="INCLUDE_GUARD"
```
このコードは[StackOverflow](http://stackoverflow.com/questions/7518584/is-there-any-mechanism-in-shell-script-alike-include-guard-in-c)
の回答と違って、コピー&ペースト可能というメリットがある。
筆者はシェル芸人ではないので、もっといいやり方を知っているという方はご教授ください。

## 説明
まず、スクリプトを一意に特定するトークンを定義する。
```bash
TOKEN=$(readlink -f "${BASH_SOURCE}" | md5sum)
```
変数`$BASH_SOURCE`は、そのコードが書かれているスクリプトの名前が自動的に代入される。  
`$0`を使うと、sourceされたファイルではなく、呼び出し側のスクリプトの名前が入ってしまう。  
これだけでは名前が被るので、`readlink -f`で絶対パスに変換。  
これは後で連想配列の添え字に使いたいのだが、パスは`/`や`.`などを含むので、そのままでは使用できない。  
`sed`で取り除いてもいいが、エスケープ漏れがあると面倒くさいので`md5sum`でハッシュを計算してしまう。

```bash
if [[ -n "${INCLUDE_GUARD["TOKEN${TOKEN:0:32}"]}" ]]; then return; fi
INCLUDE_GUARD["TOKEN${TOKEN:0:32}"]="INCLUDE_GUARD"
```
基本的な仕組みとしては、ある変数を定義し(二行目)、2回以上インクルードしないよう、
その変数が定義されているかどうかを調べる(1行目)という流れ。  
連想配列`INCLUDE_GUARD`の添え字に、ファイルごとにユニークなトークンを指定することで、
そのファイルが読み込まれたというフラグを立てる。  
変数名の前に`TOKEN`という文字列を入れているのは、
そのままでは`$TOKEN`変数の中身であるハッシュを、数字として解釈しようとしてしまうため。  
さらに`md5sum`は標準入力をハッシュ化する場合でもハイフンとからのファイル名を出力しようとしてしまうため、
`${TOKEN:0:32}`でハッシュ部分のみを取り出す。

`[[ -n ... ]]`で変数がセットされているかを調べ、
セットされていた場合はその時点でスクリプトを終了し、二重インクルードを防ぐ。

## 実行結果
test.sh
```bash
TOKEN=$(readlink -f "${BASH_SOURCE}" | md5sum)
if [[ -n "${INCLUDE_GUARD["TOKEN${TOKEN:0:32}"]}" ]]; then return; fi
INCLUDE_GUARD["TOKEN${TOKEN:0:32}"]="INCLUDE_GUARD"

python3 -c "print('Hello, Python!')"  # 良い子はライブラリーで副作用を起こすのをやめよう!
```
test2.sh
```bash
#!/bin/bash

if [[ -z "$SHELL_HOME" ]]; then SHELL_HOME="$(dirname "$0")"; fi

source "${SHELL_HOME}/test.sh"
source "${SHELL_HOME}/test.sh"
source "${SHELL_HOME}/test.sh"

echo "GoodBye, Bash..."
```
実行結果
```bash
$ ./test2.sh
Hello, Python!
GoodBye, Bash...
$
```
sourceを三回読んでいるにもかかわらず、メッセージは一度しか出力されない。

## 弱点
* INCLUDE_GUARDを上書きされると死ぬ
* こんな良くわからんことをしてまで、二重インクルードを防ぐ意味はあるのか
* 実行コストは気にするな

## 参考
* [Is there any mechanism in Shell script alike “include guard” in C++?](http://stackoverflow.com/questions/7518584/is-there-any-mechanism-in-shell-script-alike-include-guard-in-c)
* [Bash: How _best_ to include other scripts?](http://stackoverflow.com/questions/192292/bash-how-best-to-include-other-scripts)
* [How do I know the script file name in a Bash script?](http://stackoverflow.com/questions/192319/how-do-i-know-the-script-file-name-in-a-bash-script/639500#639500)
