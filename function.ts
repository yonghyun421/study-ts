{
    // 함수

    function hello(name?: string) {
        return `Hello, ${name || 'world'}`;
    }

    function hello2(name = 'world') {
        return `Hello, ${name}`;
    }

    const result = hello();
    const result2 = hello('Sam');

    function hello3(name: string, age: number): string {
        if(age !== undefined) {
            return `Hello, ${name}. You are ${age}.`;
        } else {
            return `Hello, ${name}`;
        }
    }

    function add(...nums: number[]) {
        return nums.reduce((result, num) => result + num, 0 );
    }

    add(1, 2, 3); // 6
    add(1, 2, 3, 4, 5, 6, 7, 8, 9, 10); // 55

    interface User {
        name: string;
    }

    const Sam: User = {name: 'Sam'}

    function showName(this: User, age: number, gender: 'm' | 'f'){
        console.log(this.name, age, gender)
    }

    const a = showName.bind(Sam);
    a(30, 'm');

    interface User2 {
        name: string;
        age: number;
    }

    function join(name: string, age: string): string; // overload 전달받은 매개변수의 개수나 
    function join(name: string, age: number): User2; // type에 따라 다르게 
    function join(name: string, age: number | string): User2 | string {
        if(typeof age === 'number') {
            return {
                name,
                age,
            };
        } else {
            return '나이는 숫자로 입력해주세요.';
        }
    }

    const sam: User2 = join('Sam', 30); // 반환하는 type이 확실하지 않아서 에러 발생
    const jane: string = join('Jane', '30');

}