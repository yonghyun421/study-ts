# 3장. 타입 추론

_타입스크립트는 타입 추론을 적극적으로 수행한다. 타입 추론은 수동으로 명시해야 하는 타입 구문의 수를 엄청나게 줄여 주기 때문에, 코드의 전체적인 안정성이 향상된다._

## item 19. 추론 가능한 타입을 사용해 장황한 코드 방지하기

```tsx
let x: number = 12;
// 이처럼 코드의 모든 변수에 타입을 선언하는 것은 비생산적이다.
let x = 12;
// 이렇게만 해도 충분하다.
```

- 타입 추론이 된다면 명시적 타입 구문은 필요하지 않다. 오히려 방해가 될 뿐이다.

```tsx
const person: {
	name: string;
	born: {
		where: string;
		when: string;
	};
	died: {
		where: string;
		when: string;
	}
} = {
	name: 'Sojourner Truth',
	born: {
		where: 'Swartekill, NY',
		when: 'c.1797',
	},
	died: {
		where: 'Battle Creek, MI',
		when: 'Nov. 26, 1883'
	}
};
```

⇒ 위의 예제는 타입을 생략하고 다음처럼 작성해도 충분하다.

```tsx
const person = {
	name: 'Sojourner Truth',
	born: {
		where: 'Swartekill, NY',
		when: 'c.1797',
	},
	died: {
		where: 'Battle Creek, MI',
		when: 'Nov. 26, 1883'
	}
};
```

⇒ 두 예제에서 person의 타입은 동일하다. 값에 추가로 타입을 작성하는 것은 거추장스러울 뿐이다.

- 배열의 경우도 객체와 마찬가지이다. 타입스크립트는 입력받아 연산을 하는 함수가 어떤 타입을 반환하는지 정확히 알고 있다.

```tsx
function square(nums: number[]) {
	return nums.map(x => x*x);
}
const squares = square([1,2,3,4]);  // 타입은 number[]
```

- 타입스크립트는 우리가 예상한 것보다 더 정확하게 추론하기도 한다.

```tsx
const axis1: string = 'x'; // 타입은 string
const axis2: 'y' // 타입은 'y'
```

⇒ axis2 변수를 string으로 예상하기 쉽지만 타입스크립트가 추론한 ‘y’가 더 정확한 타입이다.

- 타입이 추론되면 리팩터링 역시 용이해진다. Product 타입과 기록을 위한 함수를 가정해 보자

```tsx
interface Product {
	id: number;
	name: string;
	price: number;
}

function logProduct(product: Product) {
	const id: number = product.id;
	const name: string = product.name;
	const price: number = product.price;
	console.log(id, name, price);
}
```

그런데 id에 문자도 들어 있을 수 있음을 나중에 알게 되었다고 가정해보자. 그래서 Product 내의 id 타입을 변경한다. 그러면 logProduct 내의 id 변수 선언에 있는 타입과 맞지 않기 때문에 오류가 발생한다.

```tsx
interface Product {
	id: string;
	name: string;
	price: number;
}

function logProduct(product: Product) {
	const id: number = product.id;
			// ~~ 'string' 형식은 'number' 형식에 할당할 수 없다.
	const name: string = product.name;
	const price: number = product.price;
	console.log(id, name, price);
}
```

⇒ logProduct 함수 내의 명시적 타입 구문이 없었다면, 코드는 아무런 수정없이도 타입 체커를 통과했을 것이다.

- logProduct는 비구조화 할당문을 사용해 구현하는 게 낫다.

```tsx
function logProduct(product: Product) {
	const {id, name, price} = product;
	console.log(id, name, price);;
}
```

⇒ 비구조화 할당문은 모든 지역 변수의 타입이 추론되도록 한다. 여기에 추가로 명시적 타입 구문을 넣는다면 불필요한 타입 선언으로 인해 코드가 번잡해진다.

```tsx
function logProduct(product: Product) {
	const {id, name, price}: {id: string, name: string, price: number} = product;
	console.log(id, name, price);
}
```

- 정보가 부족해서 타입스크립트가 스스로 타입을 판단하기 어려운 상황도 일부 있다. 그럴 떄는 명시적 타입 구문이 필요하다. (logProduct 함수에서 매개변수 타입을 product로 명시한 경우가 그 예이다.)
- 어떤 언어들은 매개변수의 최종 사용처까지 참고하여 타입을 추론하지만, 타입스크립트에서 변수의 타입은 일반적으로 처음 등장할 때 결정된다.
- 이상적인 타입스크립트 코드는 함수/메서드 시그니처에 타입 구문을 포함하지만, 함수 내에서 생성된 지역 변수에는 타입 구문을 넣지 않는다.
    - 타입 구문을 생략하여 방해되는 것들을 최소화하고 코드를 읽는 사람이 구현 로직에 집중할 수 있게 하는 것이 좋다.
