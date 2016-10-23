
## SOLID原則
オブジェクト指向プログラミングの重要な5原則の頭文字を取ったもの。すなわち、
* Single Responsibility Principle / 単一責任原則
* Open Close Principle / 閉鎖解放原則
* Liskov Substitution Principle / リスコフの置換原則
* Interface Segregation Principle / インターフェース分離原則
* Dependency Inversion Principle / 依存性逆転原則

## リスコフの置換原則

Liskov Substitution Principle  
あるクラスがほかのクラスを継承しているとき、その両者が置き換え可能であるというオブジェクト指向の原則。  
Javaを例に、もう少し具体的に説明してみる。  
Listインターフェースを実装しているクラスは、ArrayListであろうとLinkedListであろうと、  
どちらの実装を入れ替えても同じように動作するし、しなければいけない。  

## DRY原則・OAOO原則

Don't Repeat Yourself原則  
Once And Only Once原則  
どちらも、「重複を避けよ」という原則である。  
日本語的には、「車輪の再発明」。  
ちなみになんでもコピーペーストすることをWET原則(Write every time)という。  

## 単一責任原則
Single Responsibility Principle  
ひとつのクラスは一つ以上の機能を持ってはいけない。  
