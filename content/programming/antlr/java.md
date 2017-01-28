## 準備
`src/main/antlr/test/Calc.g4`ファイルを作った後、Gradleから一度ビルドを実行する。
すると、`build/generated-src/antlr/main/test/`に
`CalcParser.java`、`CalcLexer.java`、(標準設定では)`CalcListener.java`と`CalcBaseListener.java`が出力される。
IntelliJからは何も設定しなくても利用できるようになる。

## パーサーの利用
```java
public static double calculate(String expr) {
    CalcLexer lexer = new CalcLexer(new ANTLRInputStream(expr));
    CalcParser parser = new CalcParser(new BufferedTokenStream(lexer));

    CalcParser.ExpressionContext ctx = parser.expression();
    return new Visitor().visit(ctx);
}
```
ANTLRのレクサーはANTLRInputStreamを引数に取る。今回は文字列から直接ストリームを作成する。

レクサーからトークンストリームを作成し、パーサーに渡す。ほぼ定型文。
ここでパーサーに構文規則に対応する名前のメソッドを呼ぶことで、CSTを作成できる。
今回では`Calc.g4`の`expression`に対応する、`expression()`メソッドを呼んでいる。
これで、最初の入力の文字列をexpressionの構文規則でパースした、`Context`を作成できる。

## Visitor
CSTを解析するのに、Visitorパターンを利用する。やっつけ実装なのでVisitorパターンの参考にはしないこと:<

プログラミング言語なんかではここからさらに抽象構文木に変換するのだが、面倒なので直接数字にしてしまう。

```java
if (ctx.exception != null) {
    logger.error("Recognition error", ctx.exception);
    throw ctx.exception;
}
```
文法規則にエラーがあった場合、処理を中止する。

```java
if (ctx.NUMBER() != null) {
    return Double.parseDouble(ctx.getText());
}
```
面倒なので整数でもdoubleとして扱う。
`getText()`はそのコンテキストのオリジナルの要素を、文字列として返すメソッド(`toString()`は解析された後の値)。

```java
if (ctx.expression().size() == 1) {
    return visit(ctx.expression().get(0));
}
```
()に囲まれていた場合。内側をそのまま再帰処理する。

```java
TerminalNode op = ctx.operator() != null ?
        (TerminalNode) ctx.operator().getChild(0) :
        (TerminalNode) ctx.primaryOperator().getChild(0);

double x = visit(ctx.expression().get(0));
double y = visit(ctx.expression().get(1));
switch (op.getSymbol().getType()) {
case CalcParser.PLUS:
    return x + y;
case CalcParser.MINUS:
    return x - y;
case CalcParser.MULTIPLY:
    return x * y;
case CalcParser.DIVIDE:
    return x / y;
default:
    throw new IllegalStateException();
}
```
式-演算子-式のとき。

左辺と右辺の計算結果を再帰的に取得する。
それから演算子に合わせ、計算を行った結果を返す。

トークンは列挙体ではなくintの数字で区別される残念仕様。
`TerminalNode.getSymbol()`でトークンクラスを取得し、さらに`Token.getSymbol()`でint定数を取得できる。
各トークンの定数は、パーサー・レクサーがstaticフィールドに持っている。

defaultは通常起こりえないので、適当に例外を投げておく。

以上、このメソッドにパーサーからコンテキストを渡せば、計算結果が戻り値になる。

[参考](http://stackoverflow.com/questions/29971097/how-to-create-ast-with-antlr4)


## 試してみる

[CalcTest.java](https://bitbucket.org/minebreaker_tf/antlrtest/src/7fc85994fcbd27b81ea0db88e1ea4193b0005dbb/src/test/java/test/CalcTest.java?at=master&fileviewer=file-view-default)

```java
@Test
public void test4() {
    double res = Main.calculate("1 + 2 * 3");
    assertThat(res, is(7.0));
}

@Test
public void test5() {
    double res = Main.calculate("1 * 2 + 3");
    assertThat(res, is(5.0));
}

@Test
public void test6() {
    double res = Main.calculate("(100 + 200) / 3");
    assertThat(res, is(100.0));
}
```

正しく計算されていることが分かる。

[環境構築](#/programming.antlr.prepare)  
[文法ファイル](#/programming.antlr.g4)  
