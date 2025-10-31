import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../database/base-entity';

@Entity('user')
export class User extends BaseEntity {
  // Email fields
  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  emailVerificationToken: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  verifiedAt: Date | null;

  // Phone fields
  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ default: false })
  isPhoneVerified: boolean;

  // Profile fields
  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', nullable: true })
  fullName: string | null;

  @Column({ type: 'varchar', nullable: true })
  companyName: string | null;

  @Column({ type: 'varchar', unique: true, nullable: true })
  username: string | null;

  @Column({ type: 'varchar', unique: true, nullable: true })
  taxCode: string | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, type: 'timestamptz' })
  bannedUntil?: Date;

  @Column({ type: 'varchar', nullable: true })
  banReason?: string;

  @Column()
  hashedPassword: string;

  // Relationships can be added here in the future
}
