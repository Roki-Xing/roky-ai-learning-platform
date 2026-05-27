import { seedDefaultDomainsAndTopics, seedDefaultKnowledgeBase } from "@/server/seed/seed";

async function main() {
  await seedDefaultDomainsAndTopics();
  await seedDefaultKnowledgeBase();
}

main()
  .then(() => {
    console.log("Seed complete");
  })
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
