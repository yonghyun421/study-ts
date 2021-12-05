{
    class Dog {
        name: string;
        sayHello(): string{

        };
    }

    class Fish {
        name: string;
        dive(howDeep: number): string{

        };
    }

    type Pet = Dog | Fish;

    const talkToPet(pet: Pet): string {
        typeof(pet === 'Dog'){
            pet.sayHello();
        } else {
            'Fish cannot talk, sorry.'
        }
    }
}