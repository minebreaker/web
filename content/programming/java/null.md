
> 10億ドルの誤り
> <footer>[アントニー・ホーア](https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%B3%E3%83%88%E3%83%8B%E3%83%BC%E3%83%BB%E3%83%9B%E3%83%BC%E3%82%A2)</footer>

[NullPointerExceptionをデバッグする](http://blog.takipi.com/java-nullpointerexception-the-one-tiny-thing-thats-killing-your-chances-of-solving-it/)のは
面倒でつまらない作業だが、改善することはできる。


## nullチェックを忘れない

NPEの原因は9割方、戻り値のnullチェックをしないまま、それのメソッドを呼び出そうとすることにあると思う。
だからフェイルファーストでnullをはじいておけば、デバッグがやりやすくなる。

```java
Object obj == something();
if (obj == null) throw new NullPointerException();
```


## 戻り値にnullを使わない

もちろん毎回nullチェックするのでもいいが、大変だしミスもしやすい。  
初めからnullを戻り値にしないようにプログラムしておけば、チェックの必要もなくなるし、プログラムの流れ自体も分かりやすくなる。

戻り値にnullを使うことはあいまいだ。例えば、あるコレクションの`get()`がnullを返してきたとき、それは値がnullなのか、キーが存在しないのか不明瞭だ。  
nullを戻り値にしたいと思ったとき、その必要があるか立ち止まって考えてみるとよい。  

```java
String returnsString() {
    ""; // nullではなく空の文字列を返す
}

List returnsList() {
    Collections.emptyList(); // 空のリスト
}

SomeEnum returnsEnum() {
    return NONE; // 列挙体の場合、何も存在しないことを表すオブジェクトを定義しておく
}
```

ライブラリーなどが戻り値にnullを使う場合、Java 8のOptionalでラップしてやる。それ以前であれば、GuavaのOptionalを使う。

```java
public static Optional<SomeObj> wrap() {
    return Optional.ofNullable( library.func() );
}
```


## パラメーターを信用しない
コンストラクターのパラメーターや、メソッドの引数がnullであるという可能性を考える。  
自分では分かっているつもりでも間違えてnullを渡してしまうことはあり得るし、他人がNPEの危険を考えずにそのメソッドを呼び出すこともあり得る。  
少なくともpublicなメソッドは、必ずnullチェックをしたほうが良い。  
Guavaはユーティリティーメソッドを提供しているので、積極的に使うこと。  

```java
public class Something {

    private String field;

    public Something(String param, Obj param2) {
        if (param == null) throw new NullPointerException(); // フェイルファーストでnullをはじく。
        this.field = Objects.requireNonNull(param); // Java 7のコンビニエンスメソッド。staticインポートすると便利。
        this.field = Preconditions.checkNotNull(param, "Error: %s", param2); // Guavaは%sをプレースホルダーとしてエラーメッセージを設定できる。

        // initialize
    }

}
```


## 文書化する
nullを返す可能性がある場合、Javadocに、nullが戻り値となること、その条件を明記する。 
[JSR-305](https://jcp.org/en/jsr/detail?id=305)アノテーションは簡単な目印になるだけでなく、Findbugs等の解析ツールと組み合わせてNPEの可能性を教えてくれる。  

```gradle
compile 'com.google.code.findbugs:jsr305:2.0.1'
```

```java
@Nullable // このメソッドはnullを返す可能性がある。
public Obj Func(@Nonnull Obj param) { // パラメーターはnullであってならない
    // ...
}
```


## 参考
[Google Guava](https://github.com/google/guava/wiki/UsingAndAvoidingNullExplained)
