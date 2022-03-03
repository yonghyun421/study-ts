# 2장. 타입스크립트의 타입 시스템

_타입 스크립트는 코드를 자바스크립트로 변환하는 역할도 하지만, 가장 중요한 역할은 타입 시스템에 있다._

_타입 시스템은 타입스크립트를 사용하는 진정한 이유기도 하다._

## Item 6. 편집기를 사용하여 타입 시스템 탐색하기

- 타입스크립트를 설치하고 실행할 수 있는 것
  - 타입스크립트 컴파일러(tsc)
  - 단독으로 실행할 수 있는 타입스크립트 서버(tsserver)
- 타입스크립트 서버에서 제공하는 **언어 서비스**
  - 코드 자동 완성, 명세(사양, specification) 검사, 검색, 리팩터링이 포함된다.
- 편집기 사용하기
  - 특정 시점에 타입스크립트가 값의 타입을 어떻게 이해하고 있는지 살펴보는 것은 타입 넓히기와 좁히기의 개념을 잡기 위해 꼭 필요한 과정이다.
- 편집기를 사용하면 어떻게 타입 시스템이 동작하는지, 그리고 타입스크립트가 어떻게 타입을 추론하는지 개념을 잡을 수 있다.

## Item 7. 타입이 값들의 집합이라고 생각하기

- 런타임에 모든 변수는 자바스크립트 세상의 값으로부터 정해지는 각자의 고유한 값을 가진다. 그리고 코드가 실행되기 전, 즉 타입스크립트가 오류를 체크하는 순간에는 **타입**을 가지고 있다.

### 타입(할당 가능한 값들의 집합)

- never
  - 가장 작은 집합으로 아무 값도 포함하지 않는 공집합니다.
- 리터럴(literal)타입 / 유닛(unit)타입
  - 한가지 값만 포함하는 타입
- 유니온(union)타입
  - 두 개 혹은 세 개로 묶는 경우 / 값 집합들의 합집합

```tsx
interface Person {
	name: string;
}
interface Lifespan {
	birth: Date;
	death?: Date;
}
type PersonSpan = Person & Lifespan;

const ps: PersonSpan = {
	name: ;Alan Turing',
	birth: new Date('1912/06/23'),
	death: new Date('1954/06/07'),
}; // 정상
```

⇒ 타입 연산자는 인터페이스의 속성이 아닌 값의 집합(타입의 범위)에 적용된다. 그리고 추가적인 속성을 가지는 값도 여전히 그 타입에 속한다. 그래서 Person과 Lifespan을 둘 다 가지는 값은 인터섹션 타입에 속하게 된다.

```tsx
keyof (A&B) = (keyof A) | (keyof B)
keyof (A|B) = (keyof A) & (keyof B)
```

- extends

```tsx
interface Vector1D {
  x: number;
}
interface Vector2D {
  x: number;
  y: number;
}
interface Vector3D {
  x: number;
  y: number;
  z: number;
}

// extends를 이용하여 같은 코드를 작성하면
interface Vector1D {
  x: number;
}
interface Vector2D extends Vector1D {
  y: number;
}
interface Vector3D extends Vector2D {
  z: number;
}
```

| 타입스크립트 용어   | 집합 용어           |
| ------------------- | ------------------- | ---------------- |
| never               | 공집합              |
| 리터럴 타입         | 원소가 1개인 집합   |
| 값이 T에 할당 가능  | 값이 T의 원소       |
| T1이 T2에 할당 가능 | T1이 T2의 부분 집합 |
| T1이 T2를 상속      | T1이 T2의 부분 집합 |
| T1                  | T2                  | T1과 T2의 합집합 |
| T1 & T2             | T1과 T2의 교집합    |
| unknown             | 전체 집합           |

## Item 8. 타입 공간과 값 공간의 심벌 구분하기

- 타입스크립트의 심벌(symbol)은 타입 공간이나 값 공간 중의 한 곳에 존재한다.

```tsx
interface Cylinder {
  radius: number;
  height: number;
}

const Cylinder = (radius: number, height: number) => ({ radius, height });
```

⇒ interface Cylinder에서 Cylinder는 타입으로 쓰인다. const Cylinder에서 Cylinder와 이름은 같지만 값으로 쓰이며, 서로 아무런 관련이 없다. 상황에 따라서 Cylinder는 타입으로 쓰일 수도 있고, 값으로 쓰일 수도 있다. 이러한 점은 가끔 오류를 야기한다.

```tsx
function calculateVolume(shape: unknown) {
  if (shape instanceof Cylinder) {
    shape.radius;
    // ~~~~~~'{}' 형식에 'radius' 속성이 없습니다.
  }
}
```

⇒ 위의 예시에서는 아마도 instanceof를 이용해 shape가 Cylinder 타입인지 체크하려고 했을 것이다. 그러나 instanceof는 자바스크립트의 런타임 연산자이고, 값에 대해서 연산을 한다. 그래서 instanceof Cylinder는 타입이 아니라 함수를 참조한다.

```tsx
type T1 = "string literal";
type T2 = 123;
const v1 = "string literal";
const v2 = 123;
```

- 일반적으로 type이나 interface 다음에 나오는 심벌은 타입인 반면, const나 let 선언에 쓰이는 것은 값이다.
- 타입스크립트 코드에서 타입과 값은 번갈아 나올 수 있다.
  - 타입 선언(:) 또는 단언문(as) 다음에 나오는 심벌은 타입인 반면, = 다음에 나오는 모든 것은 값이다.
- 클래스가 타입으로 쓰일 때는 형태(속성과 메서드)가 사용되는 반면, 값으로 쓰일 때는 생성자가 사용된다.
- typeof

```tsx
type T1 = typeof p; // 타입은 Person
type T2 = typeof email;
// 타입은 (p: Person, subject: string, body: string) => Response

const v1 = typeof p; // 값은 'object'
const v2 = typeof email; // 값은 'function'
```

- 타입의 관점에서 typeof는 값을 읽어서 타입스크립트 타입을 반환한다. 타입 공간의 typeof는 보다 큰 타입의 일부분으로 사용할 수 있고, type 구문으로 이름을 붙이는 용도로도 사용할 수 있다.
- 값의 관점에서 typeof는 자바스크립트 런타임의 typeof 연산자가 된다. 값 공간의 typeof는 대상 심벌의 런타임 타입을 가리키는 문자열을 반환하며, 타입스크립트 타입과는 다르다.
- 타입스크립트 타입의 종류가 무수히 많은 반면, 자바스크립트에는 과거부터 지금까지 단 6개(string, number, boolean, undefined, object, function)의 런타임 타입만이 존재한다.

## Item 9. 타입 단언보다는 타입 선언을 사용하기

- 타입스크립트에서 변수에 값을 할당하고 타입을 부여하는 방법은 두가지이다.

```tsx
interface Person {
  name: string;
}

const alice: Person = { name: "Alice" }; // 타입은 Person
const bob = { name: "Bob" } as Person; // 타입은 Person
```

- alice: Person
  - 변수에 **타입 선언**을 붙여서 그 값이 선언된 타입임을 명시한다.
- as Person
  - **타입 단언**을 수행한다. 그러면 타입스크립트가 추론한 타입이 있더라도 Person 타입으로 간주한다.
