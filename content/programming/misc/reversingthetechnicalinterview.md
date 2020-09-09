[Reversing the technical interview](https://aphyr.com/posts/340-reversing-the-technical-interview)の解説。  
平凡な三流SE(笑)の自分には難しすぎたので、解説という体を取りつつ理解しようとしてみる。

## 注意事項
コードの著作権は全てオリジナル作者のものです。
何か間違いがあったら私のせいです。

## LinkedList
```clojure
(defn cons [h t] #(if % h t))
```

**「ただのif文じゃん」** と言ったのは面接官だけではなかったみたいだorz  
`#(if % h t)`は匿名関数を作るマクロで、「引数がtrueであればhを、そうでなければtを返す」関数。  
`cons`の引数はクロージャ―に包み込まれて、リストに値を保存する。  

```clojure
(def x (cons 1 (cons 2 nil)))
```
つまり、`x`を関数として呼び出したとき、引数が`true`であれば、`x`を宣言した時の`cons`の第一引数を返し、
そうでなければ第二引数、すなわちリストの次の`(cons ...)`を返す。
終端は`nil`で表している。

[*Ursula K. Le Guin* **アーシュラ・K・ル=グウィン**](https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%BC%E3%82%B7%E3%83%A5%E3%83%A9%E3%83%BBK%E3%83%BB%E3%83%AB%EF%BC%9D%E3%82%B0%E3%82%A6%E3%82%A3%E3%83%B3)  
アメリカの作家。「ゲド戦記」で有名。  
K言語は[プログラミングのK言語](https://en.wikipedia.org/wiki/K_(programming_language))と彼女の名前を掛けたのだと思われる。ゲド戦記読んだことがないので詳細情報求ム。

```clojure
(defn nth [l n]
  (when l (if (= 0 n)
            (l true)
            (recur (l false) (dec n)))))
```
```clojure
user=> (nth (cons 1 (cons 2 nil)) 1)
2
```
引数`l`にリストを渡し、`n`に何番目の値が欲しいのかを渡す。  
`n = 0`になるまで再帰的に次のリストを読み込んでいく。  

`recur`は[末尾最適化](https://ja.wikipedia.org/wiki/%E6%9C%AB%E5%B0%BE%E5%86%8D%E5%B8%B0#.E6.9C.AB.E5.B0.BE.E5.91.BC.E5.87.BA.E3.81.97.E6.9C.80.E9.81.A9.E5.8C.96)するためのClojureのイディオム。  
```clojure
(defn hoge [x] (if (= 0 x) x (recur (dec x))))
(defn piyo [x] (if (= 0 x) x (piyo (dec x))))

user=> (piyo 100000)
StackOverflowError   clojure.lang.Numbers.equal (Numbers.java:216)
user=> (hoge 100000)
0
```
自身の関数名を指定すると通常のJavaのメソッド呼び出しに変換されるため、スタックオーバーフローになる。  
recurを使うと末尾最適化されているのがわかる。


[`when`マクロ](https://clojuredocs.org/clojure.core/when)を使用している理由は不明。

```clojure
user=> (macroexpand '(when l (if (= 0 n) (l true) (recur (l false) (dec n)))))
(if l (do (if (= 0 n) (l true) (recur (l false) (dec n)))))
```
`when`は`(if ... (do ...))`に展開されるのだが、この場合`do`の中身はif文一つなので特に意味はない……はず。ifが二重にネストするのを避けたのだろうか?

## Pythonみたいな普通のリスト
LISPerなら副作用くらいで歯ぎしりしたりしないと思う。Haskell原理主義者ならともかく。
```clojure
(defn prn-list [l]
  (print "(")
  (loop [l l]
    (if (nil? l)
      (print ")\n")
      (do (print (l true))
          (when (l false)
            (print " "))
          (recur (l false))))))
```
`loop`は`recur`の再帰呼び出し先になる特殊形式。リストの先頭の(print "(")のためにわざわざ`l`を`l`に束縛するという非常に気持ち悪いことをやっている。なるほど、歯ぎしりしたくなるわ。  
リストが`nil`になるまで再帰的に`(do ...)`を繰り返す。  
まず`(print (l true))`でリストの中身を取り出し表示。さらに`(when (l false) ...)`でリストが次の値を持っている場合、空白を出力する。
ここでも`if`ではなく`when`を使っている理由は不明。
そして最後に、その次のリストを引数に、`loop`を再帰呼び出しする。

## 今後のご活躍をお祈り申し上げます
```clojure
(defn reverse [l]
  (loop [r nil, l l]
    (if l
      (recur (cons (l true) r) (l false))
      r)))
```
Clojureのベクターが[任意の位置でカンマ区切りできる](https://forum.freecodecamp.com/t/clojure-vectors/18421)ことを初めて知った……。

面構えが厳ついのでたじろいでしまうが、やっていることは普通の連結リストを再帰的に逆転させるときと同じ。  
`r`が元のリストの次の値で、`l`が現在の値。最初は当然nilとhead。  
`(cons (l true) r)`で現在の値と次の値を反転させる。
この新しいリストと、`(l false)`の「次のノード」を「直前のリスト、現在のリスト」として再帰呼び出しを行う。リストがnilになったところで、「直前のリスト」は反転の終わったリストになっている。

## 感想
すごい(小並感)
