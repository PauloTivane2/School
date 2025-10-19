export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  identification_number: string;
  date_of_birth: Date;
  gender: 'M' | 'F' | 'Other';
  address?: string;
  phone_number?: string;
  email?: string;
  parent_id?: string;
  class_id?: string;
  enrollment_date: Date;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  notes?: string;
  parent_name?: string;
  class_name?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface CreateStudentDTO {
  first_name: string;
  last_name: string;
  identification_number: string;
  date_of_birth: Date;
  gender: 'M' | 'F' | 'Other';
  address?: string;
  phone_number?: string;
  email?: string;
  parent_id?: string;
  class_id?: string;
  enrollment_date?: Date;
  status?: 'active' | 'inactive' | 'graduated' | 'transferred';
  notes?: string;
}

export interface UpdateStudentDTO {
  first_name?: string;
  last_name?: string;
  identification_number?: string;
  date_of_birth?: Date;
  gender?: 'M' | 'F' | 'Other';
  address?: string;
  phone_number?: string;
  email?: string;
  parent_id?: string;
  class_id?: string;
  enrollment_date?: Date;
  status?: 'active' | 'inactive' | 'graduated' | 'transferred';
  notes?: string;
}