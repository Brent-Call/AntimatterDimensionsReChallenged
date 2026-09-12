import { DC } from "./constants";

export function effectiveBaseGalaxies() {
  let antimatterGalaxies = player.galaxies;
  if (NormalChallenge(4).isRunning) {
    antimatterGalaxies *= 0.035;
  }
  // Note that this already includes the "50% more" active path effect
  let replicantiGalaxies = Replicanti.galaxies.bought;
  replicantiGalaxies *= (1 + Effects.sum(
    TimeStudy(132),
    TimeStudy(133)
  ));
  // "extra" galaxies unaffected by the passive/idle boosts come from studies 225/226 and Effarig Infinity
  replicantiGalaxies += Replicanti.galaxies.extra;
  const nonActivePathReplicantiGalaxies = Math.min(Replicanti.galaxies.bought,
    ReplicantiUpgrade.galaxies.value);
  // Effects.sum is intentional here - if EC8 is not completed,
  // this value should not be contributed to total replicanti galaxies
  replicantiGalaxies += nonActivePathReplicantiGalaxies * Effects.sum(EternityChallenge(8).reward);
  let freeGalaxies = player.dilation.totalTachyonGalaxies;
  freeGalaxies *= 1 + Math.max(0, Replicanti.amount.log10() / 1e6) * AlchemyResource.alternation.effectValue;
  return Math.max(antimatterGalaxies + GalaxyGenerator.galaxies + replicantiGalaxies + freeGalaxies, 0);
}

/**
 * Returns the total effect of all Galaxies on Tickspeed Upgrades.
 * This accounts for all effects which make Galaxies stronger or weaker.
 * This accounts for all effects which act on specific Galaxies as well as effects which act on ALL Galaxies.
 * This accounts for all types of Galaxies summed together.
 * Edge case: Does not account for Infinity Challenge 3, which bypasses Galaxies altogether.
 * @returns {number}
 */
export function getTotalGalaxyPower() {
  if (Ra.isRunning) {
    //Ra's Reality shuts down Galaxy effects on Tickspeed.
    return 0;
  }
  let galaxies = effectiveBaseGalaxies();
  var effects = Effects.product(
    InfinityUpgrade.galaxyBoost,
    InfinityUpgrade.galaxyBoost.chargedEffect,
    BreakInfinityUpgrade.galaxyBoost,
    TimeStudy(212),
    TimeStudy(232),
    Achievement(86),
    Achievement(178),
    InfinityChallenge(5).reward,
    PelleUpgrade.galaxyPower,
    PelleRifts.decay.milestones[1]
  );

  InfinityUpgradesNew.all.forEach((upgrade) => {
    if (upgrade.config.effectTarget === "allGalaxyStrength") {
      effects = effects * upgrade.effectOrDefault(1);
    }
  });

  galaxies *= effects;
  galaxies *= getAdjustedGlyphEffect("cursedgalaxies");
  galaxies *= getAdjustedGlyphEffect("realitygalaxies");
  galaxies *= 1 + ImaginaryUpgrade(9).effectOrDefault(0);
  if (Pelle.isDoomed) galaxies *= 0.5;

  galaxies *= Pelle.specialGlyphEffect.power;
  return galaxies;
}

/**
 * Returns the effect on Tickspeed of ONE Tickspeed Upgrade.
 * Basically, this is just "base multiplier" combined with "effect of all Galaxies."
 * Accounts for all edge cases like Normal Challenge 5, Infinity Challenge 3, Ra's Reality, etc.
 * @param {boolean} [ignoreNC5] If truthy, will act as though we are not in Normal Challenge 5.
 *                              If falsy, reads from the current game-state whether or not we're in Normal Challenge 5.
 * @returns {Decimal}
 */
export function getTickSpeedMultiplier(ignoreNC5) {
  if (InfinityChallenge(3).isRunning) return DC.D1;
  const baseMultiplier = (!ignoreNC5 && NormalChallenge(5).isRunning) ? 1.008 : 1.1245;
  //Note that this is COMPLETELY CHANGED from how it is in vanilla Antimatter Dimensions.
  //superExponentialScaling is based on the baseMultiplier such that at very, very large numbers of Galaxies, baseMultiplier is still influential.
  const numGalaxies = getTotalGalaxyPower();
  const superExponentialScaling = numGalaxies + ((baseMultiplier - 1) / 12.45) * numGalaxies * numGalaxies;
  return DC.D1_01760804537.pow(superExponentialScaling).times(baseMultiplier).recip();
}

