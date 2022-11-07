import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { Min, Max } from "class-validator";
import { Status } from "../utils/constants";
import { Subject } from "./subject";

@Entity("student")
export class Student {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null })
    first_name: string;

    @Column({ default: null })
    last_name: string;

    @Column({ nullable: false, unique: true })
    mobile_number: string;

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
    @JoinTable()
    subjects: Subject[];
}
