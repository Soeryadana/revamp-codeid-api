import { ProgramEntity } from 'output/entities/ProgramEntity';
export class PaginationInterface {
  data: ProgramEntity[];
  page: number;
  limit: number;
  totalCount: number;
}
