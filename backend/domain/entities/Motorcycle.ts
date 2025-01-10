import { Entity } from "./Entity";

export class Motorcycle implements Entity {
    private constructor(
        /**
         * @description Immatriculation
         */
        public readonly identifier: number,
        
        /**
         * @description Kilométrage
         */
        public readonly mileage: number,

        /**
         * @description Date de mise en service
         */
        public readonly dateOfCommissioning: Date,
        
        /**
         * @description Statut
         */
        public readonly status: string,
    ) {}

    public static from(
        identifier: number,
        mileage: number,
        dateOfCommissioning: Date,
        status: string,
    ): Motorcycle {
        return new Motorcycle(
            identifier,
            mileage,
            dateOfCommissioning,
            status,
        );
    }
}