export function buyTickSpeed() {
  if (!Tickspeed.isAvailableForPurchase || !Tickspeed.isAffordable) return false;

  if (NormalChallenge(9).isRunning) {
    Tickspeed.multiplySameCosts();
  }
  Tutorial.turnOffEffect(TUTORIAL_STATE.TICKSPEED);
  Currency.antimatter.subtract(Tickspeed.cost);
  player.totalTickBought++;
  player.records.thisInfinity.lastBuyTime = player.records.thisInfinity.time;
  player.requirementChecks.permanent.singleTickspeed++;
  if (NormalChallenge(2).isRunning) {
    player.chall2Timer = 0;
    player.chall2Pow = 0;
  }
  GameUI.update();
  return true;
}

export function buyMaxTickSpeed() {
  if (!Tickspeed.isAvailableForPurchase || !Tickspeed.isAffordable) return;
  let boughtTickspeed = false;

  Tutorial.turnOffEffect(TUTORIAL_STATE.TICKSPEED);
  if (NormalChallenge(9).isRunning) {
    const goal = Player.infinityGoal;
    let cost = Tickspeed.cost;
    while (Currency.antimatter.gt(cost) && cost.lt(goal)) {
      Tickspeed.multiplySameCosts();
      Currency.antimatter.subtract(cost);
      player.totalTickBought++;
      boughtTickspeed = true;
      cost = Tickspeed.cost;
    }
  } else {
    const purchases = Tickspeed.costScale.getMaxBought(player.totalTickBought, Currency.antimatter.value, 1);
    if (purchases === null) {
      return;
    }
    Currency.antimatter.subtract(Decimal.pow10(purchases.logPrice));
    player.totalTickBought += purchases.quantity;
    boughtTickspeed = true;
  }

  if (boughtTickspeed) {
    player.records.thisInfinity.lastBuyTime = player.records.thisInfinity.time;
    if (NormalChallenge(2).isRunning) {
      player.chall2Timer = 0;
      player.chall2Pow = 0;
    }
  }
}

export function resetTickspeed() {
  player.totalTickBought = 0;
  player.chall9TickspeedCostBumps = 0;
}

export const Tickspeed = {

  get isUnlocked() {
    return AntimatterDimension(2).bought > 0 || EternityMilestone.unlockAllND.isReached ||
      PlayerProgress.realityUnlocked();
  },

  get isAvailableForPurchase() {
    return this.isUnlocked &&
      !EternityChallenge(9).isRunning &&
      !Laitela.continuumActive &&
      (player.break || this.cost.lt(Decimal.NUMBER_MAX_VALUE));
  },

  get isAffordable() {
    return Currency.antimatter.gte(this.cost);
  },

  get multiplier() {
    return getTickSpeedMultiplier();
  },

  get current() {
    if (!Achievement(11).isEffectActive) {
      //Set tickspeed to 0 if the player doesn't have the Achievement:
      return Decimal.MAX_VALUE;
    }
    const tickspeed = Effarig.isRunning
      ? Effarig.tickspeed
      : this.baseValue.powEffectOf(DilationUpgrade.tickspeedPower);
    return player.dilation.active || PelleStrikes.dilation.hasStrike ? dilatedValueOf(tickspeed) : tickspeed;
  },

  get cost() {
    return this.costScale.calculateCost(player.totalTickBought + player.chall9TickspeedCostBumps);
  },

  get costScale() {
    return new ExponentialCostScaling({
      baseCost: 1000,
      baseIncrease: 10,
      costScale: Player.tickSpeedMultDecrease,
      scalingCostThreshold: Number.MAX_VALUE
    });
  },

  get continuumValue() {
    if (!this.isUnlocked) return 0;
    return this.costScale.getContinuumValue(Currency.antimatter.value, 1) * Laitela.matterExtraPurchaseFactor;
  },

  get baseValue() {
    if (!Achievement(11).isEffectActive) {
      //Set tickspeed to 0 if the player doesn't have the Achievement:
      return Decimal.MAX_VALUE;
    }
    return DC.E3.divide(Achievements.getBaseTickspeed()).times(getTickSpeedMultiplier().pow(this.totalUpgrades));
  },

  get totalUpgrades() {
    let boughtTickspeed;
    if (Laitela.continuumActive) boughtTickspeed = this.continuumValue;
    else boughtTickspeed = player.totalTickBought;
    return boughtTickspeed + player.totalTickGained + FreeTickspeed.fromChall1;
  },

  get perSecond() {
    if (!Achievement(11).isEffectActive) {
      //Set tickspeed to 0 if the player doesn't have the Achievement:
      return DC.D0;
    }
    return Decimal.divide(1000, this.current);
  },

  multiplySameCosts() {
    for (const dimension of AntimatterDimensions.all) {
      if (dimension.cost.e === this.cost.e) dimension.costBumps++;
    }
  }
};


