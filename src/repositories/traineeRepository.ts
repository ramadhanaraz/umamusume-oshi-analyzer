import { Trainee } from '../types/trainee';
import { TRAINEES } from '../data/trainees';
import { TRAINEE_PORTRAITS } from '../data/traineePortraits';

export interface ITraineeRepository {
  getAllTrainees(): Promise<Trainee[]>;
  getTraineeById(id: string): Promise<Trainee | null>;
  searchTrainees(query: string): Promise<Trainee[]>;
  getPortraitUrl(portraitPath?: string): string;
}

export class StaticTraineeRepository implements ITraineeRepository {
  private trainees: Trainee[];
  private portraitsMap: Record<string, string>;

  constructor(traineesData = TRAINEES, portraitsData = TRAINEE_PORTRAITS) {
    this.trainees = traineesData;
    this.portraitsMap = portraitsData;
  }

  async getAllTrainees(): Promise<Trainee[]> {
    return [...this.trainees];
  }

  async getTraineeById(id: string): Promise<Trainee | null> {
    const found = this.trainees.find((t) => t.id === id);
    return found ? { ...found } : null;
  }

  async searchTrainees(query: string): Promise<Trainee[]> {
    if (!query.trim()) return this.getAllTrainees();
    const q = query.toLowerCase().trim();
    return this.trainees.filter(
      (t) =>
        t.nameEn.toLowerCase().includes(q) ||
        t.nameJp.includes(q) ||
        t.id.toLowerCase().includes(q)
    );
  }

  getPortraitUrl(portraitPath?: string): string {
    if (!portraitPath) return '/images/trainees/default.jpg';
    return this.portraitsMap[portraitPath] || portraitPath;
  }

  getAllTraineesSync(): Trainee[] {
    return this.trainees;
  }

  getTraineeByIdSync(id: string): Trainee | null {
    return this.trainees.find((t) => t.id === id) || null;
  }
}

export const traineeRepository = new StaticTraineeRepository();
