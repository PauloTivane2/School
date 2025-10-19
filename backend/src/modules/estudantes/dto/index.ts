export interface CreateStudentDTO {
  name: string;
  dateOfBirth: string;
  identificationNumber: string;
  gender: 'M' | 'F';
  classId: string;
  guardianId?: string;
}

export interface UpdateStudentDTO {
  name?: string;
  dateOfBirth?: string;
  identificationNumber?: string;
  gender?: 'M' | 'F';
  classId?: string;
  guardianId?: string;
}