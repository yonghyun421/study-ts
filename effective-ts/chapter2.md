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

### _타입 단언보다 타입 선언을 사용하는게 낫다._

```tsx
const alice: Person = {};
// ~~~~~ 'Person' 유형에 필요한 'name' 속성이 '{}' 유형에 없습니다.
const bob = {} as Person; // 오류 없음
```

- 타입 선언은 할당되는 값이 해당 인터페이스를 만족하는지 검사한다.
- 타입 단언은 강제로 타입을 지정했으니 타입 체커에게 오류를 무시하라고 하는 것이다.

```tsx
const alice: Person = {
	name: 'Alice',
	occupation: 'TypeScript developer'
// ~~~~~~ 개체 리터럴은 알려진 속성만 지정할 수 있으며
//        'Person' 형식에 'occupation'이 없습니다.
};
const bob = {
	name: ;'Bob',
	occupation: 'JavaScript developer',
} as Person;  // 오류 없음
```

⇒ 위의 예시처럼 타입 선언과 단언의 차이는 속성을 추가할 때도 마찬가지이다.

### 타입 단언이 꼭 필요한 경우가 아니라면, 안전성 체크도 되는 타입 선언을 사용하는 것이 좋다.

```tsx
const people = ['alice', 'bob', 'jan'].map(name => ({name});
// Person[]을 원했지만 결과는 { name: string; }[]...

const people = ['alice', 'bob', 'jan'].map(
	name => ({name} as Person)
);  // 타입은 Person[]

const people = ['alice', 'bob', 'jan'].map(name => ({} as Person));  // 오류 없음

const people = ['alice', 'bob', 'jan'].map(name => {
	const person: Person = {name};
	return person
});  // 타입은 Person[]

const people = ['alice', 'bob', 'jan'].map(
	(name): Person => ({name})
);  // 타입은 Person[]
```

- 변수의 접두사로 쓰인 !는 boolean의 부정문이다. 그러나 접미사로 쓰인 !는 그 값이 null이 아니라는 단언문으로 해석된다.
- 타입 단언문으로 임의의 타입 간에 변환을 할 수는 없다.
- 모든 타입은 unknown의 서브타입이기 때문에 unknown이 포함된 단언문은 항상 동작한다. unknown 단언은 임의의 타입 간에 변환을 가능케 하지만, unknown을 사용한이상 적어도 무언가 위험한 동작을 하고 있다는 걸 알 수 있다.

### 요약

- 타입 단언(as Type)보다 타입 선언(: Type)을 사용해야 한다.
- 화살표 함수의 반환 타입을 명시하는 방법을 터득해야 한다.
- 타입스크립트보다 타입 정보를 더 잘 알고 있는 상황에서는 타입 단언문과 null 아님 단언문을 사용하면 된다.

## Item 10. 객체 래퍼 타입 피하기

- string ‘기본형'에는 메서드가 없지만, 자바스크립트에는 메서드를 가지는 String ‘객체' 타입이 정의되어 있다. 자바스크립트는 기본형과 객체 타입을 서로 자유롭게 변환한다.
- string 기본형에 charAt 같은 메서드를 사용할 때, 자바스크립트는 기본형을 String 객체로 래핑(wrap)하고, 메서드를 호출하고, 마지막에 래핑한 객체를 버린다.
- String 객체는 오직 자기 자신하고만 동일하다.

```tsx
> "hello" === new String("hello")
false
> new String("hello") === new String("hello")
false
```

- 어떤 속성을 기본형에 할당한다면 그 속성이 사라진다.

```tsx
> x = "hello"
> x.language = 'English'
'English'
> x.language
undefined
```

⇒ x가 String 객체로 변환된 후 language 속성이 추가되었고, language 속성이 추가된 객체는 버려진 것이다.

- 래퍼 타입들 덕분에 기본형 값에 메서드를 사용할 수 있고, 정적 메서드도 사용할 수 있다. 그러나 보통은 래퍼 객체를 직접 생성할 필요가 없다.
- string은 String에 할당할 수 있지만 String은 string에 할당할 수 없다.

### 요약

- 타입스크립트 객체 래퍼 타입은 지양하고, 대신 기본형 타입을 사용해야 한다.

