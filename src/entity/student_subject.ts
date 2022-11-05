import { IsNotEmpty } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("student_subject")
export default class StudentSubject {
    
    @Column()
    @IsNotEmpty()
    @PrimaryColumn()
    student_id: string;

    @Column()
    @IsNotEmpty()
    @PrimaryColumn()
    subject_id: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;
}
