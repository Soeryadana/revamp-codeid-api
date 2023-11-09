type ProgramAppliedType = {
  progEntityId: number;
  progTitle: string;
  progImage: string;
};

type ApplyProgressType = {
  applyDate: Date;
  applyStatus: string;
  latestProgress: string;
};

export class DashboardInterface {
  userEntityId: number;
  userFirstName: string;
  userLastName: string;
  programApplied: ProgramAppliedType[];
  applyProgress: ApplyProgressType[];
}
