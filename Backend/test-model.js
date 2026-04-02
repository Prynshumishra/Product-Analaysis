import { getGenderDistribution, getAgeDistribution, getFeatureTotals } from "./src/models/analyticsModel.js";

async function test() {
  try {
    const gender = await getGenderDistribution({});
    console.log("Gender:", gender);
    const age = await getAgeDistribution({});
    console.log("Age:", age);
    const totals = await getFeatureTotals({});
    console.log("Totals:", totals);
  } catch (e) {
    console.error(e);
  }
}

test();
