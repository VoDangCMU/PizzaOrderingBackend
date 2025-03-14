import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import Pizza from "@root/entity/Pizza";
import Invoice from "@root/entity/Invoice";

@Entity()
export default class Feedback {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @ManyToOne(() => Pizza, { onDelete: "CASCADE" })
    pizza: Pizza;

    @ManyToOne(() => Invoice, { onDelete: "CASCADE" })
    invoice: Invoice;

    @Column()
    feedback: string;
}