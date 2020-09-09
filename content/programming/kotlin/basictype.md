KotlinにはJavaでいうプリミティブ型とそのラッパーという区別はなく、
「基本型」(この訳語が正しいかは知らない)という特別な型が用意されている。

[Kotlinの仕様](https://kotlinlang.org/docs/reference/basic-types.html#representation)によると、JVMプラットフォームにおいて基本型は、

* nullableでなく(`Int?`)
* ジェネリクスでない場合

プリミティブ型に変換される。


## 実際のところどうなるのか、検証してみた

* Kotlin: 1.2.10
* javap: JDK9

```kotlin
fun sample1(): Int {
    return 123
}

fun sample2(): Int {
    return Integer.valueOf(123)
}

fun sample3(): Integer {
    return Integer.valueOf(123) as Integer
}

fun main(args: Array<String>) {
    val s1: Int = sample1()
    val s2: Integer = sample2() as Integer
    val s3: Int = sample3() as Int
}
```
まずはラッパークラスとKotlinの基本型の相互変換を試す。

```
{
  public static final int sample1();
    descriptor: ()I
    flags: (0x0019) ACC_PUBLIC, ACC_STATIC, ACC_FINAL
    Code:
      stack=1, locals=0, args_size=0
         0: bipush        123
         2: ireturn
      LineNumberTable:
        line 4: 0

  public static final int sample2();
    descriptor: ()I
    flags: (0x0019) ACC_PUBLIC, ACC_STATIC, ACC_FINAL
    Code:
      stack=1, locals=0, args_size=0
         0: bipush        123
         2: ireturn
      LineNumberTable:
        line 8: 0

  public static final java.lang.Integer sample3();
    descriptor: ()Ljava/lang/Integer;
    flags: (0x0019) ACC_PUBLIC, ACC_STATIC, ACC_FINAL
    Code:
      stack=1, locals=0, args_size=0
         0: bipush        123
         2: invokestatic  #16                 // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
         5: areturn
      LineNumberTable:
        line 12: 0
    RuntimeInvisibleAnnotations:
      0: #10()

  public static final void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: (0x0019) ACC_PUBLIC, ACC_STATIC, ACC_FINAL
    Code:
      stack=4, locals=4, args_size=1
         0: aload_0
         1: ldc           #20                 // String args
         3: invokestatic  #26                 // Method kotlin/jvm/internal/Intrinsics.checkParameterIsNotNull:(Ljava/lang/Object;Ljava/lang/String;)V
         6: invokestatic  #28                 // Method sample1:()I
         9: istore_1
        10: invokestatic  #30                 // Method sample2:()I
        13: istore_2
        14: invokestatic  #32                 // Method sample3:()Ljava/lang/Integer;
        17: dup
        18: ifnonnull     31
        21: new           #34                 // class kotlin/TypeCastException
        24: dup
        25: ldc           #36                 // String null cannot be cast to non-null type kotlin.Int
        27: invokespecial #40                 // Method kotlin/TypeCastException."<init>":(Ljava/lang/String;)V
        30: athrow
        31: invokevirtual #43                 // Method java/lang/Integer.intValue:()I
        34: istore_3
        35: return
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
           35       1     3    s3   I
           14      22     2    s2   I
           10      26     1    s1   I
            0      36     0  args   [Ljava/lang/String;
      LineNumberTable:
        line 16: 6
        line 17: 10
        line 18: 14
        line 19: 35
      StackMapTable: number_of_entries = 1
        frame_type = 255 /* full_frame */
          offset_delta = 31
          locals = [ class "[Ljava/lang/String;", int, int ]
          stack = [ class java/lang/Integer ]
    RuntimeInvisibleParameterAnnotations:
      parameter 0:
        0: #10()
}
```

仕様通りに変換されていることがわかる(当たり前か)。  
注目すべきはsample2()で、`Integer.valueOf(123)`の呼び出しが単なる`123`になっているところか。賢い。
また、sample3()からKotlinがnonnullな関数の呼び出しに、チェック処理を追加しているのが見える。


### nullable

```kotlin
fun sample1(): Int? {
    return 123
}

fun main(args: Array<String>) {
    val i: Int = sample1() ?: -1
}
```

```
{
  public static final java.lang.Integer sample1();
    descriptor: ()Ljava/lang/Integer;
    flags: (0x0019) ACC_PUBLIC, ACC_STATIC, ACC_FINAL
    Code:
      stack=1, locals=0, args_size=0
         0: bipush        123
         2: invokestatic  #13                 // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
         5: areturn
      LineNumberTable:
        line 4: 0
    RuntimeInvisibleAnnotations:
      0: #7()

  public static final void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: (0x0019) ACC_PUBLIC, ACC_STATIC, ACC_FINAL
    Code:
      stack=2, locals=2, args_size=1
         0: aload_0
         1: ldc           #18                 // String args
         3: invokestatic  #24                 // Method kotlin/jvm/internal/Intrinsics.checkParameterIsNotNull:(Ljava/lang/Object;Ljava/lang/String;)V
         6: invokestatic  #26                 // Method sample1:()Ljava/lang/Integer;
         9: dup
        10: ifnull        19
        13: invokevirtual #30                 // Method java/lang/Integer.intValue:()I
        16: goto          21
        19: pop
        20: iconst_m1
        21: istore_1
        22: return
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
           22       1     1     i   I
            0      23     0  args   [Ljava/lang/String;
      LineNumberTable:
        line 8: 6
        line 9: 22
      StackMapTable: number_of_entries = 2
        frame_type = 83 /* same_locals_1_stack_item */
          stack = [ class java/lang/Integer ]
        frame_type = 65 /* same_locals_1_stack_item */
          stack = [ int ]
    RuntimeInvisibleParameterAnnotations:
      parameter 0:
        0: #16()
}
```

仕様通り、`Int?`は`java.lang.Integer`に変換されている。`Int`に代入される際、`intValue()`を読んで変換している。


### Generics

```kotlin
fun sample1(): Int {
    val list = listOf(1, 2, 3)
    return list[0]
}

fun sample2(): Int? {
    val list = listOf<Int?>(1, 2, 3)
    return list[0]
}
```

```
{
  public static final int sample1();
    descriptor: ()I
    flags: (0x0019) ACC_PUBLIC, ACC_STATIC, ACC_FINAL
    Code:
      stack=4, locals=1, args_size=0
         0: iconst_3
         1: anewarray     #8                  // class java/lang/Integer
         4: dup
         5: iconst_0
         6: iconst_1
         7: invokestatic  #12                 // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
        10: aastore
        11: dup
        12: iconst_1
        13: iconst_2
        14: invokestatic  #12                 // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
        17: aastore
        18: dup
        19: iconst_2
        20: iconst_3
        21: invokestatic  #12                 // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
        24: aastore
        25: invokestatic  #18                 // Method kotlin/collections/CollectionsKt.listOf:([Ljava/lang/Object;)Ljava/util/List;
        28: astore_0
        29: aload_0
        30: iconst_0
        31: invokeinterface #24,  2           // InterfaceMethod java/util/List.get:(I)Ljava/lang/Object;
        36: checkcast     #26                 // class java/lang/Number
        39: invokevirtual #29                 // Method java/lang/Number.intValue:()I
        42: ireturn
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
           29      14     0  list   Ljava/util/List;
      LineNumberTable:
        line 4: 0
        line 5: 29

  public static final java.lang.Integer sample2();
    descriptor: ()Ljava/lang/Integer;
    flags: (0x0019) ACC_PUBLIC, ACC_STATIC, ACC_FINAL
    Code:
      stack=4, locals=1, args_size=0
         0: iconst_3
         1: anewarray     #8                  // class java/lang/Integer
         4: dup
         5: iconst_0
         6: iconst_1
         7: invokestatic  #12                 // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
        10: aastore
        11: dup
        12: iconst_1
        13: iconst_2
        14: invokestatic  #12                 // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
        17: aastore
        18: dup
        19: iconst_2
        20: iconst_3
        21: invokestatic  #12                 // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
        24: aastore
        25: invokestatic  #18                 // Method kotlin/collections/CollectionsKt.listOf:([Ljava/lang/Object;)Ljava/util/List;
        28: astore_0
        29: aload_0
        30: iconst_0
        31: invokeinterface #24,  2           // InterfaceMethod java/util/List.get:(I)Ljava/lang/Object;
        36: checkcast     #8                  // class java/lang/Integer
        39: areturn
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
           29      11     0  list   Ljava/util/List;
      LineNumberTable:
        line 9: 0
        line 10: 29
    RuntimeInvisibleAnnotations:
      0: #34()
}
```

nullableかどうかで違いはほとんどない。  
`Integer`の配列を作成し、`CollectionsKt.listOf()`でリストを作成している。
値を取り出すときは、キャスト可能か確認した後、`Number.intValue()`でプリミティブ型に変換している。
(ここで`Integer`を使わないのは何故だろう? 共通化のため?)


## まとめ

* `Int`はプリミティブ型に変換される
* `Int?`はオートボクシングが発生するので、出来る限り避ける
* パフォーマンスが必要な場合、`List<Int>`は使用しない。Javaと同様、
[Trove](https://bitbucket.org/trove4j/trove)や[Eclipse Collections](https://www.eclipse.org/collections/ja/)を使用すべき


[検証ソースのリポジトリ](https://bitbucket.org/minebreaker_tf/kotlintype/overview)
