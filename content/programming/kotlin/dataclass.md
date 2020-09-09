[データクラス](https://kotlinlang.org/docs/reference/data-classes.html)は「値」を表すクラスを簡単に作るための仕組み。
Lombokに慣れている人には`@Value`アノテーションを付けた感じと説明すればわかりやすいか。

データクラスには以下の機能が提供される。

* `equals()`と`hashCode()`
* `toString()`
* `componentN()` ([分割](https://kotlinlang.org/docs/reference/multi-declarations.html)に使われる)
* `copy()`

`copy()`は不変データを扱うとても便利な機能なので、ぜひ知っておきたい。


## バイトコード

元コード

```kotlin
data class Sample(
        val property: Int,
        val nullable: String? = null) {

    val computed: String?
        get() = nullable?.toUpperCase()

}
```

* Kotlin 1.2.10
* javap 9

```
   #11 = Fieldref           #2.#10        // dataclass/Sample.nullable:Ljava/lang/String;
   #40 = Fieldref           #2.#39        // dataclass/Sample.property:I
```

プロパティーはgetter、setterにコンパイルされる。
`computed`に対するフィールドは作られていないことがわかる。賢い。

```
  public final java.lang.String getComputed();
    descriptor: ()Ljava/lang/String;
    flags: (0x0011) ACC_PUBLIC, ACC_FINAL
    Code:
      stack=4, locals=2, args_size=1
         0: aload_0
         1: getfield      #11                 // Field nullable:Ljava/lang/String;
         4: dup
         5: ifnull        36
         8: astore_1
         9: aload_1
        10: dup
        11: ifnonnull     24
        14: new           #13                 // class kotlin/TypeCastException
        17: dup
        18: ldc           #15                 // String null cannot be cast to non-null type java.lang.String
        20: invokespecial #19                 // Method kotlin/TypeCastException."<init>":(Ljava/lang/String;)V
        23: athrow
        24: invokevirtual #24                 // Method java/lang/String.toUpperCase:()Ljava/lang/String;
        27: dup
        28: ldc           #26                 // String (this as java.lang.String).toUpperCase()
        30: invokestatic  #32                 // Method kotlin/jvm/internal/Intrinsics.checkExpressionValueIsNotNull:(Ljava/lang/Object;Ljava/lang/String;)V
        33: goto          38
        36: pop
        37: aconst_null
        38: areturn
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      39     0  this   Ldataclass/Sample;
      LineNumberTable:
        line 8: 0
        line 8: 38
      StackMapTable: number_of_entries = 3
        frame_type = 255 /* full_frame */
          offset_delta = 24
          locals = [ class dataclass/Sample, class java/lang/String ]
          stack = [ class java/lang/String ]
        frame_type = 255 /* full_frame */
          offset_delta = 11
          locals = [ class dataclass/Sample ]
          stack = [ class java/lang/String ]
        frame_type = 65 /* same_locals_1_stack_item */
          stack = [ class java/lang/String ]
    RuntimeInvisibleAnnotations:
      0: #7()
```

ちょっと冗長だがまぁ普通なコードだと思う。

```
  public final int getProperty();
    descriptor: ()I
    flags: (0x0011) ACC_PUBLIC, ACC_FINAL
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #40                 // Field property:I
         4: ireturn
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Ldataclass/Sample;
      LineNumberTable:
        line 4: 0

  public final java.lang.String getNullable();
    descriptor: ()Ljava/lang/String;
    flags: (0x0011) ACC_PUBLIC, ACC_FINAL
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #11                 // Field nullable:Ljava/lang/String;
         4: areturn
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Ldataclass/Sample;
      LineNumberTable:
        line 5: 0
    RuntimeInvisibleAnnotations:
      0: #7()
```

フィールドを返しているだけ。

```
  public dataclass.Sample(int, java.lang.String);
    descriptor: (ILjava/lang/String;)V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=3, args_size=3
         0: aload_0
         1: invokespecial #45                 // Method java/lang/Object."<init>":()V
         4: aload_0
         5: iload_1
         6: putfield      #40                 // Field property:I
         9: aload_0
        10: aload_2
        11: putfield      #11                 // Field nullable:Ljava/lang/String;
        14: return
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      15     0  this   Ldataclass/Sample;
            0      15     1 property   I
            0      15     2 nullable   Ljava/lang/String;
      LineNumberTable:
        line 3: 0
    RuntimeInvisibleParameterAnnotations:
      parameter 0:
      parameter 1:
        0: #7()
```

コンストラクター。普通にフィールドに値を設定しているだけ。

```
  public dataclass.Sample(int, java.lang.String, int, kotlin.jvm.internal.DefaultConstructorMarker);
    descriptor: (ILjava/lang/String;ILkotlin/jvm/internal/DefaultConstructorMarker;)V
    flags: (0x1001) ACC_PUBLIC, ACC_SYNTHETIC
    Code:
      stack=3, locals=5, args_size=5
         0: iload_3
         1: iconst_2
         2: iand
         3: ifeq          11
         6: aconst_null
         7: checkcast     #21                 // class java/lang/String
        10: astore_2
        11: aload_0
        12: iload_1
        13: aload_2
        14: invokespecial #48                 // Method "<init>":(ILjava/lang/String;)V
        17: return
      LineNumberTable:
        line 5: 6
      StackMapTable: number_of_entries = 1
        frame_type = 11 /* same */
```

もう一つのコンストラクター。`DefaultConstructorMarker`なる謎の引数がある。
[ソースコード](https://github.com/JetBrains/kotlin/blob/master/core/runtime.jvm/src/kotlin/jvm/internal/DefaultConstructorMarker.java)
を覗いてみると、中身が何もない名前通りのマーカーであることがわかる。
調べたところ、どうやらsealedクラスを実装するための仕組みであるらしい。

`DefaultConstructorMarker`はパッケージプライベートで、プライベートなコンストラクター一つのみをもつ。
そのためパッケージの違うクラスがコンストラクターの引数として`DefaultConstructorMarker`を持つことは、
javacではコンパイルエラーになる(importが出来ない)。
しかしバイトコードのシグネチャは完全修飾されておりそのような制限はない。
そのため、Javaからこのコンストラクターを呼び出すことは絶対にできない仕組みとなっている。

参考: [Shibuya.apkでkotlinのsealed classをJavaから見た時のsealed具合について話してきました](http://developer.diverse-inc.com/entry/2017/12/14/121410)

じゃあなんで普通のクラスにも生成されるのだろう。よくわからない。。。

```
  public final int component1();
    descriptor: ()I
    flags: (0x0011) ACC_PUBLIC, ACC_FINAL
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #40                 // Field property:I
         4: ireturn
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Ldataclass/Sample;

  public final java.lang.String component2();
    descriptor: ()Ljava/lang/String;
    flags: (0x0011) ACC_PUBLIC, ACC_FINAL
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: getfield      #11                 // Field nullable:Ljava/lang/String;
         4: areturn
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Ldataclass/Sample;
    RuntimeInvisibleAnnotations:
      0: #7()
```

上で述べたように分割宣言で使われる`componentN()`。
やっていること自体はただのgetterと変わらない。

```
  public final dataclass.Sample copy(int, java.lang.String);
    descriptor: (ILjava/lang/String;)Ldataclass/Sample;
    flags: (0x0011) ACC_PUBLIC, ACC_FINAL
    Code:
      stack=4, locals=3, args_size=3
         0: new           #2                  // class dataclass/Sample
         3: dup
         4: iload_1
         5: aload_2
         6: invokespecial #48                 // Method "<init>":(ILjava/lang/String;)V
         9: areturn
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      10     0  this   Ldataclass/Sample;
            0      10     1 property   I
            0      10     2 nullable   Ljava/lang/String;
    RuntimeInvisibleAnnotations:
      0: #53()
    RuntimeInvisibleParameterAnnotations:
      parameter 0:
      parameter 1:
        0: #7()

  public static dataclass.Sample copy$default(dataclass.Sample, int, java.lang.String, int, java.lang.Object);
    descriptor: (Ldataclass/Sample;ILjava/lang/String;ILjava/lang/Object;)Ldataclass/Sample;
    flags: (0x1049) ACC_PUBLIC, ACC_STATIC, ACC_BRIDGE, ACC_SYNTHETIC
    Code:
      stack=3, locals=5, args_size=5
         0: iload_3
         1: iconst_1
         2: iand
         3: ifeq          11
         6: aload_0
         7: getfield      #40                 // Field property:I
        10: istore_1
        11: iload_3
        12: iconst_2
        13: iand
        14: ifeq          22
        17: aload_0
        18: getfield      #11                 // Field nullable:Ljava/lang/String;
        21: astore_2
        22: aload_0
        23: iload_1
        24: aload_2
        25: invokevirtual #57                 // Method copy:(ILjava/lang/String;)Ldataclass/Sample;
        28: areturn
      StackMapTable: number_of_entries = 2
        frame_type = 11 /* same */
        frame_type = 10 /* same */
    RuntimeInvisibleAnnotations:
      0: #53()
```

Kotlinでは便利な`copy()`メソッドも、Javaから呼び出すときは全然嬉しくない。
`$`はバイトコードでは有効な識別子だが、Java言語では許されていないため、この関数を呼び出すことは不可能。

1番目の引数は恐らくコピー元のインスタンスが渡されるように見える。
普通のメソッドではなく、何故staticメソッドにしたのかは不明。
2番目、3番目の`int`、`String`はコンストラクターのシグネチャ。更新したい値が渡される。
4番目のintはビットフラグで、コピーすべきフィールドを指定している。
最後のObjectは謎。使われる条件があるのかもしれない。
コピーすべき値をローカル変数に読み込み終わると、staticでないほうの`copy()`を呼び、実際のコピーのインスタンスを作る。

```
  public java.lang.String toString();
    descriptor: ()Ljava/lang/String;
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=1, args_size=1
         0: new           #60                 // class java/lang/StringBuilder
         3: dup
         4: invokespecial #61                 // Method java/lang/StringBuilder."<init>":()V
         7: ldc           #63                 // String Sample(property=
         9: invokevirtual #67                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
        12: aload_0
        13: getfield      #40                 // Field property:I
        16: invokevirtual #70                 // Method java/lang/StringBuilder.append:(I)Ljava/lang/StringBuilder;
        19: ldc           #72                 // String , nullable=
        21: invokevirtual #67                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
        24: aload_0
        25: getfield      #11                 // Field nullable:Ljava/lang/String;
        28: invokevirtual #67                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
        31: ldc           #74                 // String )
        33: invokevirtual #67                 // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
        36: invokevirtual #76                 // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
        39: areturn

  public int hashCode();
    descriptor: ()I
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=3, locals=1, args_size=1
         0: aload_0
         1: getfield      #40                 // Field property:I
         4: invokestatic  #82                 // Method java/lang/Integer.hashCode:(I)I
         7: bipush        31
         9: imul
        10: aload_0
        11: getfield      #11                 // Field nullable:Ljava/lang/String;
        14: dup
        15: ifnull        24
        18: invokevirtual #84                 // Method java/lang/Object.hashCode:()I
        21: goto          26
        24: pop
        25: iconst_0
        26: iadd
        27: ireturn
      StackMapTable: number_of_entries = 2
        frame_type = 255 /* full_frame */
          offset_delta = 24
          locals = [ class dataclass/Sample ]
          stack = [ int, class java/lang/String ]
        frame_type = 255 /* full_frame */
          offset_delta = 1
          locals = [ class dataclass/Sample ]
          stack = [ int, int ]

  public boolean equals(java.lang.Object);
    descriptor: (Ljava/lang/Object;)Z
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=3, args_size=2
         0: aload_0
         1: aload_1
         2: if_acmpeq     50
         5: aload_1
         6: instanceof    #2                  // class dataclass/Sample
         9: ifeq          52
        12: aload_1
        13: checkcast     #2                  // class dataclass/Sample
        16: astore_2
        17: aload_0
        18: getfield      #40                 // Field property:I
        21: aload_2
        22: getfield      #40                 // Field property:I
        25: if_icmpne     32
        28: iconst_1
        29: goto          33
        32: iconst_0
        33: ifeq          52
        36: aload_0
        37: getfield      #11                 // Field nullable:Ljava/lang/String;
        40: aload_2
        41: getfield      #11                 // Field nullable:Ljava/lang/String;
        44: invokestatic  #90                 // Method kotlin/jvm/internal/Intrinsics.areEqual:(Ljava/lang/Object;Ljava/lang/Object;)Z
        47: ifeq          52
        50: iconst_1
        51: ireturn
        52: iconst_0
        53: ireturn
      StackMapTable: number_of_entries = 4
        frame_type = 252 /* append */
          offset_delta = 32
          locals = [ class dataclass/Sample ]
        frame_type = 64 /* same_locals_1_stack_item */
          stack = [ int ]
        frame_type = 250 /* chop */
          offset_delta = 16
        frame_type = 1 /* same */
```

`toString()`、`hashCode()`、`equals()`に特別な点は何もない。

`hashCode()`は各フィールドの`hashCode()`を呼び出していく。
31を掛けたり加算したりしている計算式の妥当性は不明。誰か教えて。
プリミティブ型は対応するラッパークラスのstaticな`hashCode()`を呼んでいる。
生成規則は仕様に定められていないようなので、将来にわたり変更されないは限らない(そんなことは起きないだろうが)。

`equals()`はまじめに各フィールドの値を比較していく、模範的なコード。