- 함수 매개변수에 타입 구문을 생략하는 경우도 간혹 있다.
    - 기본값이 있는 경우
    
    ```tsx
    function parseNumber(str: string, base=10) {
    	// ...
    }
    ```
    
    ⇒ 위에서 기본값이 10이기 때문에 base의 타입은 number로 추론된다.
    
    - 보통 타입 정보가 있는 라이브러리에서, 콜백 함수의 매개변수 타입은 자동으로 추론된다.
    
    ```tsx
    // 이렇게 X
    app.get('/health', (request: express.Request, response: express.Response) => {
    	response.send('OK');
    });
    
    // 이렇게 O
    app.get('/health', (request, response) => {
    	response.send('OK');
    });
    ```
    
- 타입이 추론될 수 있음에도 여전히 타입을 명시하고 싶은 몇 가지 상황이 있다.
    - 객체 리터럴을 정의할 때
    
    ```tsx
    const elmo: Product = {
    	name: 'Tickle Me Elmo',
    	id: '048188 627152',
    	price: 28.99,
    };
    ```
    
    ⇒ 이런 정의에 타입을 명시하면, 잉여 속성 체크가 동작한다. 잉여 속성 체크는 특히 선택적 속성이 있는 타입의 오타 같은 오류를 잡는 데 효과적이다. 그리고 변수가 사용되는 순간이 아닌 할당하는 시점에 오류가 표시되도록 해준다.
    
    ⇒ 만약 타입 구문을 제거한다면 잉여 속성 체크가 동작하지 않고, 객체를 선언한 곳이 아니라 객체가 사용되는 곳에서 타입 오류가 발생한다.
    
    ```tsx
    const furby = {
    	name: 'Furby',
    	id: 63423325235,
    	price: 35,
    };
    logProduct(furby);
    	// ~~~ ... 형식의 인수는 'Product' 형식의 매개변수에 할당될 수 없습니다.
    	//     'id' 속성의 형식이 호환되지 않습니다.
    	//     'number' 형식은 'string' 형식에 할당할 수 없습니다.
    ```
    
    ⇒ 그러나 타입 구문을 제대로 명시한다면, 실제로 실수가 발생한 부분에 오류를 표시해 준다.
    
    ```tsx
    const furby: Product = {
    	name: 'Furby',
    	id: 123214124,
    // ~~ 'number' 형식은 'string' 형식에 할당할 수 없습니다.
    	price: 35,
    };
    logProduct(furby);
    ```
    
- 마찬가지로 함수의 반환에도 타입을 명시하여 오류를 방지할 수 있다. 타입 추론이 가능할지라도 구현상의 오류가 함수를 호출한 곳까지 영향을 미치지 않도록 하기 위해 타입 구문을 명시하는 게 좋다.
- 반환 타입을 명시하면, 구현상의 오류가 사용자 코드의 오류로 표시되지 않는다.
- 오류의 위치를 제대로 표시해 주는 이점 외에도, 반환 타입을 명시해야 하는 이유가 두 가지 더 있다.
    - 첫 번째는 반환 타입을 명시하면 함수에 대해 더욱 명확하게 알 수 있기 때문이다.
        - 추후에 코드가 조금 변경되어도 그 함수의 시그니처는 쉽게 바뀌지 않는다. 전체 타입 시그니처를 먼저 작성하면 구현에 맞추어 주먹구구식으로 시그니처가 작성되는 것을 방지하고 제대로 원하는 모양을 얻게 된다.
    - 두 번째는 명명된 타입을 사용하기 위해서이다.
        - 반환 타입을 명시하면 더욱 직관적인 표현이 된다. 그리고 반환 값을 별도의 타입으로 정의하면 타입에 대한 주석을 작성할 수 있어서 더욱 자세한 설명이 가능하다. 추론된 반환 타입이 복잡해질수록 명명된 타입을 제공하는 이점은 커진다.

### 요약

