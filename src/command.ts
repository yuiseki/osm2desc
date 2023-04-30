import yargs from "yargs/yargs";
import { promises as fs } from "fs";
import { osm2desc } from ".";

const argv = yargs(process.argv.slice(2))
  .option("id", {
    type: "string",
    alias: "i",
    description:
      "ID of a node, a way or a relation on the OpenStreetMap (node/1234, way/1234, relation/1234)",
  })
  .help()
  .parseSync();

const main = async () => {
  const input = argv._[0] as string;
  if (!input || input === "") {
    console.info("Usage:");
    console.info("\tosm2desc [osm_id] {options}");
    console.info("\tosm2desc --help");
    process.exit(1);
  }
  const output = await osm2desc(input);
  console.log(output);
};

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
  }
})();
