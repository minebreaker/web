Bashを書くたびにどうするのが正しいのか何時間も悩み続けていたので、一念発起してオレオレスタイルガイドをまとめることにした。

気が向くたびに追記していきます。

なお、あくまでオレオレであり、突っ込みどころがいろいろとありそうなのはご容赦。包括的なガイドとしては、[Google Shell Style Guide](https://google.github.io/styleguide/shell.xml)を参照されたし。ただしインデントは4。


## Pythonを使用する

いや本気で。


## Pythonが使えない場合にのみ、Bashを使用する

csh、zsh等は使わない。


## .sh拡張子を付ける
Googleスタイルガイドは.shはつける必要はないと言っているが、特にWindowsでシェルを書いているとき(!)はファイルの区別に困る。ついているほうが視覚的にもわかりやすいと思う。


## main関数

全ての処理はmain関数に記述し、それ以外の部分で処理を行わないこと。
Googleは単にmainを直接呼んでいるが、
```bash
main() {
    ...
}

[[ "${BASH_SOURCE[0]}" == "$0" ]] && main "$@"
```
のようにして、`source`されたときは実行しないようにする。
Pythonの`if __name__ == '__main__'`と同じ発想。


## Bashのバージョンを確認する
バージョン依存の機能を使う場合、バージョンを必ず確認する。

```bash
if [[ -z "${BASH_VERSINFO}" || "${BASH_VERSINFO[0]}" -lt 4 ]]; then
    echo "古いBash: ${BASH_VERSINFO[0]}" >&2
    return
fi
```


## インクルードガード

[インクルードガード](includeguard.html)参照。
ここまでする必要は正直ないかもしれないが、単純なトークンを使ってインクルードガードを実装するのはそれほど悪くないアイデアだと思う。


## 関数の命名規則

例えば`hoge/piyo/fuga.sh`というシェルの関数宣言は
```bash
hoge.piyo.fuga.do_something() {}
```
とする。
Bashで名前空間を実現する上手い方法はないようなので、冗長でも頑張る。


## 関数の定義

**常に**コメントを付け、入出力と副作用、グローバル変数(使わずに引数として渡すほうが良い)を明記すること。引数は最初に、意味のある変数に代入すること。

```bash
# 挨拶を出力する.
# @param $1 挨拶される人
# @param $2 挨拶する人
# @return Unit
# @sideeffect 標準出力
greeting() {
    [[ -z "${1+x}" ]] && echo "本当は引数が設定されているかまで確かめたいが、さすがに面倒すぎる"

    declare -r to="$1"
    declare -r from="$2"

    echo "hello from ${from} to ${to}!"
}
```


## メッセージは標準エラー出力へ

すべてのメッセージは、例えエラーでなくても、STDERRに出力する。

下記、Googleのスタイルガイドより引用。
```bash
err() {
  echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')]: $@" >&2
}
```


## 変数宣言は常に`declare -r`

変数はできる限り使わず、`declare -r`で宣言することで書き換えを防ぐ。特に変数・定数をそのまま書くことは絶対に避ける。

`readonly CONSTANT="hoge"`は、`local`と同時に使用できないので避ける。後から`readonly`するのは冗長。
ちなみに関数内での`declare`は`local`と同等なので、心配はいらない。

要するに、`declare -r`を使えば関数の内外で一貫したスタイルで定数を宣言できる。

シェルスクリプトは意図しない事故を起こしやすいので、とにかく気を付けること。


## 参考
[How to detect if a script is being sourced](https://stackoverflow.com/q/2683279)
[How to check if a variable is set in Bash?](https://stackoverflow.com/q/3601515)
[Make sure your script runs with a minimum Bash version](http://www.commandlinefu.com/commands/view/7962/make-sure-your-script-runs-with-a-minimum-bash-version)
