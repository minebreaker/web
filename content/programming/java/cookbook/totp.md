TOTPは二段階認証によく使われるアルゴリズム。
Google Authenticatorなどで使用できる。

TOTPはTime-Based One-Time Passwordの略で、[RFC-6238](https://tools.ietf.org/html/rfc6238)で定義されている。
実際のパスワード生成部分には、ワンタイムパスワード生成アルゴリズムであるHOTPを使用している。
HOTPは[RFC-4226](https://tools.ietf.org/html/rfc4226)に定義されている。

[ソース](https://bitbucket.org/minebreaker_tf/teachyourselftotp)


## HOTP

```java
public static String hotp( byte[] secret, long count, int digit ) {

    byte[] hash = Hashing.hmacSha1( secret )
                         .hashLong( Long.reverseBytes( count ) )
                         .asBytes();

    int offset = hash[19] & 0x0F;
    int code = ( hash[offset] & 0x7f ) << 24 |
               ( hash[offset + 1] & 0xff ) << 16 |
               ( hash[offset + 2] & 0xff ) << 8 |
               ( hash[offset + 3] & 0xff );

    var codeAsStr = Integer.toString( code );
    return codeAsStr.substring( codeAsStr.length() - digit );
}
```

シークレットは、認証相手と共有する鍵。
Javaはビッグエンディアンだが、ハッシュに使うカウント値はリトルエンディアン。そのため`Long.reverseBytes()`を呼ぶ必要がある。
`digit`は桁数。大抵6固定。


## TOTP

```java
public static String totp( byte[] secret, long time, int step, int digit ) {
    long timeCounter = time / step;
    return hotp( secret, timeCounter, digit );
}
```

TOTPはUnix Timeに基づき、`count`を決定する。単位は秒なので、`System.currentTimeMillis() / 1000`を使えばいい。
`step`はトークン更新のタイミング(認証アプリ等で数字が切り替わる間隔)を指定する。実際には30秒固定らしい。


## URL

QRコード読み取り等で使われるURLの形式は、Googleが定めている。

[https://github.com/google/google-authenticator/wiki/Key-Uri-Format](https://github.com/google/google-authenticator/wiki/Key-Uri-Format)

```java
public static URI toUri( String label, String secret, String issuer ) {

    var query = new StringJoiner( "&" );
    query.add( "secret=" + BaseEncoding.base32().omitPadding().encode( secret.getBytes( StandardCharsets.UTF_8 ) ) );
    query.add( "issuer=" + issuer );

    try {
        return new URI( "otpauth", "totp", "/" + label, "secret=foo&issuer=bar", null );
    } catch ( URISyntaxException e ) {
        throw new RuntimeException( e );
    }
}
```

```
otpauth://totp/foo?secret=bar&issuer=buz
```

シークレットはBase32でエンコードされ、パディングは含んではいけない。
`digits`、`period`パラメーターもあるが、それぞれ`6`、`30`固定なので、指定しなくてよい。
