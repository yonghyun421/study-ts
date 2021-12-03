{
    // Generic

    function getSize<T>(arr: T[]): number {
        return arr.length;
    }

    const arr1 = [1, 2, 3];
    getSize<number>(arr1); // 3

    const arr2 = ['a', 'b', 'c'];
    getSize<string>(arr2);

    const arr3 = [false, true, true];
    getSize<boolean>(arr3);


    interface Mobile<T> {
        name: string;
        price: number;
        option: T;
    }

    const m1: Mobile<{color: string, coupon: boolean}> = {
        name: 's21',
        price: 1000,
        option: {
            color: 'red',
            coupon: false,
        }
    }

    const m2: Mobile<string> = {
        name: 's20',
        price: 900,
        option: 'good'
    }

    interface User {
        name: string;
        age: number;
    }

    interface Car {
        name: string;
        color: string;
    }

    interface Book {
        price: number;
    }

    const user: User = {name: 'a', age: 10};
    const car: Car = {name: 'bmw', color: 'red'};
    const book: Book = {price: 3000};

    function showName2<T extends { name: string }>(data: T): string {
        return data.name;
    }

    showName2(user);
    showName2(car);
    // showName(book);
}