- 타입스크립트가 타입을 추론할 수 있다면 타입 구문을 작성하지 않는 게 좋다.
- 이상적인 경우 함수/메서드의 시그니처에는 타입 구문이 있지만, 함수 내의 지역 변수에는 타입 구문이 없다.
- 추론될 수 있는 경우라도 객체 리터럴과 함수 반환에는 타입 명시를 고려해야 한다. 이는 내부 구현의 오류가 사용자 코드 위치에 나타나는 것을 방지해 준다.

## item 20. 다른 타입에는 다른 변수 사용하기

- 자바스크립트에서는 한 변수를 다른 목적을 가지는 다른 타입으로 재사용해도 된다.

```tsx
let id = "12-34-56";
fetchProduct(id); // string으로 사용
id = 123456;
fetchProductBySerialNumber(id); // number로 사용
```

- 반면 타입스크립트에서는 두 가지 오류가 발생한다.

```tsx
let id = "12-34-56";
fetchProduct(id);

id = 123456;
// ~~ '123456' 형식은 'string' 형식에 할당할 수 없습니다.
fetchProductBySerialNumber(id);
											// ~~ 'string' 형식의 인수는
											//    'number' 형식의 매개변수에 할당될 수 없습니다.
```

⇒ 여기서 **변수의 값은 바뀔 수 있지만 그 타입은 보통 바뀌지 않는다**는 중요한 관점을 알 수 있다.

- 타입을 바꿀 수 있는 한가지 방법은 범위를 좁히는 것인데, 새로운 변수값을 포함하도록 확장하는 것이 아니라 타입을 더 작게 제한하는 것이다.
- 위의 예제에서 오류를 해결하기 위해 id의 타입을 바꾸지 않으려면, string과 number를 모두 포함할 수 있도록 타입을 확장하면된다.
    - 이를 string|number로 표현하며 유니온타입이라고 한다.

```tsx
let id: string|number = "12-34-56";
fetchProduct(id);

const serial = 123456;  // 정상
fetchProductBySerialNumber(serial);  // 정상
```

- 변수를 무분별하게 재사용하면 타입 체커와 사람 모두에게 혼란을 줄 수 있다.
- 다른 타입에는 별도의 변수를 사용하는 게 바람직한 이유
    - 서로 관련이 없는 두 개의 값을 분리한다.
    - 변수명을 더 구체적으로 지을 수 있다.
    - 타입 추론을 향상시키며, 타입 구문이 불필요해진다.
    - 타입이 좀 더 간결해진다.
    - let 대신 const로 변수를 선언하게 된다. const로 변수를 선언하면 코드가 간결해지고, 타입 체커가 타입을 추론하기에도 좋다.
- 타입이 바뀌는 변수는 되도록 피해야 하며, 목적이 다른 곳에는 별도의 변수명을 사용해야 한다.
- but, 재사용되는 변수와 다음 예제에 나오는 가려지는 변수를 혼동해서는 안된다.

```tsx
const id = "12-34-56";
fetchProduct(id);

{
	const id = 123456;  // 정상
	fetchProductBySerialNumber(id);  // 정상
}
```

⇒ 여기서 두 id는 이름이 같지만 실제로는 서로 아무런 관계가 없다. 그러므로 각기 다른 타입으로 사용되어도 문제가 없다. 그러나 동일한 변수명에 타입이 다르다면, 작동에는 문제가 없더라고 사용하는 사람에게 혼란을 줄 수 있기 때문에 목적이 다른 곳에는 별도의 변수명을 사용하는것이 좋다.

### 요약

- 변수의 값은 바뀔 수 있지만 타입은 일반적으로 바뀌지 않는다.
- 혼란을 막기 위해 타입이 다른 값을 다룰 때에는 변수를 재사용하지 않도록 한다.

## item 21. 타입 넓히기

- 런타임에 모든 변수는 유일한 값을 가진다. 그러나 타입스크립트가 작성된 코드를 체크하는 정적 분석 시점에, 변수는 가능한 값들의 집합인 타입을 가진다. 상수를 사용해서 변수를 초기화할 때 타입을 명시하지 않으면 타입 체커는 타입을 결정해야 한다. 이 말은 지정된 단일 값을 가지고 할당 가능한 값들의 집합을 유추해야 한다는 뜻이다.
    - 타입스크립트에서는 이러한 과정을 넓히기 라고 부른다.

```tsx
interface Vector3 { x: number; y: number; z: number; }
function getComponent(vector: Vector3, axis: 'x'|'y'|'z') {
	return vector[axis];
}
```

⇒ Vector3 함수를 사용한 다음 코드는 런타임에 오류 없이 실행되지만, 편집기에서는 오류가 표시된다.

