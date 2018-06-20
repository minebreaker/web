## 数字 -> 文字列

```java
// あまり良く無い例
"" + 1;

// Integer、Long等のstaticメソッドを呼び出す
Integer.toString(123);

// 基数を指定
Integer.toString(123, 10);   // 123
Integer.toString(123, 16);   // 7b

// コンビニエンスメソッド
Integer.toBinaryString(123); // 1111011
Integer.toOctalString(123);  // 173
Integer.toHexString(123);    // 7b

// 負の扱いに注意
System.out.println(Integer.toUnsignedString(-123, 16)); // ffffff85
System.out.println(Integer.toString(-123, 16));         // -7b
System.out.println(Integer.toHexString(-123));          // ffffff85
```

## 文字列 -> 数字
```java
Long.parseLong("123");                  // 123
Long.parseLong("123", 16);              // 291
Long.parseUnsignedLong(UnsignedLong.MAX_VALUE.toString()); // -1
// Long.parseLong(UnsignedLong.MAX_VALUE.toString());      // NumberFormatException
```

## 浮動小数点
```java
Double.toString(1.23);    // 1.23
Double.toHexString(1.23); // 0x1.3ae147ae147aep0

Double.parseDouble("0.1");   // 0.1
Double.parseDouble("-0.1");  // -0.1
Double.parseDouble("0xap0"); // 10.0

Double.parseDouble("NaN");       // NaN
Double.parseDouble("-Infinity"); // -Infinity
```