## Item 11. 잉여 속성 체크의 한계 인지하기

- 타입이 명시된 변수에 객체 리터럴을 할당할 때 타입스크립트는 해당 타입의 속성이 있는지, 그리고 ‘그 외의 속성은 없는지’ 확인한다.

```tsx
interface Room {
  numDoors: number;
  ceilingHeightFt: number;
}
const r: Room = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: "present",
  // ~~~~~~ 개체 리터럴은 알려진 속성만 지정할 수 있으며
  //        'Room' 형식에 'elephant'이(가) 없습니다.
};
```

```tsx
const obj = {
  numDoors: 1,
  ceilingHeightFt: 10,
  elephant: "present",
};
const r: Room = obj; // 정상
```

⇒ obj의 타입은 { numDoors: number; ceilingHeightFt: number; elephant: string }으로 추론된다. obj 타입은 Room 타입의 부분집합을 포함하므로, Room에 할당 가능하며 타입 체커도 통과한다.

- 두 예제의 차이점
  - 첫 번째 예제에서는, 구조적 타입시스템에서 발생할 수 있는 중요한 종류의 오류를 잡을 수 있도록 ‘잉여 속성 체크'라는 과정이 수행되었다.

_But, 잉여 속성 체크 역시 조건에 따라 동작하지 않는다는 한계가 있고, 통상적인 할당 가능 검사와 함께 쓰이면 구조적 타이핑이 무엇인지 혼란스러워질 수 있다._

- **잉여 속성 체크는 할당 가능 검사와는 별도의 과정**

```tsx
interface Options {
  title: string;
  darkMode: boolean;
}
function createWindow(options: Options) {
  if (options.darkMode) {
    setDarkMode();
  }
  // ....
}
createWindow({
  title: "Spider Solitaire",
  darkmode: true,
  // ~~~~~~ 개체 리터럴은 알려진 속성만 지정할 수 있지만
  //        'Options' 형식에 'darkmode'이(가) 없습니다.
  //        'darkMode'을(를) 쓰려고 했습니까?
});
```

⇒ Options 타입은 범위가 매우 넓기 때문에, 순수한 구조적 타입 체커는 이런 종류의 오류를 찾아내지 못한다. darkMode 속성에 boolean 타입이 아닌 다른 타입의 값이 지정된 경우를 제외하면, string 타입인 title 속성과 ‘또 다른 어떤 속성’을 가지는 모든 객체는 Options 타입의 범위에 속한다.

```tsx
const o1: Options = document; // 정상
const o2: Options = new HTMLAnchorElement(); // 정상
```

⇒ document와 HTMLAnchorElement의 인스턴스 모두 string 타입인 title 속성을 가지고 있기 때문에 할당문은 정상이다.

- 잉여 속성 체크를 이용하면 기본적으로 타입 시스템의 구조적 본질을 해치지 않으면서도 객체 리터럴에 알 수 없는 속성을 허용하지 않음으로써, 앞에서 다룬 Room이나 Options 예제 같은 문제점을 방지할 수 있다.
  - 그래서 **엄격한 객체 리터럴 체크**라고도 불린다.

```tsx
const intermediate = { darkmode: true, title: "Ski Free" };
const o: Options = intermediate; // 정상
```

⇒ 첫 번째 줄의 오른쪽은 객체 리터럴이지만, 두 번째 줄의 오른쪽은 객체 리터럴이 아니다. 따라서 잉여 속성 체크가 적용되지 않고 오류는 사라진다.

```tsx
const o = { darkmode: true, title: "Ski Free" } as Options; // 정상
```

⇒ 타입 단언문을 사용할 때에도 잉여 속성 체크가 적용되지 않는다.

⇒ **단언문보다 선언문을 사용해야 하는 단적인 이유 중 하나.**

- 잉여 속성 체크를 원치 않는 경우 인덱스 시그니처를 사용해서 타입스크립트가 추가적인 속성을 예상하도록 할 수 있다.

```tsx
interface Options {
  darkMode?: boolean;
  [otherOptions: string]: unknown;
}
const o: Options = { darkmode: true }; // 정상
```

