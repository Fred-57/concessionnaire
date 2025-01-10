import { Entity } from "./Entity";

export class Model implements Entity {
    private constructor(
        public readonly identifier: number,        
        public readonly name: string,
        public readonly repairMileage: number,
        public readonly repairDeadline: Date,
    ) {}

    public static from(
        identifier: number,
        name: string,
        repairMileage: number,
        repairDeadline: Date,
    ): Model {
        return new Model(
            identifier,
            name,
            repairMileage,
            repairDeadline,
        );
    }
}