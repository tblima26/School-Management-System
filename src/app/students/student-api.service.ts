import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, of, type Observable } from 'rxjs';

export type EnrollmentStatus = 'Ativo' | 'Inativo';

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  university: string;
  status: EnrollmentStatus;
}

export type StudentPayload = Omit<Student, 'id'>;

interface ApiUser extends Omit<Student, 'id' | 'status'> {
  id: number;
  status?: EnrollmentStatus;
}

interface UsersResponse {
  users: ApiUser[];
}

@Injectable({ providedIn: 'root' })
export class StudentApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'https://dummyjson.com/users';
  private readonly locallyCreatedIds = new Set<number>();

  getStudents(): Observable<Student[]> {
    return this.http.get<UsersResponse>(`${this.endpoint}?limit=100`).pipe(
      map(({ users }) => users.map((user) => ({ ...user, status: user.status ?? 'Ativo' }))),
    );
  }

  createStudent(payload: StudentPayload): Observable<Student> {
    return this.http.post<Student>(`${this.endpoint}/add`, payload).pipe(
      map((student) => {
        this.locallyCreatedIds.add(student.id);
        return student;
      }),
    );
  }

  updateStudent(id: number, payload: StudentPayload): Observable<Student> {
    if (this.locallyCreatedIds.has(id)) return of({ id, ...payload });
    return this.http.put<Student>(`${this.endpoint}/${id}`, payload);
  }

  deleteStudent(id: number): Observable<{ isDeleted: boolean; id: number }> {
    if (this.locallyCreatedIds.delete(id)) return of({ isDeleted: true, id });
    return this.http.delete<{ isDeleted: boolean; id: number }>(`${this.endpoint}/${id}`);
  }
}