- 선택적 속성만 가지는 ‘약한(weak)’타입에도 비슷한 체크가 동작한다.

```tsx
interface LineChartOptions {
  logscale?: boolean;
  invertedYAxis?: boolean;
  areaChart?: boolean;
}
const opts = { logScale: true };
const o: LineChartOptions = opts;
// ~ '{ logScale: boolean; }' 유형에
//   'LineChartOptions' 유형과 공통적인 속성이 없습니다.
```

⇒ 이러한 약한 타입에 대해서 타입스크립트는 값 타입과 선언 타입에 공통된 속성이 있는지 확인하는 별도의 체크를 수행한다.

⇒ 공통 속성 체크는 잉여 속성 체크와 마찬가지로 오타를 잡는 데 효과적이며 구조적으로 엄격하지 않다.

_but, 잉여 속성 체크와 다르게, 약한 타입과 관련된 할당문마다 수행된다. 임시변수를 제거하더라도 공통 속성 체크는 여전히 동작한다._

### 요약

- 객체 리터럴을 변수에 할당하거나 함수에 매개변수로 전달할 때 잉여 속성 체크가 수행된다.
- 잉여 속성 체크는 오류를 찾는 효과적인 방법이지만, 일반적인 구조적 할당 가능성 체크와 역할이 다르기 때문에 할당의 개념을 정확히 알아야 잉여 속성 체크와 일반적인 구조적 할당 가능성 체크를 구분활 수 있다.
- 잉여 속성 체크에는 한계가 있다. 임시 변수를 도입하면 잉여 속성 체크를 건너뛸 수 있다는 점을 기억.

## Item 12. 함수 표현식에 타입 적용하기

- 자바스크립트(그리고 타입스크립트)에서는 함수 ‘문장’과 함수’표현식'을 다르게 인식한다.

```tsx
function rollDice1(sides: number): number {
  /*...*/
} // 문장
const rollDice2 = function (sides: number): number {
  /*...*/
}; // 표현식
const rollDice3 = (sides: number): number => {
  /*...*/
}; // 표현식
```

⇒ 타입스크립트에서는 함수 표현식을 사용하는 것이 좋다.

```tsx
type DiceRollFn = (sides: number) => number;
const rollDice: DiceRollFn = (sides) => {
  /*...*/
};
```

- 함수 타입 선언의 장점
  - 불필요한 코드의 반복을 줄인다.
  ```tsx
  function add(a: number, b: number) {
    return a + b;
  }
  function sub(a: number, b: number) {
    return a - b;
  }
  function mul(a: number, b: number) {
    return a * b;
  }
  function div(a: number, b: number) {
    return a / b;
  }
  ```
  - 반복되는 함수 시그니처를 하나의 함수 타입으로 통합할 수도 있다.
  ```tsx
  type BinaryFn = (a: number, b: number) => number;
  const add: BinaryFn = (a, b) => a + b;
  const sub: BinaryFn = (a, b) => a - b;
  const mul: BinaryFn = (a, b) => a * b;
  const div: BinaryFn = (a, b) => a / b;
  ```
- 함수의 매개변수에 타입 선언을 하는 것보다 함수 표현식 전체 타입을 정의하는 것이 코드도 간결하고 안전하다. 다른 함수의 시그니처와 동일한 타입을 가지는 새 함수를 작성하거나, 동일한 타입 시그니처를 가지는 여러 개의 함수를 작성할 때는 매개변수의 타입과 반환 타입을 반복해서 작성하지 말고 함수 전체의 타입 선언을 적용해야 한다.

### 요약

- 매개변수나 반환 값에 타입을 명시하기보다는 함수 표현식 전체에 타입 구문을 적용하는 것이 좋다.
- 만약 같은 타입 시그니처를 반복적으로 작성한 코드가 있다면 함수 타입을 분리해 내거나 이미 존재하는 타입을 찾아보도록 한다. 라이브러리를 직접 만든다면 공통 콜백에 타입을 제공해야 한다.
- 다른 함수의 시그니처를 참조하려면 typeof fn을 사용한다.

## Item 13. 타입과 인터페이스의 차이점 알기

