{
    class Car {
        // color: string;
        constructor(public color: string){
            this.color = color;
        }
        start() {
            console.log('start');
        }
    }

    const bmw = new Car('red')

    // 접근 제한자(Access modifier) - public, private, protected
    // private, # => 자식 클래스에서 사용 불가능
    // protected => 자식 클래스 내부에서만 접근 가능 다른곳에서는 접근 불가능

    class Car2 {
        readonly name: string = 'car';
        color: string;
        static wheels = 4;
        constructor(color: string){
            this.color = color;
        }
        start() {
            console.log('start');
            console.log(this.name);
            console.log(Car2.wheels)
        }
    }

    class Bmw extends Car2 {
        constructor(color: string, name) {
            super(color);
        }
        showName() {
            console.log(super.name);
        }
    }

    const z4 = new Bmw('black', 'zzz4');
    console.log(z4.name)
    console.log(Car2.wheels)
    // z4.name = 'zzz4';

    // 추상 class => new를 이용해서 객체 불가능 오직 상속을 통해서만
    // 상속받은 쪽에서 구체적인 기능을 구현 해줘야 하고 넘겨줄때는 이름정도만 알려준다

    abstract class Car3 {
        color: string;
        constructor(color: string) {
            this.color = color;
        }
        start() {
            console.log('start');
        }
        abstract doSomething(): void;
    }

    class Bmw2 extends Car3 {
        constructor(color: string) {
            super(color);
        }
        doSomething() {
            alert(3);
        }
    }

    const z5 = new Bmw2('black');
}