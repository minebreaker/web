## 今回使用するツール
* Antlr 4
* Java
* IntelliJ
* Gradle

## リポジトリー
[サンプルの全ソースコード](https://bitbucket.org/minebreaker_tf/antlrtest)  
https://minebreaker_tf@bitbucket.org/minebreaker_tf/antlrtest.git

## IntelliJにAntlrプラグインをインストール
[ANTLR v4 grammar plugin](https://github.com/antlr/intellij-plugin-v4)を使う。

プレビュー機能が便利で、エディターからルールを右クリック->"Test rule hoge"を選択すると、
プレビューウィンドウでその規則を試すことが出来る。

ソースコードの自動生成も可能だが、今回はGradleから実行するので利用しない。

## Gradle
IntelliJで普通にGradleプロジェクトを作成する。

build.gradleにAntlrプラグインを追加して、依存に`antlr "org.antlr:antlr4:${バージョン}"`を追加する。

```groovy
apply plugin: 'antlr'

dependencies {
    antlr 'org.antlr:antlr4:4.6'
}
```

文法ファイルは`src/main/antlr`以下に保存する。
ビルドを実行すると、`build/generated-src/antlr/main`にレクサーとパーサーが出力される。  
パッケージ構造もそのまま反映されるので、出力したいパッケージと同じ階層にg4ファイルを保存しておくと、
IDEのサポートが受けられる(当初これに気付かず、JavaのソースにFQCNを指定していた...)。

[文法ファイル](g4)  
[Javaでの実装](java)  