- 타입 스크립트에서 명명된 타입을 정의하는 방법은 두 가지가 있다.

```tsx
type TState = {
  name: string;
  capital: string;
};
// 또는 인터페이스를 사용해도 된다.
interface IState {
  name: string;
  capital: string;
}
```

⇒ 대부분의 경우에는 타입을 사용해도 되고 인터페이스를 사용해도 된다.

- 인터페이스 선언과 타입 선언의 비슷한 점

  - 명명된 타입은 인터페이스로 정의하든 타입으로 정의하든 상태에는 차이가 없다.
  - 인덱스 시그니처는 인터페이스와 타입에서 모두 사용할 수 있다.
    `tsx => type TDict = { [key: string]: string }; interface IDict { [key: string]: string; } `
  - 함수 타입도 인터페이스나 타입으로 정의할 수 있다.

    ```tsx
    type TFn = (x: number) => string;
    interface IFn {
      (x: number): string;
    }

    const toStrT: TFn = (x) => "" + x; // 정상
    const toStrI: IFn = (x) => "" + x; // 정상
    ```

  - 함수 타입에 추가적인 속성이 있다면 타입이나 인터페이스 어떤 것을 선택하든 차이가 없다.
    ```tsx
    type TFnWithProperties = {
      (x: number): number;
      prop: string;
    };
    interface IFnWithProperties {
      (x: number): number;
      prop: string;
    }
    ```
  - 타입 별칭과 인터페이스는 모두 제너릭이 가능하다.
    ```tsx
    type TPair<T> = {
      first: T;
      second: T;
    };
    interface IPair<T> {
      first: T;
      second: T;
    }
    ```
  - 인터페이스는 타입을 확장할 수 있으며, 타입은 인터페이스를 확장할 수 있다.
    ```tsx
    interface IStateWithPop extends TState {
      population: number;
    }
    type TStateWithPop = IState & { population: number };
    ```
    - 주의할점은 인터페이스는 유니온 타입 같은 복잡한 타입을 확장하지는 못한다. 복잡한 타입을 확장하고 싶다면 타입과 &를 사용해야 한다.
  - 클래스를 구현할 때는 타입과 인터페이스를 둘 다 사용할 수 있다.
    ```tsx
    class StateT implements TState {
      name: string = "";
      capital: string = "";
    }
    class StateI implements IState {
      name: string = "";
      capital: string = "";
    }
    ```

- 타입과 인터페이스의 다른 점
  - 유니온 타입은 있지만 유니온 인터페이스라는 개념은 없다.
    ```tsx
    type AorB = "a" | "b";
    ```
    - 인터페이스는 타입을 확장할 수 있지만, 유니온은 할 수 없다.
    - type 키워드는 일반적으로 interface보다 쓰임새가 많다. type 키워드는 유니온이 될 수도 있고, 매핑된 타입 또는 조건부 타입 같은 고급 기능에 활용되기도 한다.
  - 튜플과 배열 타입도 type 키워드를 이용해 더 간결하게 표현할 수 있다.
    ```tsx
    type Pair = [number, number];
    type StringList = string[];
    type NamedNums = [string, ...number[]];
    ```
    ⇒ 인터페이스로도 튜플과 비슷하게 구현할 수 있긴 하지만 그렇게 하면 튜플에서 사용할 수 있는 concat 같은 메서드를 사용할 수 없다. 그러므로 튜플은 type 키워드로 구현하는 것이 낫다.
  - 인터페이스는 타입에 없는 기능인 **보강**이 가능하다.
    ```tsx
    interface IState {
      name: string;
      capital: string;
    }
    interface IState {
      population: number;
    }
    const wyoming: IState = {
      name: "Wyoming",
      capital: "Cheyenne",
      population: 500_000,
    }; // 정상
    ```
    ⇒ 위 예제처럼 속성을 확장하는 것을 **선언 병합**이라고 한다. 선언 병합은 주로 타입 선언 파일에서 사용된다. 따라서 타입 선언 파일을 작성 할 때는 선언 병합을 지원하기 위해 반드시 인터페이스를 사용해야 하며 표준을 따라야 한다.

### 결론

