{
    // Literal Types

    const userName1 = 'Bob';
    let userName2: string | number = 'Tom';
    userName2 = 3

    type Job = 'police' | 'developer' | 'teacher';

    interface User {
        name: string;
        job: Job;
    }

    const user: User = {
        name: 'Bob',
        job: 'developer',
    }

    interface HighSchoolStudent {
        name: string;
        grade: 1 | 2 | 3; // | Union Type
    }

    // Union Type

    interface Car {
        name: 'car';
        color: string;
        start(): void;
    }

    interface Mobile {
        name: 'mobile';
        color: string;
        call(): void;
    }

    // 식별 가능한 유니온 타입

    function getGift(gift: Car | Mobile) {
        console.log(gift.color);
        if(gift.name === 'car') {
            gift.start();
        } else {
            gift.call();
        }
    }

    // Intersection Types 교차타입

    interface Car2 {
        name: string;
        start(): void;
    }

    interface Toy {
        name: string;
        color: string;
        price: number;
    }

    const toyCar: Toy & Car2 = {
        name: '타요',
        start() {},
        color: 'blue',
        price: 1000,
    };
}