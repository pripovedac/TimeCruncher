class Hero {
    constructor(name, specialAbility) {
        // setting property values
        this._name = name;
        this._specialAbility = specialAbility;

        // declaring a method on the object
        this.getDetails = function() {
            `${this._name} can ${this._specialAbility}`
        };
    }
}

class ExtendedHero extends Hero {
    constructor(name, specialAbility, suit) {
        super(name, specialAbility)
        this._suitColor = suit

        // this.getDetails = function () {
        //     return super.getDetails() + `and has ${suit} suit.`
        // }
    }


}

export const IronMan = new ExtendedHero('Iron man', 'fly', 'red')
