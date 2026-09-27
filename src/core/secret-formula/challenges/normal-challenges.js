import { DC } from "../../constants";

//In vanilla Antimatter Dimensions, Normal Challenges are unlocked by having enough Infinities in the current Eternity.
//In Antimatter Dimensions ReChallenged, Antimatter Challenges are unlocked by purchasing the requisite Infinity Upgrade.

export const normalChallenges = [
  {
    id: 1,
    legacyId: 1,
    isQuickResettable: false,
    //It'll be intended that you use a "start with Antimatter already" type of effect to make this one feasible.
    //I'm satisfied with the balancing on this one :D
    description() {
      return `all Antimatter Dimensions gain a divisor of /${format(1e10)}. ` +
        `You gain ${format(1/5, 1, 1)} free Tickspeed upgrades for every purchased 5th Antimatter Dimension.`;
    },
    reward: "Break Infinity"
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
    reward: "Upgradeable Antimatter Dimension Autobuyers"
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
    reward: () => `Passively generate ${formatInt(1)} Infinity per second`
  },
  {
    id: 4,
    legacyId: 8,
    isQuickResettable: false,
    //I'm satisfied with the balancing on this one.
    //Hopefully, this'll make for some interesting interactions in the later stages of the game.
    description: () => `Antimatter Galaxies operate at only ${formatPercents(0.035, 1)} of their strength, but their requirements are lowered. ` +
      "Dimension Boost requirements are increased.",
    reward: () => `${formatX(3)} Infinity Point gain`
  },
  {
    id: 5,
    legacyId: 6,
    isQuickResettable: false,
    description:
    //The strategy for this Challenge will be to deliberately avoid getting Galaxies because they're too weak to be worth your time.
    //The balancing for this one is... hmmm... the scaling on the "buy 10" multiplier might be a little bit too fast, actually.
    //It's OK for now, but we might have to reevaluate this one later.
      () => `the Tickspeed purchase multiplier starts at ${formatX(1.008, 0, 3)} instead of ${formatX(1.1245, 0, 3)}, ` +
      `but the multiplier from buying ${formatInt(10)} Antimatter Dimensions increases slowly over time.`,
    reward: "Only outside Challenges, start Infinities with an Antimatter Galaxy"
  },
  {
    id: 6,
    legacyId: 10,
    isQuickResettable: false,
    //Compared to vanilla AD, the prices have been increased.
    //I'm satisfied with the balancing on this one.
    description: () => `upgrading each Antimatter Dimension costs the Antimatter Dimension ${formatInt(2)} tiers ` +
      "below it instead of antimatter. Antimatter Dimension prices are modified.",
    reward: "Decrease the number of Dimensions needed for Dimension Boosts by 5"
  },
  {
    id: 7,
    legacyId: 9,
    isQuickResettable: false,
    description: () =>
    //This is one of the harder Challenges in the set, but I'm fine with it as-is.
      `the multiplier from buying ${formatInt(10)} Antimatter Dimensions is reduced to ${formatX(1)}. This increases by
        +${format(0.02, 2, 2)} per Dimension Boost, to a maximum of ${formatX(1.2,2,2)}, and is unaffected by any upgrades.`,
    reward: () => `Gain ${formatInt(2)} ghost Dimension Boosts, which always affect all Antimatter Dimensions but don't unlock anything` //TODO: in the multiplier breakdown tab, separate ghost boosts from purchased boosts
  },
  {
    id: 8,
    legacyId: 11,
    isQuickResettable: false,
    //This challenge is deliberately left easy.  It'll be used later to help the player get Dimensional-Sacrifice-related Achievements.
    //Since this is one of the easier Challenges, its reward should be comparatively small.
    description: `Dimension Boosts provide no multiplier and Antimatter Galaxies cannot be bought. Dimensional
      Sacrifice resets antimatter and all Antimatter Dimensions, but also gives a significantly stronger multiplier.`,
    reward: () => `${formatX(8)} on all Antimatter Dimensions` //TODO: account for this in the multiplier breakdown tab
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
    //This one is way too easy.  Simply waaaaay too easy.  I'll have to take a look at it.
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

//PLANNED: Challenge 13.  Reward: "Unlock the buy max Dimension Boost Autobuyer mode"
//PLANNED: Challenge 14.  Reward: "Autobuyers unlocked or improved by Normal Challenges work twice as fast"
//PLANNED: Challenge 15.  Reward: Probably a boost to Antimatter Galaxy strength, or something?  IDK.
