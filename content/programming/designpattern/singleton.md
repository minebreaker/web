
## Singletonパターン

Singletonはあるクラスのインスタンスを一つに限定するデザインパターン。  
恐らく一番有名なデザインパターンであり、一番簡単であり、一番よく使われていると思う。  

```java
public class Foo {
 
    private static final Foo singleton = new Foo();
 
    private Foo() {
        // initialize
    }
 
    public static Foo getInstance() {
        return singleton;
    }
 
    // do something...
 
}
```

これは一番一般的でよく使われるパターン。  
プライベートコンストラクタ―を一つだけ持つことで、インスタンス化を抑制している。  
インスタンスの取得は静的なgetInstanceメソッドを通して行う。  
静的なフィールドに一つだけオブジェクトが保持される仕組み。  

シリアライズ可能なオブジェクトの場合、復元時に新しいオブジェクトが生成されてしまう。  
readResolveによってデシリアライズされたオブジェクトを隠蔽し、シングルトンインスタンスを返却する。  
...のだが、シングルトンをシリアライズしたい場面が僕には思い浮かばないので実践したことはない。  

```java
@Override
public Object readResolve() throws ObjectStreamException {
    return INSTNACE; // シングルトンインスタンスを返却する
}
```

このパターンは、マルチスレッド下で同時にgetInstanceが呼ばれたとき、インスタンスを複数生成してしまう。  
スレッドセーフにする一番簡単な方法はgetInstanceをsynchronizedにすることだが、
一度インスタンスを生成した後はパフォーマンスの妨げになってしまう。  

```java
public class Foo {
 
    private Foo() {}
 
    private static class InstanceHolder {
        private static final Foo instance = new Foo();
    }
 
    private static Foo getInstance() {
        return InstanceHolder.instance;
    }
 
}
```

Javaでは、静的フィールドの初期化が、クラスローダーがクラスを読み込むとき、同期されて行われることを利用した手法。  
これならスレッドセーフかつ、パフォーマンスの劣化がない。  

```java
public enum Foo {
    INSTANCE;
 
    public void doSomething() { /* ... */ }
 
}
```

Effective Javaに紹介されているパターン。  
列挙体はインスタンスが一つだけで、スレッドセーフで、おまけにシリアライズも可能。  
...だがあまり有名でないのか見たことはない。  

```java
public class Foo {
 
    private static Foo singleton = null;
 
    private Foo() {
        // very long initialization
    }
 
    public static Foo getInstance() {
        if (singleton == null) {
            singleton = new Foo();
        }
 
        return singleton;
    }
 
}
```

遅延初期化されるパターン。  
通常ならフィールドはクラスが初めて使用されたときに初期化されるが、
この例ではgetInstanceを呼ぶまで初期化されない。  
...しかしシングルトンなら大抵最初に呼ばれるのはgetInstanceのはずなので、
あまりうれしくない気がする。  
(JVMはクラスに初めてアクセスするときに、フィールドを初期化する)  

## Singletonを避けるべきか?

シングルトンは便利な一方で、嫌っている人も多い。  
主な理由は、シングルトンが単体テストと相性が良くないことと、手続き的な考え方と相性がいいこと。  

シングルトンはstaticおじさん達の友達である。  
インスタンスが一つしかないことを「全部staticみたいなもの」と捉え、
オブジェクト指向的な考え方を避けるための逃げ道として利用してしまう。  
当然出来上がるコードはクソなので、目も当てられないことになる。  
とくにシングルトンインスタンスが可変オブジェクトだった場合、
それは実質的にグローバル変数と変わらない。悲劇である。  

もっとまじめな理由ももちろんあり、  

* 拡張が難しい
* 結合度が高まる

などがあげられる。  

### 拡張が難しい
シングルトンは常に同一のインスタンスなので(当たり前)、実装を変更することが出来ない。  
グローバルオブジェクトに状態を持たせるのは嫌だなあ。

### 結合度が高まる
シングルトンインスタンスを利用するクラスは、必然的にHoge.getInstance()をハードコーディングすることになる。  
テストのために実装を入れ替えたりすることが出来ない。  
こうした理由から、シングルトンはアンチパターンと言われることも多い。  

## じゃあどうするの?
以上の問題はオブジェクトがシングルトンであることそれ自体にあるのではなく、Singletonパターンに固有のもの。  
従って、Dependecy Injectionパターンを使って疎結合なプログラムを実現すればよい。  

```java

// Java EE CDI
@ApplicationScoped
// EJB
@Singleton
// Guice
@Singleton
public class Foo {
}
```

[大混乱に陥っているJavaEE 6のアノテーションに関する使い分けについて](http://d.hatena.ne.jp/ryoasai/20101010/1286677038)  
[Difference between @Stateless and @Singleton](https://stackoverflow.com/questions/14464823/difference-between-stateless-and-singleton)  
ひえっ

[シングルトンの賢い使用法](http://www.ibm.com/developerworks/jp/webservices/library/co-single.html)  
なかなか参考になる記事なので、ぜひご一読を。  
