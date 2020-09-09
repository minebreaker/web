例外を文字列に変換するのは少し面倒。

```java
public static String stackTraceToString(Throwable t) {
    StringWriter sw = new StringWriter();
    PrintWriter pw = new PrintWriter(sw);
    t.printStackTrace(pw);
    return sw.toString();
}
```

当然誰もがやろうとするので、Guavaにコンビニエンスメソッドがある。こっちを使おう。

[Throwables.getStackTraceAsString](http://google.github.io/guava/releases/snapshot-jre/api/docs/com/google/common/base/Throwables.html#getStackTraceAsString-java.lang.Throwable-)
