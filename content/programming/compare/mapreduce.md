プログラミング言語間のMap、Reduceの方法の比較


## やっていること

1. 1から10までの数字の配列を作成
2. 偶数の値を取り出す
3. 各値を2乗
4. 合計する
5. return 220


## Java

```java
IntStream.range(1, 11)
         .filter(n -> n % 2 == 0)
         .map(n -> n * n)
         .sum();
```

## Scala

```scala
Range(1, 11).filter { _ % 2 == 0 }
            .map { n => n * n }
            .sum
```

インラインで書こうとすると`sum`が後置記法になってしまうので、代わりに`reduce`。
(一応[「慣用的かつ許容し得る」](http://yanana.github.io/scala-style/method_invocation/arity0/suffix_notation.html)らしい)

```scala
Range(1, 11) filter { _ % 2 == 0 } map { n => n * n } reduce { _ + _ }
```

[Scala的にはドットを省略するべき](http://yanana.github.io/scala-style/method_invocation/arity1/higher_order_functions.html)だそうだが、
複数行のメソッドチェーンだとエラーになってしまう。どうするのがいいんだろう...。

```scala
val seq = for (i <- 1 to 11 if i % 2 == 0) yield i * i
seq.sum
```
yieldを使う場合。


## Kotlin

```kotlin
IntRange(1, 11).filter { n -> n.mod(2) == 0 }
               .map { n -> n * n }
               .reduce { r, n -> r + n }
```


## Clojure

```clojure
(reduce (fn [r n] (+ r n))
  (map (fn [n] (* n n))
    (filter (fn [n] (= (rem n 2) 0))
      (range 1 11))))
```

マクロ

```clojure
(->> (range 1 11)
  (filter even?)
  (map #(* % %))
  (reduce #(+ %1 %2)))
```

内包表記

```clojure
(reduce #(+ %1 %2)
  (for [x (range 1 11) :when (even? x)]
    (* x x)))
```


## Python

```python
# 3系だとreduceを使うのにimportが必要
from functools import reduce

num = list(range(1, 11))
even = filter(lambda n: n % 2 == 0, num)
pow = map(lambda n: n * n, even)
res = reduce(lambda r, n: r + n, pow)
```

```python
res = sum([n * n for n in nums if n % 2 == 0])
```

内包表記を使う方がPythonっぽいんだろうか。インラインで書くのもPythonらしくない気がする。


## Ruby

```ruby
num = 1..11
even = num.select { |n| n.even? }
pow = num.map { |n| n * n }       # collect
res = pow.reduce { |r, n| r + n } # inject
```

なんで同機能の異名メソッドがあるんですか(激怒)


## PHP

```php
$arr = range(1, 10); // inclusive
$even = array_filter($arr, function ($n) {
    return $n % 2 == 0;
});
$pow = array_map(function ($n) {
    return $n * $n;
}, $even);
// use array_sum() in production!
$res = array_reduce($pow, function ($rest, $n) {
    return $rest + $n;
});
```


### 参考
* [配列(リスト)から特定の条件にマッチする要素のみを取り出すには](https://hydrocul.github.io/wiki/programming_languages_diff/list/filter.html)
* [map と collect、reduce と inject ―― 名前の違いに見る発想の違い](http://magazine.rubyist.net/?0038-MapAndCollect)