- 복잡한 타입이라면 고민할 것도 없이 타입 별칭을 사용하면 된다.
- 그러나 타입과 인터페이스, 두 가지 방법으로 모두 표현할 수 있는 간단한 객체 타입이라면 일관성과 보강의 관점에서 고려해 봐야 한다.
  - 일관되게 인터페이스를 사용하는 코드베이스에서 작업하고 있는 경우 ⇒ 인터페이스
  - 일관되게 타입을 사용중인 경우 ⇒ 타입
  - 아직 스타일이 확립되지 않은 프로젝트라면, 향후에 보강의 가능성이 있을지 생각해봐야 한다.
  - but, 프로젝트 내부적으로 사용되는 타입에 선언 병합이 발생하는 것은 잘못된 설계이다. 따라서 이럴 때는 타입을 사용해야 한다.

## Item 14. 타입 연산과 제너릭 사용으로 반복 줄이기

```tsx
const surfaceArea = (r, h) => 2 * Math.PI * r * (r + h);
const volume = (r, h) => Math.PI * r * r * h;
for (const [r, h] of [
  [1, 1],
  [1, 2],
  [2, 1],
]) {
  console.log(
    `Cylinder ${r} x ${h}`,
    `Surface area: ${surfaceArea(r, h)}`,
    `Volume: ${volume(r, h)}`
  );
}
```

⇒ 같은 코드를 반복하지 말라는 DRY(don’t repeat yourself) 원칙.

- 타입 중복은 코드 중복만큼 많은 문제를 발생시킨다.
- 반복을 줄이는 가장 간단한 방법은 타입에 이름을 붙이는 것이다.

```tsx
function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
```

⇒ 위의 코드에서 타입이 반복적으로 등장하는 것을 볼 수 있다. 이 코드를 수정해 타입에 이름을 붙여보면

```tsx
interface Point2D {
  x: number;
  y: number;
}
function distance(a: Point2D, b: Point2D) {
  /*...*/
}
```

⇒ 이 코드는 상수를 사용해서 반복을 줄이는 기법을 동일하게 타입 시스템에 적용한 것이다.

- 중복된 타입은 종종 문법에 의해서 가려지기도 한다.

```tsx
function get(url: string, opts: Options): Promise<Response> {
  /*...*/
}
function post(url: string, opts: Options): Promise<Response> {
  /*...*/
}
```
## item 15. 동적 데이터에 인덱스 시그니처 사용하기

- 자바스크립트의 장점 중 하나는 객체를 생성하는 문법이 간단하다는 것이다.

```tsx
const rocket = {
	name: 'Falcon 9',
	variant: 'Block 5',
	thrust: '7,607 kN',
};
```

⇒ 자바스크립트 객체는 문자열 키를 타입의 값에 관계없이 매핑한다.

- 타입스크립트에서는 타입에 **인덱스 시그니처**를 명시하여 유연하게 매핑을 표현할 수 있다.

```tsx
type Rocket = {[property: string]: string};
const rocket: Rocket = {
	name: 'Falcon 9',
	variant: 'v1.0',
	thrust: '4,940 kN',
};
```

- [property: string]: string 이 인덱스 시그니처이며, 다음 세 가지 의미를 담고 있다.
    - 키의 이름: 키의 위치만 표시하는 용도, 타입 체커에서는 사용 x
    - 키의 타입: string이나 number 또는 symbol의 조합이어야 하지만, 보통은 string을 사용한다.
    - 값의 타입: 어떤 것이든 될 수 있다.
- 이렇게 타입 체크가 수행되면서 발생하는 네 가지 단점.
    - 잘못된 키를 포함해 모든 키를 허용한다. name 대신 Name으로 작성해도 유효한 Rocket 타입이 된다.
    - 특정 키가 필요하지 않다. {} 도 유효한 Rocket 타입이다.
    - 키마다 다른 타입을 가질 수 없다.
    - 타입스크립트 언어 서비스를 사용하여 도움을 받을 수 없다. name: 을 입력할 때, 키는 무엇이든 가능하기 때문에 자동 완성 기능이 동작하지 않는다.
- 이러한 이유로 인해 인덱스 시그니처는 부정확하므로 더 나은 방법을 찾아야 한다. 다음과 같은 경우에는 Rocket이 인터페이스여야 한다.

