import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { Subject } from "./subject";
import { Min, Max } from "class-validator";
import { Status } from "../utils/constants";

@Entity("student")
export class Student {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    first_name: string;

    @Column({ default: null })
    last_name: string;

    @Column({ type: "timestamp" })
    dob: Date;

    @Column({ type: "int" })
    @Min(1)
    @Max(100)
    age: number;

    @Column()
    standard: number;

    @Column({ type: "varchar" })
    skills: string;

    @Column({ type: "varchar" })
    intro: string;

    @Column({ type: "timestamp" })
    enrolment_from: Date;

    @Column({ type: "timestamp" })
    enrolment_to: Date;

    @Column({ type: "enum", enum: Status })
    status: Status;

    @Column({ type: "boolean" })
    is_active: boolean;

    @ManyToMany(() => Subject)
    @JoinTable({
        name: "student_subject",
        joinColumn: {
            name: "student_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "subject_id",
            referencedColumnName: "id",
        },
    })
    subjects: Subject[];
}
