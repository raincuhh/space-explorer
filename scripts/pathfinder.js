/**
 * pathfinderManager
 * handles pathfinders, their stats and traits, etc.
 */
const PFM = {
  init: function () {},
  baseTraitNum: 2,
  createPathfinder: function (pathfinder) {
    let index = PathfinderCharLib.findIndex((char) => char.name === pathfinder);
    if (index === -1) {
      console.error("Character not found in PathfinderCharLib:", pathfinder);
      return;
    }

    // disabled for demo
    //this.randomizeTraits(pathfinder, this.baseTraitNum);
    this.setBaseSkills(pathfinder, index);
    this.setBaseStats(pathfinder, index);
  },

  randomizeTraits: function (pathfinder, numberOfTraits) {
    let positiveTraitList = PathfinderTraitsLib[0];
    let negativeTraitList = PathfinderTraitsLib[1];

    for (let i = 0; i < Math.floor(numberOfTraits / 2); i++) {
      let randomTrait = this.getRandPositiveTrait();
      let traitIndex = positiveTraitList[randomTrait];
      let trait = traitIndex.name;
      SM.setTrait(pathfinder, trait, true, false);
      //console.log("trait added: " + trait);
    }
    for (let i = 0; i < Math.floor(numberOfTraits / 2); i++) {
      let randomTrait = this.getRandNegativeTrait();
      let traitIndex = negativeTraitList[randomTrait];
      let trait = traitIndex.name;
      SM.setTrait(pathfinder, trait, true, false);
      //console.log("trait added: " + trait);
    }
  },

  getRandPositiveTrait: function () {
    let traitList = PathfinderTraitsLib[0];
    let trait = this.getTraitPool(traitList);
    return trait;
  },

  getRandNegativeTrait: function () {
    let traitList = PathfinderTraitsLib[1];
    let trait = this.getTraitPool(traitList);
    return trait;
  },

  getTraitPool: function (traitList) {
    let rareTreshold = 0.3;
    let commonTraits = traitList.filter((e) => e.rarity === "common");
    let rareTraits = traitList.filter((e) => e.rarity === "rare");

    let selectedTrait;
    let randomValue = Math.random();
    //console.log(randomValue);

    if (randomValue > rareTreshold) {
      selectedTrait = Math.floor(Math.random() * commonTraits.length);
    } else {
      selectedTrait = Math.floor(Math.random() * rareTraits.length);
    }

    return selectedTrait;
  },

  includeTraitPing: function (trait, bool) {
    let matchedTrait;
    for (let i = 0; i < PathfinderTraitsLib.length; i++) {
      let traitList = PathfinderTraitsLib[i];
      let foundTrait = traitList.find((e) => e.name === trait);
      if (foundTrait) {
        matchedTrait = foundTrait;
        break;
      }
    }
    if (!bool) {
      return;
    }
    if (matchedTrait) {
      PM.ping(matchedTrait.ping);
    } else {
      console.error();
    }
  },

  setBaseSkills: function (pathfinder, index) {
    let skills = PathfinderCharLib[index].skills;
    //console.log(skills);
    if (!skills) {
      console.error("skill for given index not found");
      return;
    }
    //SM.setSkills(pathfinder, skills)

    skills.forEach((skill) => {
      SM.setSkill(pathfinder, skill, true);
    });
  },

  includeSkillPing: function (skill, bool) {},
  setBaseStats: function (pathfinder, index) {
    let stats = PathfinderCharLib[index].stats;
    if (!stats) {
      console.error("stat for given index not found");
      return;
    }
    SM.setStats(pathfinder, stats);
  },
};
