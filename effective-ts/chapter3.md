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