export const FreeTickspeed = {
  BASE_SOFTCAP: 300000,
  GROWTH_RATE: 6e-6,
  GROWTH_EXP: 2,
  multToNext: 1.33,

  /**
   * Normal Challenge 1 effect: get some free Tickspeed upgrades
   */
  get fromChall1() {
    if (NormalChallenge(1).isRunning) {
      return AntimatterDimension(5).bought / 5;
    }
    return 0;
  },

  get amount() {
    return player.totalTickGained + this.fromChall1;
  },

  get softcap() {
    let softcap = FreeTickspeed.BASE_SOFTCAP;
    if (Enslaved.has(ENSLAVED_UNLOCKS.FREE_TICKSPEED_SOFTCAP)) {
      softcap += 100000;
    }
    return softcap;
  },

  fromShards(shards) {
    const tickmult = (1 + (Effects.min(1.33, TimeStudy(171)) - 1) *
      Math.max(getAdjustedGlyphEffect("cursedtickspeed"), 1));
    const logTickmult = Math.log(tickmult);
    const logShards = shards.ln();
    const uncapped = Math.max(0, logShards / logTickmult);
    if (uncapped <= FreeTickspeed.softcap) {
      this.multToNext = tickmult;
      return {
        newAmount: Math.ceil(uncapped),
        nextShards: Decimal.pow(tickmult, Math.ceil(uncapped))
      };
    }
    // Log of (cost - cost up to softcap)
    const priceToCap = FreeTickspeed.softcap * logTickmult;
    // In the following we're implicitly applying the function (ln(x) - priceToCap) / logTickmult to all costs,
    // so, for example, if the cost is 1 that means it's actually exp(priceToCap) * tickmult.
    const desiredCost = (logShards - priceToCap) / logTickmult;
    const costFormulaCoefficient = FreeTickspeed.GROWTH_RATE / FreeTickspeed.GROWTH_EXP / logTickmult;
    // In the following we're implicitly subtracting softcap from bought,
    // so, for example, if bought is 1 that means it's actually softcap + 1.
    // The first term (the big one) is the asymptotically more important term (since FreeTickspeed.GROWTH_EXP > 1),
    // but is small initially. The second term allows us to continue the pre-cap free tickspeed upgrade scaling
    // of tickmult per upgrade.
    const boughtToCost = bought => costFormulaCoefficient * Math.pow(
      Math.max(bought, 0), FreeTickspeed.GROWTH_EXP) + bought;
    const derivativeOfBoughtToCost = x => FreeTickspeed.GROWTH_EXP * costFormulaCoefficient * Math.pow(
      Math.max(x, 0), FreeTickspeed.GROWTH_EXP - 1) + 1;
    const newtonsMethod = bought => bought - (boughtToCost(bought) - desiredCost) / derivativeOfBoughtToCost(bought);
    let oldApproximation;
    let approximation = Math.min(
      desiredCost,
      Math.pow(desiredCost / costFormulaCoefficient, 1 / FreeTickspeed.GROWTH_EXP)
    );
    let counter = 0;
    // The bought formula is concave upwards. We start with an over-estimate; when using newton's method,
    // this means that successive iterations are also over-etimates. Thus, we can just check for continued
    // progress with the approximation < oldApproximation check. The counter is a fallback.
    do {
      oldApproximation = approximation;
      approximation = newtonsMethod(approximation);
    } while (approximation < oldApproximation && ++counter < 100);
    const purchases = Math.floor(approximation);
    // This undoes the function we're implicitly applying to costs (the "+ 1") is because we want
    // the cost of the next upgrade.
    const next = Decimal.exp(priceToCap + boughtToCost(purchases + 1) * logTickmult);
    this.multToNext = Decimal.exp((boughtToCost(purchases + 1) - boughtToCost(purchases)) * logTickmult);
    return {
      newAmount: purchases + FreeTickspeed.softcap,
      nextShards: next,
    };
  }

};
