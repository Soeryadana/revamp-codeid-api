import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';

import { ProgramEntity } from 'output/entities/ProgramEntity';
import { ProgramEntityDescription } from 'output/entities/ProgramEntityDescription';
import { Sections } from 'output/entities/Sections';
import { ProgramReviews } from 'output/entities/ProgramReviews';
import { Batch } from 'output/entities/Batch';
import { InstructorPrograms } from 'output/entities/InstructorPrograms';
import { ProgramApply } from 'output/entities/ProgramApply';
import { ProgramApplyProgress } from 'output/entities/ProgramApplyProgress';
import { Users } from 'output/entities/Users';
import { UsersEducation } from 'output/entities/UsersEducation';
import { Status } from 'output/entities/Status';
import { RouteActions } from 'output/entities/RouteActions';

import { PaginationDto } from './dto/programs-pagination.dto';
import { UsersDto } from './dto/programs-user.dto';
import { UsersEducationDto } from './dto/programs-user-education.dto';

import { PaginationInterface } from './interface/pagination.interface';
import { LocationInterface } from './interface/location.interface';
import { SectionInterface } from './interface/section.interface';
import { BatchInterface } from './interface/batch.interface';
import { DashboardInterface } from './interface/dashboard.interface';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(ProgramEntity)
    private servicePE: Repository<ProgramEntity>,
    @InjectRepository(ProgramEntityDescription)
    private servicePED: Repository<ProgramEntityDescription>,
    @InjectRepository(Sections)
    private serviceS: Repository<Sections>,
    @InjectRepository(ProgramReviews)
    private servicePR: Repository<ProgramReviews>,
    @InjectRepository(Batch) private serviceB: Repository<Batch>,
    @InjectRepository(InstructorPrograms)
    private serviceIP: Repository<InstructorPrograms>,
    @InjectRepository(ProgramApply) private servicePA: Repository<ProgramApply>,
    @InjectRepository(ProgramApplyProgress)
    private servicePAP: Repository<ProgramApplyProgress>,
    @InjectRepository(Users) private serviceU: Repository<Users>,
    @InjectRepository(UsersEducation)
    private serviceUE: Repository<UsersEducation>,
  ) {}

  private order(orderBy: string) {
    // set order by clause

    let orderObject: { [key: string]: 'DESC' } = {};

    if (orderBy === 'Online/Offline') {
      orderObject = { progLearningType: 'DESC' };
    } else if (orderBy === 'Latest') {
      orderObject = { progModifiedDate: 'DESC' };
    } else {
      orderObject = { progRating: 'DESC' };
    }

    return orderObject;
  }

  public async getPrograms(
    orderBy: string,
    search: string,
    options: PaginationDto,
  ): Promise<PaginationInterface> {
    try {
      const order = this.order(orderBy);

      const skippedItems = (options.page - 1) * options.limit;
      if (search) {
        const totalCount = await this.servicePE.count({
          where: {
            progTitle: ILike(`%${search}%`),
          },
        });
        const programs = await this.servicePE.find({
          take: options.limit,
          skip: skippedItems,
          where: {
            progTitle: ILike(`%${search}%`),
          },
          order: order,
        });
        return {
          totalCount,
          page: options.page,
          limit: options.limit,
          data: programs,
        };
      } else {
        const totalCount = await this.servicePE.count();
        const programs = await this.servicePE.find({
          take: options.limit,
          skip: skippedItems,
          order: order,
        });

        return {
          totalCount,
          page: options.page,
          limit: options.limit,
          data: programs,
        };
      }
    } catch (error) {
      return error.message;
    }
  }

  private async getProgramDetail(progEntityId: number): Promise<ProgramEntity> {
    try {
      const ProgramEntity = await this.servicePE.findOne({
        select: {
          progEntityId: true,
          progTitle: true,
          progHeadline: true,
          progTotalTrainee: true,
          progPrice: true,
          progDuration: true,
          progDurationType: true,
        },
        where: { progEntityId: progEntityId },
      });
      return ProgramEntity;
    } catch (error) {
      return error.message;
    }
  }

  private async getInstructorProgram(
    progEntityId: number,
  ): Promise<InstructorPrograms> {
    try {
      const instructor = await this.serviceIP
        .createQueryBuilder('instructorPrograms')
        .select([
          'instructorPrograms.inproFirstName',
          'instructorPrograms.inproLastName',
          'instructorPrograms.inproPhoto',
        ])
        .leftJoin('instructorPrograms.batch', 'batch')
        .where('batch.batchEntityId = :progEntityId', {
          progEntityId,
        })
        .getOneOrFail();

      return instructor;
    } catch (error) {
      return error.message;
    }
  }

  private async getLearnItems(
    progEntityId: number,
  ): Promise<ProgramEntityDescription[]> {
    try {
      const progEntityDesc = await this.servicePED.find({
        where: { predProgEntityId: progEntityId },
      });

      return progEntityDesc;
    } catch (error) {
      return error.messasge;
    }
  }

  private async getSections(progEntityId: number): Promise<SectionInterface[]> {
    try {
      const sections = await this.serviceS.find({
        where: { sectProgEntityId: progEntityId },
        relations: { sectionDetails: true },
      });

      const result = sections.map((section) => ({
        sectId: section.sectId,
        sectProgEntityId: section.sectProgEntityId,
        sectTitle: section.sectTitle,
        sectionDetails: section.sectionDetails.map((sectionDetail) => ({
          secdId: sectionDetail.secdId,
          secdTitle: sectionDetail.secdTitle,
        })),
      }));

      return result;
    } catch (error) {
      return error.message;
    }
  }

  private async getProgramReviews(
    progEntityId: number,
  ): Promise<ProgramReviews[]> {
    try {
      const review = await this.servicePR
        .createQueryBuilder('review')
        .select([
          'review.prowProgEntityId',
          'review.prowReview',
          'review.prowRating',
          'user.userEntityId',
          'user.userFirstName',
          'user.userLastName',
          'user.userPhoto',
        ])
        .leftJoin('review.prowUserEntity', 'user')
        .where('review.prowProgEntity = :progEntityId', { progEntityId })
        .getMany();

      return review;
    } catch (error) {
      return error.message;
    }
  }

  private async getLocationDetails(
    progEntity: number,
  ): Promise<LocationInterface> {
    try {
      const location = await this.servicePE.findOne({
        where: { progEntityId: progEntity },
        relations: [
          'progCity',
          'progCity.cityProv',
          'progCity.cityProv.provCountryCode',
        ],
      });

      const result = {
        cityName: location.progCity.cityName,
        provName: location.progCity.cityProv.provName,
        coutryName: location.progCity.cityProv.provCountryCode.countryName,
      };

      return result;
    } catch (error) {
      return error.message;
    }
  }

  private async getBatch(progEntityId: number): Promise<BatchInterface> {
    try {
      const startDate = await this.serviceB.findOne({
        where: {
          batchEntityId: progEntityId,
          batchStatus: { status: 'Pending' },
        },
        relations: {
          batchStatus: true,
        },
      });

      const endDate = await this.serviceB.findOne({
        where: {
          batchEntityId: progEntityId,
          batchStatus: { status: 'Running' },
        },
        relations: {
          batchStatus: true,
        },
      });

      const batch = {
        batchName: endDate.batchName,
        startDate: startDate.batchStartDate,
        endDate: endDate.batchEndDate,
      };

      return batch;
    } catch (error) {
      return error.message;
    }
  }

  public async viewDetail(progEntityId: number) {
    try {
      const programDetail = await this.getProgramDetail(progEntityId);
      const instructorProgram = await this.getInstructorProgram(progEntityId);
      const progEntityDesc = await this.getLearnItems(progEntityId);
      const section = await this.getSections(progEntityId);
      const review = await this.getProgramReviews(progEntityId);
      const location = await this.getLocationDetails(progEntityId);
      const batch = await this.getBatch(progEntityId);

      return {
        programDetail,
        instructorProgram,
        progEntityDesc,
        section,
        review,
        location,
        batch,
      };
    } catch (error) {
      return error.message;
    }
  }

  public async getApplyProgress(
    userEntityId: number,
    progEntityId: number,
  ): Promise<ProgramApplyProgress[]> {
    try {
      const progress = await this.servicePAP.find({
        select: {
          parogActionDate: true,
        },
        where: {
          parogUserEntityId: userEntityId,
          parogProgEntityId: progEntityId,
        },
      });

      return progress;
    } catch (error) {
      return error.message;
    }
  }

  public async applyBootcamp(userEntityId: number, progEntityId: number) {
    try {
      // create new bootcamp apply application

      const Apply = this.servicePA.create({
        prapUserEntityId: userEntityId,
        prapProgEntityId: progEntityId,
        prapTestScore: 0,
        prapGpa: 0,
        prapIqTest: 0,
        prapReview: null,
        prapModifiedDate: new Date(),
        prapStatus: { status: 'Apply' } as Status,
      });

      const createApply = await this.servicePA.save(Apply);

      const ApplyProgress = this.servicePAP.create({
        parogUserEntityId: userEntityId,
        parogProgEntityId: progEntityId,
        parogActionDate: new Date(),
        parogModifiedDate: new Date(),
        parogComment: null,
        parogProgressName: 'Done',
        parogStatus: { status: 'Open' } as Status,
        parogRoac: { roacId: 1 } as RouteActions,
      });

      const createApplyProgress = await this.servicePAP.save(ApplyProgress);

      return { createApply, createApplyProgress };
    } catch (error) {
      return error.message;
    }
  }

  public async getProgramApply(
    userEntityId: number,
    progEntityId: number,
  ): Promise<ProgramApply> {
    try {
      //get program apply data
      const apply = await this.servicePA.findOne({
        where: {
          prapUserEntityId: userEntityId,
          prapProgEntityId: progEntityId,
        },
      });

      return apply;
    } catch (error) {
      error.message;
    }
  }

  public async getUser(userEntityId: number): Promise<Users> {
    try {
      const User = await this.serviceU.findOne({
        where: { userEntityId: userEntityId },
      });
      return User;
    } catch (error) {
      return error.message;
    }
  }

  public async getUserEdu(userEntityId: number): Promise<UsersEducation> {
    try {
      const userEdu = await this.serviceUE.findOne({
        where: { usduEntityId: userEntityId },
      });
      return userEdu;
    } catch (error) {
      return error.message;
    }
  }

  public async applyRegularBootcamp(
    userEntityId: number,
    progEntityId: number,
    user: UsersDto,
    education: UsersEducationDto,
    files: any,
  ) {
    try {
      type ApplyType = {
        createApply: ProgramApply;
        createApplyProgress: ProgramApplyProgress;
      };

      let apply: ApplyType;
      const checkApply = await this.getProgramApply(userEntityId, progEntityId);

      if (!checkApply) {
        apply = await this.applyBootcamp(userEntityId, progEntityId);
      }

      //update user data
      const getUser = await this.getUser(userEntityId);

      getUser.userFirstName = user.firstName;
      getUser.userLastName = user.lastName;
      getUser.userBirthDate = user.birthDate;
      getUser.userPhoto = files['photo'][0].originalname;
      getUser.userCv = files['cv'][0].originalname;

      const usersUpdate = await this.serviceU.save(getUser);

      //update user education data
      let getUserEdu = await this.getUserEdu(userEntityId);

      const userEduData = {
        usduSchool: education.school,
        usduDegree: education.degree,
        usduFieldStudy: education.fieldStudy,
        usduEntityId: userEntityId,
      };

      if (getUserEdu) {
        getUserEdu = { ...getUserEdu, ...userEduData };
      } else {
        getUserEdu = this.serviceUE.create(userEduData);
      }

      const usersEduUpdate = await this.serviceUE.save(getUserEdu);

      return { usersUpdate, usersEduUpdate, apply };
    } catch (error) {
      return error.message;
    }
  }

  public async getDashboard(userEntityId: number): Promise<DashboardInterface> {
    try {
      //prapMdifiedDate as prapApplyDate, roacName as latestProgress

      const dashboard = await this.serviceU
        .createQueryBuilder('u')
        .distinctOn(['pe.progEntityId'])
        .innerJoinAndSelect('u.programApplies', 'pa')
        .innerJoinAndSelect('u.programApplyProgresses', 'pap')
        .innerJoinAndSelect('pa.prapProgEntity', 'pe')
        .innerJoinAndSelect('pap.parogRoac', 'ra')
        .where('u.userEntityId = :userEntityId', { userEntityId })
        .andWhere('pa.prapProgEntityId = pap.parogProgEntityId')
        .orderBy('pe.progEntityId')
        .getOne();

      const result = {
        userEntityId: dashboard.userEntityId,
        userFirstName: dashboard.userFirstName,
        userLastName: dashboard.userLastName,
        programApplied: dashboard.programApplies.map((apply) => ({
          progEntityId: apply.prapProgEntity.progEntityId,
          progTitle: apply.prapProgEntity.progTitle,
          progImage: apply.prapProgEntity.progImage,
        })),
        applyProgress: dashboard.programApplyProgresses.map((progress) => ({
          applyDate: progress.parogModifiedDate,
          applyStatus: progress.parogProgressName,
          latestProgress: progress.parogRoac.roacName,
        })),
      };

      return result;
    } catch (error) {
      return error.message;
    }
  }
}
