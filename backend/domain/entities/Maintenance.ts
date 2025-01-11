import { Entity } from "./Entity";
import { Motorcycle } from "./Motorcycle";
// import { ReplacedParts } from "./ReplacedParts";

export class Maintenance implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly date: Date,
    public readonly motorcycle: Motorcycle,
    // public readonly replacedParts: ReplacedParts,
    public readonly cost: number,
    public readonly recommendation: string
  ) {}

  public static from(
    identifier: string,
    date: Date,
    Motorcycle: Motorcycle,
    // replacedParts: ReplacedParts,
    cost: number,
    recommendation: string
  ): Maintenance {
    return new Maintenance(
      identifier,
      date,
      Motorcycle,
      // replacedParts,
      cost,
      recommendation
    );
  }
}
