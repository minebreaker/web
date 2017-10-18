[参照](https://ja.wikipedia.org/wiki/%E5%8F%82%E7%85%A7_(%E6%83%85%E5%A0%B1%E5%B7%A5%E5%AD%A6))は、ある場所にあるデータを指す小さなオブジェクト。

Javaにおける参照には次の種類があり、`java.lang.ref`パッケージ以下に存在する。

| 名前           | クラス                           | JavaDoc                                                                                               |
|:---------------|:---------------------------------|:------------------------------------------------------------------------------------------------------|
| 強参照         | -                                | -                                                                                                     |
| ソフト参照     | `java.lang.ref.SoftReference`    | [JavaDoc](http://docs.oracle.com/javase/jp/8/docs/api/index.html?java/lang/ref/SoftReference.html)    |
| 弱参照         | `java.lang.ref.WeakReference`    | [JavaDoc](http://docs.oracle.com/javase/jp/8/docs/api/index.html?java/lang/ref/WeakReference.html)    |
| ファントム参照 | `java.lang.ref.PhantomReference` | [JavaDoc](http://docs.oracle.com/javase/jp/8/docs/api/index.html?java/lang/ref/PhantomReference.html) |
| ファイナル参照 | `java.lang.ref.FinalReference`   | -                                                                                                     |

* [パッケージjava.lang.ref](http://docs.oracle.com/javase/jp/8/docs/api/index.html?java/lang/ref/package-summary.html)
* [ReferenceQueue](http://docs.oracle.com/javase/jp/8/docs/api/index.html?java/lang/ref/ReferenceQueue.html)


## 用語整理

| 用語             | 説明                                                                                                      |
|:-----------------|:----------------------------------------------------------------------------------------------------------|
| 参照オブジェクト | あるオブジェクトへの参照を抽象化したもの。‘Reference.get()‘メソッドを呼び出して、参照先にアクセスできる。 |
| リファレント     | 参照先のオブジェクト。                                                                                    |
| 到達可能性       | あるリファレントにどうやってアクセスできるのか。                                                          |


## 強参照
いわゆる普通の参照。
定義としては、「参照オブジェクトをトラバースすることなく、あるスレッドによって到達できるオブジェクト」。

## ソフト参照
強到達可能でない(=普通にアクセスできない)が、ソフト参照からアクセス可能であるオブジェクトを、ソフト到達可能と呼ぶ。

ガベージコレクターは、メモリに余裕がある間は、ソフト到達可能オブジェクトをGCしない。
ヒープがいっぱいになった場合は、GCの対象となる。  
ソフト到達可能オブジェクトは、[OutOfMemoryError](http://docs.oracle.com/javase/jp/8/docs/api/index.html?java/lang/OutOfMemoryError.html)が
スローされる前に解放されていることが保証される。  
要するに、メモリが足りているときは参照を維持するが、メモリがいっぱいになると解放される、ということ。

ソフト参照の開放は、LRUキャッシュのような仕組みで行われる。

JVMのフラグ`-XX:SoftRefLRUPolicyMSPerMB=hoge`で頻度を指定でき、
ソフト参照への最後のアクセスから、`SoftRefLRUPolicyMSPerMB * ヒープの空きメモリMB`ミリ秒経過していた場合、参照はクリアされる。

一般的なソフト参照の用途はキャッシュ。
[Google Guavaのキャッシュ](https://github.com/google/guava/wiki/CachesExplained#reference-based-eviction)は参照に基づいた解放ポリシーを選択できる。
が、リンク先にも書かれているように、あえてこれを使うメリットはあまりない。

## 弱参照
強到達可能でもソフト到達可能でもない参照。
ソフト参照と似ているが、ソフト参照はメモリに余裕がある間は解放されないのに対し、弱参照は、ほかの参照がなければすぐにGCの対象になり、次回のGCで削除される。
基本的に複数スレッドからアクセスする場合に使うとよい。

Javaパフォーマンスの説明が秀逸だったので引用。

> 弱い参照とは、JVMに対する「ほかの誰かがまだ使っているなら、私もそのオブジェクトを利用できるようにしてください。
> 誰も使わなくなったら、破棄してしまってください。必要になった時に私が作りなおします」という意思表明です。
> 一方ソフト参照は、「メモリに余裕があって、誰かが時々にでも利用しているならそのオブジェクトを保持し続けてください」という意味です。

## ファントム参照
ファントム参照は、ファイナライズされたが、まだ解放されていないオブジェクトを指す参照。
ファイナライザーの代わりに、リソースを解放するのに使ったりする。

## ファイナル参照
ファイナライザーの実行のために使われる参照。`public`でないので普通は意識することはない。JVMが勝手にやってくれる。
`Finalizer`クラスはこれを継承している。

## ReferenceQueue
参照オブジェクトの状態が変更されたときに通知を受け取るために使う。

```java
public final class Main {

    private static class Thing {
        @Override
        public void finalize() {
            System.out.println("Finalizing!");
        }
    }

    private static void test(BiFunction<Thing, ReferenceQueue<Thing>, Reference<Thing>> create) throws InterruptedException {

        Thing t = new Thing();
        ReferenceQueue<Thing> q = new ReferenceQueue<>();
        Reference<Thing> ref = create.apply(t, q);

        // 強参照をクリアして、GCの対象にする
        t = null;

        for (int i = 0; i < 5; i++) {  // JVMの機嫌が悪いとGCされないので、何度かリトライする

            Reference<? extends Thing> r;
            System.out.println(ref.get() != null);
            // 参照がキューに入れられたか調べる
            if ((r = q.poll()) != null) {
                System.out.println(r.getClass());
                return;
            }
            System.gc();
            // GCを待つ
            Thread.sleep(1000);
        }
        System.out.println("Not polled!");
    }

    public static void main(String[] args) throws InterruptedException {
//        test(SoftReference::new);
        test(WeakReference::new);
//        test(PhantomReference::new);
    }

}
```

上記コードを動かしてみると、ソフト参照は一度もpollされないこと、弱参照とファントム参照はGC後キューに入れられるのがわかる。

この仕組みを利用して、リソースの開放をファイナライザーよりも安全に行うことができる……のだが、Guavaにこれをやるための
[FinalizableReferenceQueue](http://google.github.io/guava/releases/snapshot-jre/api/docs/index.html?com/google/common/base/FinalizableReferenceQueue.html)
クラスがあるので、それを使おう。


## そもそもなんでファイナライザーを使うべきでないのか

### ファイナライザーはいつ実行されるかわからない
GCされるタイミングで呼ばれるので、それがすぐなのか、しばらくたってなのか、永遠にされないのかわからない。

### ファイナライザーが実行されないこともある
ファイナライザーの実行は保証されていない。`System.runFinalize`はファイナライズの実行を保証しない。

> メソッドの呼び出しから制御が戻るのは、Java仮想マシンが、すべての未処理のファイナライズを**最大限まで**完了し終えたときです。

なんだそりゃ。

`System.runFinalizersOnExit`はファイナライズの実行を保証するが、デッドロックが発生する可能性があるので使ってはいけない。

> ファイナライザが**ライブ・オブジェクトに対して呼び出される**結果になる可能性があり、
> そのときにほかのスレッドがそれらのオブジェクトを並行して操作していると、動作が異常になるか、デッドロックが発生します。

### ファイナライザーは遅い
ファイナル参照が作られたり、スレッド間の同期が必要だったりするからそりゃ遅いよなあと。

### GCを阻害する可能性がある
ファイナライザーの中から、うっかり別のスレッドから自分自身への強参照を作ってしまうかもしれない。
すると当然GCされなくなるので、メモリリークを起こしてしまう……可能性がある。

> finalizeメソッドは、このオブジェクトを別のスレッドでふたたび利用可能にすることも含めて、任意のアクションを行うことができます。

finalize()のJavaDocにはこう書いてあるので、「絶対にやってはいけない」というわけではないらしいが……。

> 任意のオブジェクトについてJava Virtual Machineがfinalizeメソッドを複数回呼び出すことはありません。

このため、二回目以降GC対象になった場合は、ファイナライザーは実行されない。**怖い。**


### じゃあどうするの?
* GuavaのFinalizableReferenceを使う
* [AutoCloseable](http://docs.oracle.com/javase/jp/8/docs/api/index.html?java/lang/AutoCloseable.html)を実装して、
try-with-resources構文を使ってリソースを解放するようにする
* Effective Javaをよく読んで使う


## 参考

* Effective Java
* [Javaパフォーマンス](https://www.oreilly.co.jp/books/9784873117188/)
