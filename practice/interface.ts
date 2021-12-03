{
    type Score = 'A' | 'B' | 'C' | 'F';

    interface User {
    	name : string;
    	age : number;
    	gender? : string; // optional
    	readonly birthYear : number; // 읽기만 가능하고 수정 불가능
        [grade: number] : Score;
    }

    let user : User = {
    	name : 'xx',
    	age : 30,
    	birthYear : 2000,
        1 : 'A',
        2 : 'B',
    }

    interface Add {
        (num1: number, num2: number): number; 
    }

    const add: Add = function(x, y){
        return x + y;
    }

    add(10, 20);

    interface IsAdult {
        (age: number): boolean;
    }

    const a: IsAdult = (age) => {
        return age > 19;
    }

    a(33) // true

    // implements

    interface Car {
        color: string;
        wheels: number;
        start(): void;
    }

    class Bmw implements Car {
        color;
        wheels=4;
        constructor(c: string){
            this.color = c;
        }
        start(){
            console.log('go..');
        }
    }

    const b = new Bmw('green');
    console.log(b);
    b.start();

    // extends

    interface Benz extends Car {
        door: number;
        stop(): void;
    }

    const benz: Benz = {
        door: 5,
        stop(){
            console.log('stop');
        },
        color: 'black',
        wheels: 4,
        start(){
            console.log('..go');
        }
    }

    // extends는 여러개의 interface를 동시에 확장하는 것도 가능
}