Technical interview解説シリーズ第二弾。一年半遅れて書き上げた。
なお、自分はHaskellはできないので`Typing the technical interview`の解説は永遠に来ない。

[Hexing the technical interview](https://aphyr.com/posts/341-hexing-the-technical-interview)


## 注意事項
コードの著作権は全てオリジナル作者のものです。
何か間違いがあったら私のせいです。



## 北の国から

`Svalbard` [スヴァールバル諸島](https://ja.wikipedia.org/wiki/%E3%82%B9%E3%83%B4%E3%82%A1%E3%83%BC%E3%83%AB%E3%83%90%E3%83%AB%E8%AB%B8%E5%B3%B6)。ノルウェー領。

`Vidrun`はノルウェーの女性の名前だそう。


> ヴィドルン、松の間を吹き抜ける海風に生まれ、  
> ヴィドルン、緑の私の枝の分身、わが人生の喜びと労苦、  
> ヴィドルン、強く賢い子よ、我らが一族の知恵をあなたに授けましょう。  
>
> Hacker Newsを読むことなかれ

元ネタはわからなかった。知っている人教えてください。


## old riddle

ここでいう`old riddle`はあとで登場する[フロイドの循環検出法](https://ja.wikipedia.org/wiki/%E3%83%95%E3%83%AD%E3%82%A4%E3%83%89%E3%81%AE%E5%BE%AA%E7%92%B0%E6%A4%9C%E5%87%BA%E6%B3%95)の説明になっている。後述。


## MutableLinkedList

```clojure
(deftype MutableLinkedList [value next]
  clojure.lang.Seqable
  (seq [_]
    (lazy-seq (cons value (seq @next)))))

(defn node [value]
  (MutableLinkedList. value (atom nil)))

(defn link! [node next]
  (reset! (.next node) next)
  next)
```

前回とは違い、かなりわかりやすいものではある。
型`MutableLinkedList`は値と次のノードへのポインターをフィールドに持つ。
`clojure.lang.Sequable`は`ISeq`を返す`seq()`メソッドを持っているインターフェース。
次ノードはそれ自体`Sequable`であるので、`cons`で`value`と結合して一つのシーケンスへ。
今回は循環が起きる可能性があるので、無限に呼び出さないように遅延シーケンスで包む。

`node`関数は次ノードへの参照が`null`なアトムを持つ`MutableLinkedList`インスタンスを作る。ほぼコンストラクターを呼び出すだけ。

`link!`がノードを結合するための関数。`node`の`next`フィールドの参照を`reset!`で引数`next`に書き換える。
引数`next`を返すことで、まとめて`reduce`することで連結可能にしている。



## a portal to the underworld

`gen-class`でバイト配列を読むためのクラスローダーを作る。クラス名の`Arb`はどう意味なのだろうか。

コンストラクターでクラス名とバイト配列を受け取り、
`loadClass`メソッドのオーバライドで、クラス名が一致する場合にそのバイトを`defineClass`する。
このあたりの動きは[Javaの一般的なクラスローダー](https://docs.oracle.com/javase/jp/8/docs/api/java/lang/ClassLoader.html)と同じため、詳しくない方はそちらを参照されたし。

`run-bytecode`もほぼほぼストレートなコード。
クラスローダーでバイト配列を読み込み、`Class`インスタンスを手に入れる。
リフレクションで指定名のメソッドを探して呼び出す。
`invoke`の第一引数はインスタンスへの参照であり、staticメソッドを呼び出す場合`null`を指定する。今回はstatic固定という事である。



## ご注文はClojureですか?

Javaクラスファイルのバイト配列を作っていく。

```
(def racer
  (->> [0xca 0xfe 0xba 0xbe
```

`CAFEBABE`はJavaクラスファイルの最初であることを示すマジックナンバー。[由来についてはこちら。](https://stackoverflow.com/questions/2808646/why-are-the-first-four-bytes-of-the-java-class-file-format-cafebabe)

本文中で言われているように、バージョン49はスタックマップを利用しない最後のバージョン。
非常に面倒くさいので、バイトコード手書きするときはこのバージョンを使うのが良い。ちなみにASMは自動生成する機能を持つ。

> Remember the future. This is a common trick for protocol wizards, many of whom live as Merlin did, writing constants and buffer sizes before (after) having written (unwritten) the buffers themselves. Recall that 22 sufficed then. Write that down.

なんてこった。wizardへの道はかくも険しい。


### JVMの中には妖精が住んでいる

[仕様書に書いてあるように](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.1)、コンスタントプールカウントは必要数に+1しなければならない。

> The value of the constant_pool_count item is equal to the number of entries in the constant_pool table plus one.

javanissenはJVMの中に住む妖精。
[ノルウェー語でサンタクロースをJulenissen](https://translate.google.co.jp/?hl=ja&authuser=0#ja/no/%E3%82%B5%E3%83%B3%E3%82%BF%E3%82%AF%E3%83%AD%E3%83%BC%E3%82%B9)と呼ぶらしいので、それに掛けている模様。
一瞬Sunタクロ－スと訳そうかと思ったがさすがに寒いと思ってやめた。
別に本当にJava妖精のために定数プールカウントを+1しなければならないわけではないだろうが、理由は仕様書には書かれていなかった。不思議だ。

定数プールの中身はただの定数プールなので省略。


```
        0x00 0x09                 ; Flags: public & static
        0x00 0x15                 ; Method name (21, "Code")
```

`Code`という名前の`public`, `static`なメソッドを定義。
`Code`なのは`Code`属性で使う定数プールを再利用するためらしいのだが、だったらクラス名も再利用しろよとかそんなところ節約してどうするとか思わないでもない。
シグネチャは`(Ljava/lang/Iterable;)Z`。`Z`は戻り値`boolean`([参照](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.3.2-200))。


### フロイドの循環検出法

いよいよメソッドのコード属性に入るのだが、その前に今回、ループの検出に使用されている、『[フロイドの循環検出法](https://ja.wikipedia.org/wiki/%E3%83%95%E3%83%AD%E3%82%A4%E3%83%89%E3%81%AE%E5%BE%AA%E7%92%B0%E6%A4%9C%E5%87%BA%E6%B3%95)』について復習。

このアルゴリズムは別名『ウサギとカメのアルゴリズム』と呼ばれる通り、「速い」ポインターと「遅い」ポインターの二つを用意する。
ポインターを前に進めて順番に探索していくのだが、「速い」ポインターは一度に二倍の速度で進む。
もしリストが循環していれば、いつかの時点で「速い」ポインターが「遅い」ポインターに追いつき、同じ個所を指すようになる。
もしリストが循環していなければ、ポインターはリストの終わりにたどり着く。

Kotlinで適当に書くとこんな感じ。

```kotlin
fun isCycle(iterable: Iterable<*>) = isCycle(iterable.iterator(), iterable.iterator())

fun isCycle(fastIterator: Iterator<*>, slowIterator: Iterator<*>): Boolean {
    if (!fastIterator.hasNext()) return false
    fastIterator.next()
    if (!fastIterator.hasNext()) return false
    if (fastIterator.next() == slowIterator.next()) return true
    return isCycle(fastIterator, slowIterator)
}
```

なお、`Jorunn`および`Bjørn`はそれぞれおノルウェーの女性名および男性名だそう。

今回のバイトコードも、やっていることはこれとほぼ同じである。

```
        0x2a ; aload_0 (take arg)

        0xb9 ; invokeinterface
        0x00
        0x0a ; .iterator()
        0x01 ; 1 arg
        0x00 ; unused

        0x4d ; astore_1  (store iterator)
```

引数の`Iterable`を読み取る。`iterator()`メソッドを呼び`Iterator`を変数1に保存。こちらが早いほうのポインターとなる。
同じ処理を繰り返し、変数0に遅いポインターとして保存。
`Iterable`はもう使わないので、上書いてしまって問題ない。

本文中では`1 arg`とコメントされているが、これはオペランドスタックの`objectref`、すなわち呼び出し先のインターフェース(この場合`Iterator`)を指す。

```
invokeinterface
indexbyte1
indexbyte2
count
0
```

なので`1 arg`という表現は少々違和感がある(メソッドの引数ではないので)。


続いて`hasNext()`をほぼ同様のコードで呼び出し、結果をチェック。

```
        0x9a ; ifne
        0x00
        0x05 ; jump ahead 3 if we have a next element

        0x03 ; iconst_0
        0xac ; ireturn (return false)
```

`ifne`はオペランドスタックの値が0でないことを確かめ、その場合指定の数のバイト分、インストラクションポインターを進める。

よく知られるように、JVMは`boolean`型を持たず、`int`型に変換される。
`0`が`false`で、`1`が`true`である。

[2.3.4. The `boolean` Type](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.3.4)

もし`hasNext()`の結果が`0`すなわち`false`でなかった(=`hasNext() == true`)場合、スキップして次の処理へ。
`hasNext()`が偽の場合、リストの終端に達したという事なので、`ireturn`で`0`(`false`)を返す。

「速い」イテレーターは二回実行するので、ほぼ同様の処理を繰り返す。


「速い」イテレーター「遅い」イテレーター双方の`next()`メソッドを呼び出し、スタックに乗せていく。
その後`if_acmpne`命令を呼び出す。これは2つのオペランドの参照が等しくないことを確認する命令。

二つのイテレーターが指すオブジェクトが等しければ、それはリストが循環しているという事を指すので、`iconst_1 ireturn`で`true`を返す。
そうでなければもう一度処理を繰り返す。


最後にこの巨大なバイトのベクターをバイト配列に変換するメソッドを定義し、プログラムが完成する。



## テスト

```
(deftest cycle-test
  (let [cycle? (partial run-bytecode
                        (class-bytes racer)
                        "cycle_detector.core.Racer"
                        "Code"
                        [Iterable])]
    (is (boolean (cycle? (seq list))))
    (is (not (boolean (cycle? []))))
    (is (not (boolean (cycle? [1 2 3]))))))))
```

`Code`はバイトコードの中で定義したメソッド名。

`partial`は関数に部分適用するためのマクロ。`cycle?`は実質的に`Code`の呼び出しに等しい。

あと自分の環境ではネストされた同名の`deftest`はうまく動作しなかった。名前を変更すれば問題なかった。



## 感想

なんというか最初は圧倒されたのだけれども、一つ一つゆっくり考えていけば、意外と理解できるものである。
あとjavacは`-g:none`フラグで行番号を出力しないようできるので、数バイトを節約したいときはぜひ利用してみてはいかがだろうか。そんな場合があるかは知らないが。