```tsx
let x = 'x';
let vec = {x: 10, y: 20, z: 30};
getComponent(vec, x);
							// ~ 'string' 형식의 인수는 '"x"|"y"|"z"'
							//    형식의 매개변수에 할당될 수 없습니다.
```

⇒ getComponent 함수는 두 번째 매개변수에 “x”|”y”|”z” 타입을 기대했지만, x의 타입은 할당 시점에 넓히기가 동작해서 string으로 추론되었다. 그렇기 때문에 string 타입은 “x”|”y”|”z” 타입에 할당이 불가능하므로 오류가 된 것이다.

```tsx
const mixed = ['x',1];
```

- 위의 코드에서 mixed의 타입이 될 수 있는 후보들
    - (’x’ | 1)[]
    - [’x’, 1]
    - [string, number]
    - readonly [string, number]
    - (string|number) []
    - readonly (string|number) []
    - [any, any]
    - any[]

⇒ 정보가 충분하지 않다면 mixed가 어떤 타입으로 추론되어야 하는지 알 수 없다. 그러므로 타입스크립트는 작성자의 의도를 추측한다.( 이 경우에는 (string|number) [] 으로 추측한다. )

- 처음의 예제에서 타입스크립트는 다음 예제와 같은 코드를 예상했기 때문에 x의 타입을 string으로 추론했다.

```tsx
let x = 'x';
x = 'a';
x = 'Four score and seven years ago...';
```

- 자바스크립트에서는 다음처럼 작성해도 유효하다.

```tsx
let x = 'x';
x = /x|y|z/;
x = ['x', 'y', 'z']
```

- 타입스크립트는 x의 타입을 string으로 추론할 때, 명확성과 유연성 사이의 균형을 유지하려고 한다. 일반적인 규칙은 변수가 선언된 후로는 타입이 바뀌지 않아야 하므로, string|RegExp나 string|string[] 이나 any 보다는 string을 사용하는 게 낫다.
- 타입스크립트는 넓히기의 과정을 제어할 수 있도록 몇 가지 방법을 제공한다.
    - 첫 번째 방법은 const이다.
        - 만약 let 대신 const로 변수를 선언하면 더 좁은 타입이 된다. 그러나 const는 만능이 아니다. 객체와 배열의 경우에는 여전히 문제가 있다. 튜플 타입을 추론해야 할지, 요소들은 어떤 타입으로 추론해야 할지 알 수 없다.
        - 객체의 경우 타입스크립트의 넓히기 알고리즘은 각 요소를 let으로 할당된 것처럼 다룬다.
- 타입 추론의 강도를 직접 제어하려면 타입스크립트의 기본 동작을 재정의해야하는데  이러한 방법은 세가지가 존재한다.
    - 첫 번째는 명시적 타입 구문을 제공하는 것이다.
    
    ```tsx
    const v: { x: 1|3|5 } = {
    	x: 1,
    };  // 타입이 { x: 1|3|5 }
    ```
    
    - 두 번째는 타입 체커에 추가적인 문맥을 제공하는 것이다. (예를 들어, 함수의 매개변수로 값을 전달)
    - 세 번째는 const  단언문을 사용하는 것이다.
    
    ```tsx
    const v1 = {
    	x: 1,
    	y: 2,
    };  // 타입은 { x: number; y: number; }
    
    const v2 = {
    	x: 1 as const,
    	y: 2,
    };  // 타입은 { x: 1; y: number; }
    
    const v3 = {
    	x: 1,
    	y: 2,
    } as const;  // 타입은 { readonly x: 1; readonly y: 2; }
    ```
    
    ⇒ 값 뒤에 as const 를 작성하면, 타입스크립트는 최대한 좁은 타입으로 추론한다.
    
    - 또한 배열을 튜플 타입으로 추론할 때에도 as const 를 사용할 수 있다.
    
    ```tsx
    const a1 = [1, 2, 3];  // 타입이 number[]
    const a2 = [1, 2, 3] as const;  // 타입이 readonly [1, 2, 3]
    ```
    
    ⇒ 넓히기로 인해 오류가 발생한다고 생각되면, 명시적 타입 구문 또는 const 단언문을 추가하는 것을 고려해야 한다.
    

### 요약

- 타입스크립트가 넓히기를 통해 상수의 타입을 추론하는 법을 이해해야 한다.
- 동작에 영향을 줄 수 있는 방법인 const, 타입 구문, 문맥, as const에 익숙해져야 한다.