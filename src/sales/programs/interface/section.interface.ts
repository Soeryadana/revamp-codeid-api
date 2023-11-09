type sectionDetail = {
  secdId: number;
  secdTitle: string;
};

export class SectionInterface {
  sectId: number;
  sectProgEntityId: number;
  sectTitle: string;
  sectionDetails: sectionDetail[];
}
