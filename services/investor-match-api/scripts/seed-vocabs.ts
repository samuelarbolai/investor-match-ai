import { collections, Timestamp } from '../src/config/firebase';
import { ensureValidDocumentId } from '../src/utils/document-id';
import {
  jobToBeDoneSeeds,
  skillSeeds,
  industrySeeds,
  verticalSeeds,
  jobRoleSeeds,
  productTypeSeeds,
  companyHeadcountRangeSeeds,
  engineeringHeadcountRangeSeeds,
  targetDomainSeeds,
  distributionCapabilitySeeds,
  raisedCapitalRangeSeeds
} from './schema-vocab-data';

type CollectionGetter = () => FirebaseFirestore.CollectionReference;

async function seedStringCollection(values: string[], getter: CollectionGetter, label: string) {
  for (const value of values) {
    const id = ensureValidDocumentId(value);
    const docRef = getter().doc(id);
    await docRef.set({
      id,
      label: value,
      contact_ids: [],
      updated_at: Timestamp.now()
    }, { merge: true });
    console.log(`Seeded ${label}: ${value}`);
  }
}

async function seedRaisedCapitalRanges() {
  for (const range of raisedCapitalRangeSeeds) {
    const id = ensureValidDocumentId(range.label);
    const docRef = collections.raisedCapitalRanges().doc(id);
    await docRef.set({
      id,
      label: range.label,
      min_amount: range.min ?? null,
      max_amount: range.max ?? null,
      contact_ids: [],
      updated_at: Timestamp.now()
    }, { merge: true });
    console.log(`Seeded raised capital range: ${range.label}`);
  }
}

async function seedDistributionCapabilities() {
  for (const capability of distributionCapabilitySeeds) {
    const id = ensureValidDocumentId(capability.label);
    const docRef = collections.distributionCapabilities().doc(id);
    await docRef.set({
      id,
      distribution_type: capability.distribution_type,
      label: capability.label,
      description: capability.description,
      contact_ids: [],
      updated_at: Timestamp.now()
    }, { merge: true });
    console.log(`Seeded distribution capability: ${capability.label}`);
  }
}

async function main() {
  await seedStringCollection(jobToBeDoneSeeds, collections.jobToBeDone, 'jobToBeDone');
  await seedStringCollection(skillSeeds, collections.skills, 'skills');
  await seedStringCollection(industrySeeds, collections.industries, 'industries');
  await seedStringCollection(verticalSeeds, collections.verticals, 'verticals');
  await seedStringCollection(productTypeSeeds, collections.productTypes, 'productTypes');
  await seedStringCollection(companyHeadcountRangeSeeds, collections.companyHeadcountRanges, 'companyHeadcountRanges');
  await seedStringCollection(engineeringHeadcountRangeSeeds, collections.engineeringHeadcountRanges, 'engineeringHeadcountRanges');
  await seedStringCollection(targetDomainSeeds, collections.targetDomains, 'targetDomains');
  await seedStringCollection(jobRoleSeeds, collections.roles, 'roles');
  await seedRaisedCapitalRanges();
  await seedDistributionCapabilities();
  console.log('Seeding completed.');
}

main().catch(error => {
  console.error('Seeding failed', error);
  process.exitCode = 1;
});
