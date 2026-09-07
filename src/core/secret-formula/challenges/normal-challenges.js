import { DC } from "../../constants";

//In vanilla Antimatter Dimensions, Normal Challenges are unlocked by having enough Infinities in the current Eternity.
//In Antimatter Dimensions ReChallenged, Antimatter Challenges are unlocked by purchasing the requisite Infinity Upgrade.

export const normalChallenges = [
  {
    id: 1,
    legacyId: 1,
    isQuickResettable: false,
    description() {
      //TODO: reduce all AD multipliers, but compensate by giving free Tickspeed upgrades based on the number of purchased 5th ADs.
      //The reference to 5 is kind of important.  It will be a recurring number for thematic reasons.
      //There's also the part where you can combine this with Eternity Challenge 11 to get pure upside!
      return `all Antimatter Dimensions are ${format(1e10)} times weaker.`;
      //It'll be intended that you use a "start with Antimatter already" type of effect to make this one feasible
    },
    reward: "WIP - not decided yet" //Reward: gain a multiplier to Infinity Points based on the number of Normal Challenges completed.
  },
  {
    id: 2,
    legacyId: 2,
    isQuickResettable: false,
    //Compared to vanilla Antimatter Dimensions, the penalty on this one is made harsher.  There is no upside.
    //I'm happy with the balancing on this one :D
    //TODO: I need to account for this one in the Multiplier Breakdown tab, somehow.  It's already accounted for
    // in the Antimatter Dimensions multiplier breakdown, but that's not correct as this doesn't affect
    // Dimension multipliers.  I should put it into the breakdown for "Antimatter Production" & do the same thing
    // as Tickspeed where I power it by the number of active Dimension tiers.
    description:
      () => "buying Antimatter Dimensions or Tickspeed upgrades halts production of all Antimatter Dimensions. " +
      `Production gradually returns to normal over ${formatInt(3)} minutes.`,
    reward: "Ability to upgrade the Antimatter Dimension Autobuyers"
  },
  {
    id: 3,
    legacyId: 3,
    isQuickResettable: false,
    description:
    //This one is too easy.  I should make it harder, somehow.
    //How about, "Infinity Upgrades which grant multipliers to Antimatter Dimensions are disabled"
      `the 1st Antimatter Dimension is heavily weakened, but gets an uncapped exponentially increasing multiplier.
        This multiplier resets after Dimension Boosts and Antimatter Galaxies.`,
    reward: "WIP - not decided yet" //Reward: passively generate Infinity Points based on your best IP per minute in this Eternity.
  },
  {
    id: 4,
    legacyId: 8,
    isQuickResettable: false,
    //TODO: no.  Completely rework this one.  Come up with something more interesting.
    //How about "Antimatter Galaxies operate at only 1% of their strength, but the requirements are lowered?" or similar
    //In this one, Antimatter Galaxy requirement will be lowered, so the player will get, like, 5 or 6 Galaxies, 
    description: "buying an Antimatter Dimension automatically erases all lower tier Antimatter Dimensions, " +
      "like a sacrifice without the boost.",
    reward: "WIP - not decided yet"
  },
  {
    id: 5,
    legacyId: 6,
    isQuickResettable: false,
    description:
    //TODO: make this one even harsher.  Maybe 1.008?
    // The strategy for this Challenge will be to deliberately avoid getting Galaxies because they're too weak to be worth your time.
      () => `the Tickspeed purchase multiplier starts at ${formatX(1.080, 0, 3)} instead of ${formatX(1.1245, 0, 3)}.`,
    reward: "WIP - not decided yet"
  },
  {
    id: 6,
    legacyId: 10,
    isQuickResettable: false,
    //I might want to make this harder by raising prices significantly.  The idea is that the player's progression will come not from purchasing Dimensions (as it'll cost too much), but mostly from Tickspeed improvements.
    description: () => `upgrading each Antimatter Dimension costs the Antimatter Dimension ${formatInt(2)} tiers ` +
      "below it instead of antimatter. Antimatter Dimension prices are modified.",
    reward: "WIP - not decided yet" //Reward: Dimension Boosts require 5 fewer Antimatter Dimensions
  },
  {
    id: 7,
    legacyId: 9,
    isQuickResettable: false,
    description: () =>
      //This one is TOO EASY, I think.  Let's set a lower maximum.  Maybe 1.2?  And say it's +0.01 per DimBoost, so it takes 20 DimBoosts to cap?
    //TODO: visibly disable any Infinity Upgrades which grant a "buy 10 multi" effect while this challenge is running
      `the multiplier from buying ${formatInt(10)} Antimatter Dimensions is reduced to ${formatX(1)}. This increases by
        +${format(0.02, 2, 2)} per Dimension Boost, to a maximum of ${formatX(1.2,2,2)}, and is unaffected by any upgrades.`,
    reward: "WIP - not decided yet" //Planned reward: multiplier to all Antimatter Dimensions based on Dimension Boost multiplier.  f(x)=x^x
  },
  {
    id: 8,
    legacyId: 11,
    isQuickResettable: false,
    //This challenge is deliberately left easy.  It'll be used later to help the player get Dimensional-Sacrifice-related Achievements.
    description: `Dimension Boosts provide no multiplier and Antimatter Galaxies cannot be bought. Dimensional
      Sacrifice resets antimatter and all Antimatter Dimensions, but also gives a significantly stronger multiplier.`,
    reward: "WIP - not decided yet" //Planned reward:
  },
  {
    id: 9,
    legacyId: 5,
    isQuickResettable: true,
    description: () => `whenever you buy Tickspeed upgrades or ${formatInt(10)} of an Antimatter Dimension, ` +
      "everything else of equal cost will increase to its next cost step.",
    reward: "Upgradeable Tickspeed Autobuyer"
  },
  {
    id: 10,
    legacyId: 4,
    isQuickResettable: false,
    //TODO: change this one to be "there are only 5 Antimatter Dimensions" since the player's character was originally a 5-dimensional being
    description: () => `there are only ${formatInt(6)} Antimatter Dimensions. Dimension Boost ` +
      "and Antimatter Galaxy costs are modified.",
    reward: "Dimension Boosts Autobuyer"
  },
  {
    id: 11,
    legacyId: 12,
    isQuickResettable: true,
    description: () => `there is normal matter which rises once you have at least ${formatInt(1)} 2nd Antimatter ` +
      "Dimension. If it exceeds your antimatter, it will Dimension Boost without giving the bonus.",
    reward: "Antimatter Galaxies Autobuyer"
  },
  {
    id: 12,
    legacyId: 7,
    isQuickResettable: false,
    description: () => `each Antimatter Dimension produces the Dimension ${formatInt(2)} tiers below it
      instead of ${formatInt(1)}. Both 1st and 2nd Dimensions produce antimatter.
      The 2nd, 4th, and 6th Dimensions are made stronger to compensate.`,
    reward: "Big Crunches Autobuyer"
  }
];
