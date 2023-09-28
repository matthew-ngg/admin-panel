export type ShiftStatusType = 'PENDING' | 'CONFIRMED' | 'DECLINED'

export type ShiftRoleType = 'ST' | 'PWH' | 'EN'

export interface ShiftData {
  uuid: string;
  startedAt: string;
  endedAt: string;
  status: ShiftStatusType;
  userId: number;
  chiName: string;
  lastName: string;
  firstName: string;
  role: ShiftRoleType;
}

export interface ShiftDataDTO {
  [month: string]: {
    [date: string]: ShiftData[]
  }
}

export type CheckboxInfo = {
  value: string;
  selected: boolean;
};

export type PostDataProps = {
  uuids: string[];
  action: 'CONFIRMED' | 'DECLINED';
}