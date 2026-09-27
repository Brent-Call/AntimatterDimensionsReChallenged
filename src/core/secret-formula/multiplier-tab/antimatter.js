import { MultiplierTabHelper } from "./helper-functions";
import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const AM = {
  total: {
    name: "Antimatter Production",
    displayOverride: () => `${format(Currency.antimatter.productionPerSecond, 2, 2)}/sec`,
    multValue: () => new Decimal(Currency.antimatter.productionPerSecond).clampMin(1),
    isActive: true,
    overlay: ["<i class='fas fa-atom' />"],
  },
  antimatterChallenge2: {
    name: "Antimatter Challenge 2 Effect",
    displayOverride: () => {
      const activeDims = MultiplierTabHelper.activeDimCount("AD");
      const dimString = MultiplierTabHelper.pluralizeDimensions(activeDims);
      return `/${format(1 / player.chall2Pow, 2, 2)} on ${formatInt(activeDims)} ${dimString}
        ➜ /${format(1 / Math.pow(player.chall2Pow, activeDims), 2, 2)}`;
    },
    multValue: () => {
      const activeDims = MultiplierTabHelper.activeDimCount("AD");
      return Math.pow(player.chall2Pow, activeDims);
    },
    isActive: () => NormalChallenge(2).isRunning,
    icon: MultiplierTabIcons.CHALLENGE("antimatter"),
  },
  effarigAM: {
    name: "Glyph Effect - Effarig Antimatter Production",
    powValue: () => {
      const ad1 = AntimatterDimension(1);
      const baseProd = ad1.totalAmount.times(ad1.multiplier).times(Tickspeed.perSecond);
      return Math.pow(baseProd.log10(), getAdjustedGlyphEffect("effarigantimatter") - 1);
    },
    isActive: () => getAdjustedGlyphEffect("effarigantimatter") > 1 && AntimatterDimension(1).isProducing,
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("effarig"),
  }
};
