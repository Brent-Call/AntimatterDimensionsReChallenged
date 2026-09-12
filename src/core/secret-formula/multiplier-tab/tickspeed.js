import { DC } from "../../constants";
import { FreeTickspeed, getTotalGalaxyPower } from "../../tickspeed";

import { MultiplierTabHelper } from "./helper-functions";
import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const tickspeed = {
  total: {
    name: "Total Tickspeed",
    displayOverride: () => {
      const tickRate = Tickspeed.perSecond;
      if (tickRate.eq(0)) {
        return "not unlocked yet";
      }
      const activeDims = MultiplierTabHelper.activeDimCount("AD");
      const dimString = MultiplierTabHelper.pluralizeDimensions(activeDims);
      return `${format(tickRate, 2, 2)}/sec on ${formatInt(activeDims)} ${dimString}
        ➜ ${formatX(tickRate.pow(activeDims), 2, 2)}`;
    },
    // This is necessary to make multValue entries from the other props scale properly, which are also all pow10
    // due to the multiplier tab splitting up entries logarithmically
    fakeValue: DC.E100,
    multValue: () => Tickspeed.perSecond.pow(MultiplierTabHelper.activeDimCount("AD")),
    isActive: () => Achievement(11).isUnlocked,
    dilationEffect: () => (Effarig.isRunning ? Effarig.tickDilation : 1),
    overlay: ["<i class='fa-solid fa-clock' />"],
    icon: MultiplierTabIcons.TICKSPEED,
  },
  base: {
    name: "Base Tickspeed from Achievements",
    displayOverride: () => {
      return `${format(Achievements.getBaseTickspeed(), 2, 2)}/sec`;
    },
    multValue: () => new Decimal.pow10(100 * MultiplierTabHelper.decomposeTickspeed().base),
    isActive: () => Achievement(11).isUnlocked,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  upgrades: {
    name: "Tickspeed Upgrades",
    displayOverride: () => `${formatInt(Tickspeed.totalUpgrades)} Total`,
    multValue: () => new Decimal.pow10(100 * MultiplierTabHelper.decomposeTickspeed().tickspeed),
    isActive: true,
    icon: MultiplierTabIcons.PURCHASE("AD"),
  },
  galaxies: {
    name: "Galaxies",
    displayOverride: () => {
      return `${formatFloat(getTotalGalaxyPower(), 2)} Total`;
    },
    multValue: () => new Decimal.pow10(100 * MultiplierTabHelper.decomposeTickspeed().galaxies),
    isActive: () => Math.abs(getTotalGalaxyPower()) > 0.0001,
    icon: MultiplierTabIcons.GALAXY,
  },
  baseMultiplierReduction: {
    name: "Antimatter Challenge 5 effect",
    displayOverride: () => {
      const numUpgrades = Tickspeed.totalUpgrades;
      const multiplierPostGalaxies = getTickSpeedMultiplier(true /*ignore NC5*/).recip();
      const multiplierPostNC5 = getTickSpeedMultiplier(false /*ignore NC5*/).recip();
      const tickspeedWithGalaxies = multiplierPostGalaxies.pow( numUpgrades );
      const tickspeedWithNC5 = multiplierPostNC5.pow( numUpgrades );
      const contributionFromNC5 = tickspeedWithNC5.dividedBy( tickspeedWithGalaxies );
      return `/${format(contributionFromNC5.reciprocal(), 2, 2)}`;
    },
    multValue: () => new Decimal.pow10(100 * MultiplierTabHelper.decomposeTickspeed().reduction),
    isActive: () => Math.abs(MultiplierTabHelper.decomposeTickspeed().reduction) > 0.0001,
    icon: MultiplierTabIcons.CHALLENGE("antimatter", 5),
  },
  pelleTickspeedPow: {
    name: "Tickspeed Dilation Upgrade",
    powValue: () => DilationUpgrade.tickspeedPower.effectValue,
    isActive: () => DilationUpgrade.tickspeedPower.canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("dilation"),
  },
};

export const tickspeedUpgrades = {
  purchased: {
    name: "Purchased Tickspeed Upgrades",
    displayOverride: () => (Laitela.continuumActive
      ? formatFloat(Tickspeed.continuumValue, 2, 2)
      : formatInt(player.totalTickBought)),
    multValue: () => Decimal.pow10(Laitela.continuumActive ? Tickspeed.continuumValue : player.totalTickBought),
    isActive: () => true,
    icon: MultiplierTabIcons.PURCHASE("AD"),
  },
  fromChall1: {
    name: "Tickspeed Upgrades from Antimatter Challenge 1",
    displayOverride: () => formatFloat(FreeTickspeed.fromChall1, 1),
    multValue: () => Decimal.pow10(FreeTickspeed.fromChall1),
    isActive: () => FreeTickspeed.fromChall1 > 0,
    icon: MultiplierTabIcons.CHALLENGE("antimatter", 1),
  },
  fromTimeDimensions: {
    name: "Tickspeed Upgrades from Time Dimensions",
    displayOverride: () => formatInt(player.totalTickGained),
    multValue: () => Decimal.pow10(player.totalTickGained),
    isActive: () => Currency.timeShards.gt(0),
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("time"),
  }
};
