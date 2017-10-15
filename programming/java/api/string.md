## 基本

文字列を表す基本的なクラス。

```java
String string = "文字列";
```

Stringクラスは不変である。  
例えば、`toUpperCase()`のようなメソッドを呼び出しても、そのインスタンスが保持している文字列は変化しない。  

```java
String small = "abc";
small.toUpperCase();
System.out.println(small); // "abc"
String large = small.toUpperCase();
System.out.println(large); // "ABC"
```

ありがちなので初心者は注意。


## 等価の判定
```java
String str1 = "abc";
String str2 = "def";

str1 == str2;      // ×
str1.equals(str2); // 〇
```
==演算子は参照を調べるので、文字列の比較には必ず`equals()`メソッドを使う。  
演算子オーバロードがない最大の欠点。  
プーリングのおかげで一見うまく動いているように見えることもあるので、初心者は注意。  


## JVMによるStringのプール

JVMはStringオブジェクトをプールして高速化を図っている。  
`new String("hoge")`では新しいインスタンスが作成されてしまうため、あまり好ましくないとされている。  
プールされているオブジェクトであることを保障したい場合、`intern()`メソッドを呼び出す。  
(が、パフォーマンスはあまりよくないらしい)  


## StringBuilder
+演算子によるStringの結合を繰り返し行うのはパフォーマンス上好ましくないので、StringBuilderクラスを使う。

 ```java
  StringBuilder builder = new StringBuilder()
          .append("hello")
          .append(", ")
          .append("world");
  String hello = builder.toString(); // hello, world
```

append()メソッドは自インスタンスを返すので、連続して結合を書いていくことが出来る。  

StringBufferも同様の機能を持つクラスだが、StringBuilderを使うよう推奨されている。  
なお、StringBufferはスレッドセーフでStringBuilderはスレッドセーフでないという違いがある。  


## StringJoiner
区切り文字を使って文字列を結合するためのクラス。JDK8で追加された。  
これでもうループやGuavaのJoinerに頼る必要がなくなった。  

```java
StringJoiner joiner = new StringJoiner("-", "[", "]");
joiner.add("a").add("b").add("c");
joiner.toString(); // [a-b-c]
```

`add(null)`を呼び出した場合、`"null"`という文字列が追加される。  
GuavaのJoinerはnullの場合の動作を調整できるので、完全な置き換えというわけにはならない。  

なお、同時にString自体にもjoinメソッドが追加されている。  

```java
String str = String.join("-", "a", "b", "c"); // a-b-c 
```


## 古いクラス
下記のものは互換性のために残されている古いクラスなので、基本的には使わない。  

| 古いクラス      | 代わりに使うべきもの                  |
|:----------------|:--------------------------------------|
| StringTokenizer | split()メソッドまたはMatcherとPattern |
| StringBuffer    | StringBuilder                         |


## ヨーダ記法

```java
if ("hoge".equals(str)) {
    // ...
}
```

みたいなやつ。  
strがnullでも安全に比較できる。  
老害の書き方なので真似してはいけない(初めからnullにならないようにコーディングすべき)。  