```tsx
interface Rocket {
	name: string,
	variant: string,
	thrust_kN: number,
}
const falconHeavy: Rocket = {
	name: 'Falcon Heavy',
	variant: 'v1',
	thrust_kN: 15_200
};
```

⇒ 타입스크립트는 모든 필수 필드가 존재하는지 확인한다.

- 인덱스 시그니처는 동적 데이터를 표현할 때 사용한다.
    - 예를 들어 CSV 파일처럼 헤더 행에 열 이름이 있고, 데이터 행을 열 이름과 값으로 매핑하는 객체로 나타내고 싶은 경우이다.

```tsx
function parseCSV(input: string): {[columnName: string]: string}[] {
	const lines = input.split('\n');
	const [header, ...rows] = lines;
	const headerColumns = header.split(',');
	return rows.map(rowStr => {
		const row: {[columnName: string]: string} = {};
		rowStr.split(',').forEach((cell, i) => {
			row[headerColumns[i]] = cell;
		});
	return row;
	});
}
```

- 일반적인 상황에서 열 이름이 무엇인지 미리 알 수 없다. 이럴 때 인덱스 시그니처를 사용한다. 반면에 열 이름을 알고 있는 특정한 상황에 parseCSV가 사용된다면, 미리 선언해 둔 타입으로 단언문을 사용한다.

```tsx
interface ProductRow{
	productId: string;
	name: string;
	price: string;
}

declare let csvData: string;
const products = parseCSV(csvData) as unknown as ProductRow[];
```

⇒ 만약 선언해 둔 열들이 런타임에 실제로 일치하지 않을 수 있는 부분이 걱정된다면 값 타입에 undefined를 추가해준다.

- 연관 배열의 경우, 객체에 인덱스 시그니처를 사용하는 대신 Map 타입을 사용하는 것을 고려할 수 있다.
- 어떤 타입에 가능한 필드가 제한되어 있는 경우라면 인덱스 시그니처로 모델링하지 말아야 한다.
- 예를 들어 데이터에 A, B, C, D 같은 키가 있지만 얼마나 많이 있는지 모른다면 선택적 필드 또는 유니온 타입으로 모델링하면 된다.

```tsx
interface Row1 { [column: string]: number }  // 너무 광범위
interface Row2 { a: number; b?: number; c?: number; d?: number }  // 최선
type Row3 = 
		| { a : number; }
		| { a: number; b: number; }
		| { a: number; b: number; c: number; }
		| { a: number; b: number; c: number; d: number; }  // 가장 정확하지만 사용하기 번거로움
```

- string 타입이 너무 광범위해서 인덱스 시그니처를 사용하는 데 문제가 있다면, 두 가지 다른 대안을 생각해 볼 수 있다.
    1. Record를 사용하는 방법.
        1. Record는 키 타입에 유연성을 제공하는 제너릭 타입이다. 특히 string의 부분 집합을 사용할 수 있다.
        
        ```tsx
        type Vec3D = Record<'x' | 'y' | 'z', number>;
        // Type Vec3D = {
        //   x: number;
        //   y: number;
        //   z: number;
        // }
        ```
        
    2. 매핑된 타입을 사용하는 방법
        1. 매핑된 타입은 키마다 별도의 타입을 사용하게 해준다.
        
        ```tsx
        type Vec3D = {[k in 'x' | 'y' | 'z']: number};
        // Type Vec3D = {
        //   x: number;
        //   y: number;
        //   z: number;
        // }
        type ABC = {[k in 'a' | 'b' | 'c']: k extends 'b' ? string : number};
        // Type ABC = {
        //   a: number;
        //   b: atring;
        //   c: number;
        // }
        ```
        

### 요약

- 런타임 때까지 객체의 속성을 알 수 없을 경우에만 인덱스 시그니처를 사용한다.
- 안전한 접근을 위해 인덱스 시그니처의 값 타입에 undefined를 추가하는 것을 고려해야 한다.
- 가능하다면 인터페이스, Record, 매핑된 타입 같은 인덱스 시그니처보다 정확한 타입을 사용하는 것이 좋다.