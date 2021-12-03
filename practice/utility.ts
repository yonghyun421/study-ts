{
    // keyof

    interface User {
        id: number;
        name: string;
        age: number;
        gender: 'm' | 'f';
    }

    type UserKey = keyof User; // 'id' | 'name' | 'age' | 'gender'

    const uk: UserKey = 'id';

    // Partial<T> => 일부만 있어도 에러 X

    interface User2 {
        id: number;
        name: string;
        age: number;
        gender: 'm' | 'f';
    }

    // 아래와 같다고 생각하면 됨
    // interface User2 {
    //     id?: number;
    //     name?: string;
    //     age?: number;
    //     gender?: 'm' | 'f';
    // }

    let admin: Partial<User2> = {
        id: 1,
        name: 'Bob',
    }

    // Require<T> => option 이었던 것도 필수로 바꾼다

    interface User3 {
        id: number;
        name: string;
        age?: number;
    }

    let admin2: Required<User3> = {
        id: 1,
        name: 'Bob',
        age: 30,
    }

    // Readonly<T> => 읽기 전용으로 바꾼다
    // 처음에 할당만 가능하고 나중에 수정은 불가능

    // Record<K, T>

    // 기존 구조
    // interface Score {
    //     '1': 'A' | 'B' | 'C' | 'D';
    //     '2': 'A' | 'B' | 'C' | 'D';
    //     '3': 'A' | 'B' | 'C' | 'D';
    //     '4': 'A' | 'B' | 'C' | 'D';
    // }

    // const score: Score = {
    //     1: 'A',
    //     2: 'B',
    //     3: 'C',
    //     4: 'D',
    // }

    // Record 를 이용하여 다음과 같이 쓸 수 있다
    type Grade = '1' | '2' | '3' | '4';
    type Score = 'A' | 'B' | 'C' | 'D';

    const score: Record<Grade, Score> = {
        1: 'A',
        2: 'B',
        3: 'C',
        4: 'D',
    }

    interface User4 {
        id: number;
        name: string;
        age: number;
    }

    function isValid(user: User4) {
        const result: Record<keyof User4, boolean> = {
            id: user.id > 0,
            name: user.name !== '',
            age: user.age > 0,
        };
        return result;
    }

    // Pick<T, K> => 특정 값만 가져와서 사용할 수 있다

    interface User5 {
        id: number;
        name: string;
        age: number;
        gender: 'M' | 'W';
    }

    const admin3: Pick<User5, 'id' | 'name'> ={
        id: 0,
        name: 'Bob',
    }

    // Omit<T, K> => 특정 프로퍼티를 생략

    interface User6 {
        id: number;
        name: string;
        age: number;
        gender: 'M' | 'W';
    }

    const admin4: Omit<User5, 'id' | 'name'> ={
        age: 0,
        gender: 'M',
    }

    // Exclude<T1, T2> => T1 type에서 T2 type를 제거하고 사용

    type T1 = string | number | boolean;
    type T2 = Exclude<T1, number | string>;

    // NonNullable<Type> => Null, Undefined을 제외한 타입을 생성

    type T3 = string | null | undefined | void;
    type T4 = NonNullable<T3>;
}